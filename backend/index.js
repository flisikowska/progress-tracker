import pg from 'pg';
import { randomUUID } from 'crypto';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import ggl from 'google-auth-library';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import { runMigrations } from './migrate.js';

dotenv.config({ path: ['.env.local', '.env'] });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const staticDir = path.join(__dirname, 'public');

const { OAuth2Client } = ggl;
const googleClient = new OAuth2Client();

const { Client } = pg;

const dbConfig = {
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT) || 5432,
  database: process.env.PGDATABASE,
};

const JWT_SECRET = process.env.JWT_SECRET;

// Sesja: 30 dni, odświeżana przy każdym zapytaniu (rolling), żeby aktywny user nie wypadał.
const TOKEN_TTL = '30d';
const TOKEN_MAX_AGE = 30 * 24 * 60 * 60 * 1000;
const cookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: 'Strict',
};
const issueAuthCookie = (res, userId) => {
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: TOKEN_TTL });
  res.cookie('token', token, { ...cookieOptions, maxAge: TOKEN_MAX_AGE });
};

const app = express();
const port = process.env.PORT || 5000;
var jsonParser= bodyParser.json();

const corsOptions = {
  credentials: true,
  origin: process.env.CORS_ORIGINS.split(',').map(o=>o.trim())
};

app.use(cookieParser());
app.use(cors(corsOptions));

// Serve the frontend build (copied to ./public in the Docker image)
if (existsSync(staticDir)) {
  app.use(express.static(staticDir));
}

const authenticateToken = (req, res, next) => {
  console.log(req.cookies);
  const token = req.cookies.token; 
  if (!token) {
    return res.sendStatus(401); 
  }
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = { userId: user.userId };
    // Rolling session: odśwież token/cookie przy każdym zapytaniu, żeby aktywny user nie wygasał.
    issueAuthCookie(res, user.userId);
    next();
  });
};

function getMonday() {
  var d = new Date();
  var day = d.getDay() || 7;
  if (day !== 1)
    d.setHours(-24 * (day - 1));
  return d;
}

const GOAL_PERIODS = ['week', 'month', 'year'];

// początek bieżącego okresu celu grupy — od niego liczymy postęp na pie chart
function getPeriodStart(period) {
  const now = new Date();
  if (period === 'month')
    return new Date(now.getFullYear(), now.getMonth(), 1);
  if (period === 'year')
    return new Date(now.getFullYear(), 0, 1);
  return getMonday(); // 'week' (domyślnie)
}

async function executeQuery(query, params) {
  const client = new Client(dbConfig);
  
  try {
    await client.connect();
    const resp = await client.query(query, params);
    return resp.rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error; 
  } finally {
    await client.end();
  }
}

async function userInGroup(userId, groupId){
  const rows=await executeQuery(`SELECT 1 FROM public.user_group WHERE user_id=$1 AND group_id=$2`, [userId, groupId]);
  return rows.length>0;
}

app.get(`/my-groups`, authenticateToken, async (req, res)=>{
  const rows= await executeQuery(`
    SELECT g.group_id, g.name, g.goal
    FROM public.user_group ug
    JOIN public.group g ON g.group_id = ug.group_id
    WHERE ug.user_id= $1
    ORDER By g.name`, [req.user.userId]);
  res.send(rows);
})

