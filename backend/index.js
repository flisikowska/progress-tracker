import pg from 'pg';
import { randomUUID } from 'crypto';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import ggl from 'google-auth-library';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

const { OAuth2Client } = ggl;
const googleClient = new OAuth2Client();

const { Client } = pg;

const JWT_SECRET = process.env.JWT_SECRET;

const app = express();
const port = 5000;
var jsonParser= bodyParser.json();

const corsOptions = {
  credentials: true,
  origin: ['http://localhost:3000', 'http://localhost:5000', 'http://192.168.1.126:3000', 'http://192.168.1.126:5000'] // Whitelist the domains you want to allow
};

app.use(cookieParser());
app.use(cors(corsOptions));

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
  const client = new Client({
    user: 'postgres',
    password: '123456',
    host: 'localhost',
    port: 5432,
    database: 'progress_tracker',
  });
  
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

  const query = `
    SELECT
	    A.user_id,
      AT.activity_type_id,
      A.date AS activity_date,
      A.activity_id,
      A.amount AS time
    FROM public.activity A
    JOIN public.activity_type AT ON AT.activity_type_id = A.activity_type_id
    WHERE A.user_id = $1
	  AND A.date IN (${datePlaceholders})
  `;
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

app.get('/activity-types', async (req, res) => {
  const query = `
  SELECT activity_type_id AS id, icon, name
	FROM public.activity_type;
`;
  const response = await executeQuery(query, []);
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

  for (const gid of targetGroups) {
    await executeQuery(
      `INSERT INTO public.activity_group (activity_id, group_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [activity.activity_id, gid]
    );
  }
  res.send(activity);
})

app.post("/google-auth", jsonParser, async (req, res) => {
  const default_group_id=1;
  const color='000000';
  const { credential, client_id } = req.body;
  const client = new Client({
    user: "postgres",
    password: "123456",
    host: "localhost",
    port: 5432,
    database: "progress_tracker",
  });
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
    await client.query(
      `INSERT INTO public.user_group (user_id, group_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [user.user_id, default_group_id]
    );
  }
  const token = jwt.sign({ userId: user.user_id }, JWT_SECRET, { expiresIn: '1h' }); 
  res.cookie('token', token, {
    httpOnly: true,
    secure: false, 
    sameSite: 'Strict', 
    maxAge: 3600000 
  });
  res.status(200).json({ message: "Zalogowano pomyślnie" });
  // } catch (err) {
  //   res.status(400).json({ err });
  // }
  await client.end();
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
  res.clearCookie('token', {
    httpOnly: true,
    secure: false,
    sameSite: 'Strict',
  });
  res.status(200).json({ message: "Wylogowano pomyślnie" });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Example app listening on port ${port}`);
})