app.post('/groups', jsonParser, authenticateToken, async (req, res) => {
  const user_id = req.user.userId;
  const { name, goal, goal_period } = req.body;
  const period = goal_period || 'week';
  if (!name || !name.trim() || goal == null || goal <= 0 || !GOAL_PERIODS.includes(period))
    return res.sendStatus(400);

  const invite_token = randomUUID();
  const rows = await executeQuery(
    `INSERT INTO public.group (name, goal, goal_period, invite_token) VALUES ($1, $2, $3, $4) RETURNING group_id, name, goal, goal_period, invite_token`,
    [name.trim(), goal, period, invite_token]
  );
  const group = rows[0];
  await executeQuery(
    `INSERT INTO public.user_group (user_id, group_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
    [user_id, group.group_id]
  );
  res.status(201).send(group);
})

// Opuszczenie grupy - usuwa członkostwo zalogowanego usera
app.delete('/my-groups/:id', authenticateToken, async (req, res) => {
  const user_id = req.user.userId;
  const group_id = req.params.id;
  await executeQuery(
    `DELETE FROM public.user_group WHERE user_id = $1 AND group_id = $2`,
    [user_id, group_id]
  );
  res.sendStatus(204);
})

// Podgląd grupy po tokenie - do pokazania zaproszenia bez dołączania
app.get('/invite-info', authenticateToken, async (req, res) => {
  const token = req.query.token;
  if (!token) return res.sendStatus(400);
  const rows = await executeQuery(
    `SELECT group_id, name, goal, goal_period FROM public.group WHERE invite_token = $1`,
    [token]
  );
  if (!rows.length) return res.sendStatus(404);
  res.send(rows[0]);
})

// Dołączenie do grupy przez token z linku zapraszającego
app.post('/join', jsonParser, authenticateToken, async (req, res) => {
  const user_id = req.user.userId;
  const { token } = req.body;
  if (!token) return res.sendStatus(400);
  const rows = await executeQuery(
    `SELECT group_id FROM public.group WHERE invite_token = $1`,
    [token]
  );
  if (!rows.length) return res.sendStatus(404);
  const group_id = rows[0].group_id;
  await executeQuery(
    `INSERT INTO public.user_group (user_id, group_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
    [user_id, group_id]
  );
  res.status(200).send({ group_id });
})

// Pobranie tokenu zaproszenia dla grupy (dla starszych grup dogeneruje brakujący)
app.get('/group-invite', authenticateToken, async (req, res) => {
  const user_id = req.user.userId;
  const group_id = req.query.group_id;
  if (!group_id || !(await userInGroup(user_id, group_id)))
    return res.sendStatus(403);
  const rows = await executeQuery(`SELECT invite_token FROM public.group WHERE group_id = $1`, [group_id]);
  let token = rows[0]?.invite_token;
  if (!token) {
    token = randomUUID();
    await executeQuery(`UPDATE public.group SET invite_token = $1 WHERE group_id = $2`, [token, group_id]);
  }
  res.send({ invite_token: token });
})

app.get('/health_check', (req, res) => {
  res.sendStatus(200);
})

//TODO https://node-postgres.com/guides/async-express
app.get('/', async (req, res) => {
  const response = await executeQuery('SELECT $1::text as message', ['Hello world!'])
  res.send(response);
})

app.get('/group', authenticateToken, async (req, res) => {
  const user_id = req.user.userId;
  const group_id = req.query.group_id;
  if(!group_id || !(await userInGroup(user_id, group_id)))
    return res.sendStatus(403);

  const query = `
    SELECT
    g.name AS group_name,
    g.goal AS group_goal,
    g.goal_period AS group_goal_period,
    u.name AS user_name,
    u.color AS user_color,
    u.user_id
    FROM public.group g
    JOIN public.user_group ug ON ug.group_id = g.group_id
    JOIN public.user u ON u.user_id = ug.user_id
    WHERE g.group_id = $1
`;
  const response = await executeQuery(query, [group_id]);
  const groupData = {
    group_name: response[0].group_name,
    group_goal: response[0].group_goal,
    group_goal_period: response[0].group_goal_period,
    users: response.map(row => ({
      user_id: row.user_id,
      user_name: row.user_name,
      user_color: row.user_color
    }))
  };
  res.send(groupData);
});

app.get('/activities', authenticateToken, async (req, res) => {
  const user_id = req.user.userId;

  const selectFrom = `
    SELECT
	    A.user_id,
      AT.activity_type_id,
      A.date::text AS activity_date,
      A.activity_id,
      A.amount AS time,
      (SELECT COALESCE(array_agg(AG.group_id), '{}')
      FROM public.activity_group AG WHERE AG.activity_id = A.activity_id) AS group_ids
    FROM public.activity A
    JOIN public.activity_type AT ON AT.activity_type_id = A.activity_type_id
  `;

  // zakres dat
  if(req.query.from && req.query.to) {
    const query = `${selectFrom} WHERE A.user_id = $1 AND A.date >= $2::date AND A.date <= $3::date`;
    const response = await executeQuery(query, [user_id, req.query.from, req.query.to]);
    res.send(response);
    return;
  }

  if(req.query.date == null)
  {
    res.send([]);
    return;
  }
  const dates = Array.isArray(req.query.date) ? req.query.date : [ req.query.date ];
  const datePlaceholders = dates.map((_, i) => `$${i + 2}`).join(', ');

  if(dates.length == 0) {
    res.send([]);
    return;
  }

  const query = `${selectFrom} WHERE A.user_id = $1 AND A.date IN (${datePlaceholders})`;
  const response = await executeQuery(query, [user_id, ...dates]);
  res.send(response);
})

app.get('/current-period', jsonParser, authenticateToken, async (req, res) => {
  const user_id = req.user.userId;
  const group_id = req.query.group_id;
  if(!group_id || !(await userInGroup(user_id, group_id)))
    return res.sendStatus(403);

  const groupRows = await executeQuery(`SELECT goal_period FROM public.group WHERE group_id = $1`, [group_id]);
  const startDate = getPeriodStart(groupRows[0]?.goal_period);
  // Format jako lokalna data YYYY-MM-DD - porównujemy datę z datą, bez konwersji UTC
  const beginning_of_period = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}`;
  const query = `
    SELECT
	    U.user_id,
      AT.activity_type_id,
      AT.name AS activity_type_name,
      A.date::text AS date,
      A.activity_id,
      A.amount AS activity_amount
    FROM public.user_group UG
    JOIN public.user U ON U.user_id=UG.user_id
    JOIN public.activity A ON A.user_id = U.user_id
    JOIN public.activity_group AG ON AG.activity_id = A.activity_id AND AG.group_id = UG.group_id
    JOIN public.activity_type AT ON AT.activity_type_id = A.activity_type_id
    WHERE UG.group_id = $1
	  AND A.date >= $2::date
  `;
  const response = await executeQuery(query, [group_id, beginning_of_period]);
  const result = [];

  response.forEach(row => {
    let user = result.find(u => u.user_id === row.user_id);
    if (!user) {
      user = {
        user_id: row.user_id,
        activities: []
      };
      result.push(user);
    }
    user.activities.push({
      activity_type_id: row.activity_type_id,
      activity_id: row.activity_id,
      date: row.date,
      time: row.activity_amount
    });
  });
  res.send(result);
});

app.get('/last-10-weeks', authenticateToken, async (req, res) => {
  const user_id = req.user.userId;
  const group_id = req.query.group_id;
  if(!group_id || !(await userInGroup(user_id, group_id)))
    return res.sendStatus(403);

  const query = `
    SELECT
        A.user_id,
        TO_CHAR(DATE_TRUNC('week', A.date), 'YYYY-MM-DD') AS week_start,
        SUM(A.amount) AS total_amount
    FROM public.activity A
    JOIN public.user_group UG ON UG.user_id = A.user_id
    JOIN public.activity_group AG ON AG.activity_id = A.activity_id AND AG.group_id = UG.group_id
    WHERE UG.group_id = $1 AND A.date >= NOW() - INTERVAL '10 weeks'
    GROUP BY A.user_id, week_start
    ORDER BY week_start DESC, A.user_id
  `;
  const response = await executeQuery(query, [group_id]);
  const result = {};
  response.forEach(row => {
    const week = row.week_start;
    if (!result[week]) {
      result[week] = {};
    }
    result[week][row.user_id] = parseInt(row.total_amount) || 0;
  });
  res.send(result);
});

app.get('/activity-types', authenticateToken, async (req, res) => {
  // Sortujemy wg tego, jak często dany user wybierał aktywność (priorytet = najczęściej wybierane).
  // Nowe/nieużywane typy (0 aktywności) lądują na końcu, alfabetycznie.
  const query = `
  SELECT at.activity_type_id AS id, at.icon, at.name
	FROM public.activity_type at
	LEFT JOIN public.activity a
	  ON a.activity_type_id = at.activity_type_id AND a.user_id = $1
	GROUP BY at.activity_type_id, at.icon, at.name
	ORDER BY COUNT(a.activity_id) DESC, at.name ASC;
`;
  const response = await executeQuery(query, [req.user.userId]);
  res.send(response);
});

app.delete('/activities/:id', authenticateToken, async (req, res) => {
  const user_id = req.user.userId;
  const activity_id=req.params.id;
  const query = `
    DELETE FROM public.activity 
    WHERE activity_id=$1 AND user_id=$2
  `;
  await executeQuery(query, [activity_id, user_id]);
  res.send();
})

app.put('/activities/:id', jsonParser, authenticateToken, async (req, res) => {
  const user_id = req.user.userId;
  const activity_id=req.params.id;
  const {activity_type_id, date, amount, group_ids}= req.body;
  if (!activity_type_id || !date || amount == null || amount <= 0)
    return res.sendStatus(400);

  // grupy, do których user faktycznie należy (tylko one są dozwolone)
  const userGroups = await executeQuery(`SELECT group_id FROM public.user_group WHERE user_id = $1`, [user_id]);
  const allowed = userGroups.map(g => g.group_id);
  // domyślnie wszystkie grupy usera; jeśli podano listę - przecinamy z dozwolonymi
  const targetGroups = Array.isArray(group_ids)
    ? group_ids.map(Number).filter(id => allowed.includes(id))
    : allowed;

  const query = `
    UPDATE public.activity SET
      activity_type_id = $1,
      date= $2,
      amount = $3
    WHERE activity_id=$4 AND user_id=$5
    RETURNING *;
  `;

  const response=await executeQuery(query, [activity_type_id, date, amount, activity_id, user_id]);
  const activity = response[0];
  if(!activity) return res.sendStatus(404);

  // dane do treści powiadomienia: imię autora + nazwa typu aktywności
  const actorRows = await executeQuery(`SELECT name FROM public.user WHERE user_id = $1`, [user_id]);
  const actorName = actorRows[0]?.name ?? 'Ktoś';
  const typeRows = await executeQuery(`SELECT name FROM public.activity_type WHERE activity_type_id = $1`, [activity_type_id]);
  const typeName = typeRows[0]?.name ?? 'aktywność';

  await executeQuery(`DELETE FROM public.activity_group WHERE activity_id=$1`, [activity.activity_id]);

  for (const gid of targetGroups) {
    await executeQuery(
      `INSERT INTO public.activity_group (activity_id, group_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [activity.activity_id, gid]
    );
     // powiadomienie dla każdego członka grupy OPRÓCZ autora aktywności
     // nazwę grupy bierzemy z JOIN-a, żeby wpis niósł info z której grupy pochodzi
    await executeQuery(
      `INSERT INTO public.notification (user_id, group_id, group_name, actor_name, activity_type_name, amount, type)
       SELECT ug.user_id, g.group_id, g.name, $2, $3, $4, 'edit'
       FROM public.user_group ug
       JOIN public."group" g ON g.group_id = ug.group_id
       WHERE ug.group_id = $1 AND ug.user_id <> $5`,
      [gid, actorName, typeName, amount, user_id]
    );
  }
  res.send(activity);
})

app.post('/activities', jsonParser, authenticateToken, async (req, res) =>{
  const user_id = req.user.userId;
  const {activity_type_id, date, amount, group_ids}= req.body;
  if (!activity_type_id || !date || amount == null || amount <= 0)
    return res.sendStatus(400);

  // grupy, do których user faktycznie należy (tylko one są dozwolone)
  const userGroups = await executeQuery(`SELECT group_id FROM public.user_group WHERE user_id = $1`, [user_id]);
  const allowed = userGroups.map(g => g.group_id);
  // domyślnie wszystkie grupy usera; jeśli podano listę - przecinamy z dozwolonymi
  const targetGroups = Array.isArray(group_ids)
    ? group_ids.map(Number).filter(id => allowed.includes(id))
    : allowed;

  const query=`
    INSERT INTO public.activity(date, activity_type_id, user_id, amount)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `
  const response=await executeQuery(query, [date, activity_type_id, user_id, amount]);
  const activity = response[0];

  // dane do treści powiadomienia: imię autora + nazwa typu aktywności
  const actorRows = await executeQuery(`SELECT name FROM public.user WHERE user_id = $1`, [user_id]);
  const actorName = actorRows[0]?.name ?? 'Ktoś';
  const typeRows = await executeQuery(`SELECT name FROM public.activity_type WHERE activity_type_id = $1`, [activity_type_id]);
  const typeName = typeRows[0]?.name ?? 'aktywność';

  for (const gid of targetGroups) {
    await executeQuery(
      `INSERT INTO public.activity_group (activity_id, group_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [activity.activity_id, gid]
    );
     // powiadomienie dla każdego członka grupy OPRÓCZ autora aktywności
     // nazwę grupy bierzemy z JOIN-a, żeby wpis niósł info z której grupy pochodzi
    await executeQuery(
      `INSERT INTO public.notification (user_id, group_id, group_name, actor_name, activity_type_name, amount, type)
       SELECT ug.user_id, g.group_id, g.name, $2, $3, $4, 'add'
       FROM public.user_group ug
       JOIN public."group" g ON g.group_id = ug.group_id
       WHERE ug.group_id = $1 AND ug.user_id <> $5`,
      [gid, actorName, typeName, amount, user_id]
    );
  }
  res.send(activity);
})

app.post("/google-auth", jsonParser, async (req, res) => {

  console.log(`POST /google-auth started`);
  try
  {
    const color='000000';
    const { credential, client_id } = req.body;
    const client = new Client(dbConfig);
    await client.connect();
    // try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: client_id,
    });
    const payload = ticket.getPayload();
    const sub = payload["sub"]; 
    const name = payload["given_name"]; 
    const userQuery = `SELECT * FROM public.user WHERE user_id = $1`;
    const resp=await client.query(userQuery, [sub]);
    let user=resp.rows[0];
    if (!user) {
      const query = `INSERT INTO public.user (user_id, name, color)
            VALUES ($1, $2, $3) RETURNING *`;
      const response = await client.query(query, [sub, name, color]);
      user = response.rows[0];
    }
    issueAuthCookie(res, user.user_id);
    res.status(200).json({ message: "Zalogowano pomyślnie" });
    // } catch (err) {
    //   res.status(400).json({ err });
    // }
    await client.end();
  }
  catch(err){
    console.log(err);
    throw err;
  }
});

app.get("/user", authenticateToken, async (req, res) => {
    const query = `SELECT * FROM public.user WHERE user_id = $1`;
    const response = await executeQuery(query, [req.user.userId]);
    if (!response[0]) {
      return res.sendStatus(404);
    }
    res.status(200).json(response);
});

app.put("/user", jsonParser, authenticateToken, async (req, res) => {
    const { name, color } = req.body;
    if (!name || !color) return res.sendStatus(400);
    const query = `UPDATE public.user SET name=$2, color=$3 WHERE user_id=$1 RETURNING *`;
    const response = await executeQuery(query, [req.user.userId, name, color]);
    res.status(200).json(response[0]);
});

app.post("/logout", (req, res) => {
  res.clearCookie('token', cookieOptions);
  res.status(200).json({ message: "Wylogowano pomyślnie" });
});

// Jedna wspólna lista powiadomień usera ze WSZYSTKICH grup (najnowsze na górze)
app.get('/notifications', authenticateToken, async (req, res) => {
  const user_id = req.user.userId;
  const rows = await executeQuery(
    `SELECT notification_id, group_id, group_name, actor_name, activity_type_name, amount, type, is_read, created_at
     FROM public.notification
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [user_id]
  );
  res.send(rows);
});

// Oznacz wszystkie powiadomienia usera (ze wszystkich grup) jako przeczytane
app.post('/notifications/mark-read', authenticateToken, async (req, res) => {
  const user_id = req.user.userId;
  await executeQuery(
    `UPDATE public.notification SET is_read = true
     WHERE user_id = $1 AND is_read = false`,
    [user_id]
  );
  res.sendStatus(204);
});

// Usuń wszystkie powiadomienia usera (ze wszystkich grup)
app.delete('/notifications', authenticateToken, async (req, res) => {
  const user_id = req.user.userId;
  await executeQuery(
    `DELETE FROM public.notification WHERE user_id = $1`,
    [user_id]
  );
  res.sendStatus(204);
});

// SPA fallback: any GET not matched by the API routes above returns index.html
// It must always be declared as the last endpoint
if (existsSync(staticDir)) {
  app.get('/{*splat}', (req, res) => {
    console.log(`Reached fallback at: ${req.url}`);
    res.sendFile(path.join(staticDir, 'index.html'));
  });
}

await runMigrations(dbConfig);

app.listen(port, '0.0.0.0', () => {
  console.log(`Example app listening on port ${port}`);
})
