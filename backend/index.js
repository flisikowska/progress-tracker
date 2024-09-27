import pg from 'pg';
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

//TODO https://node-postgres.com/guides/async-express
app.get('/', async (req, res) => {
  const response = await executeQuery('SELECT $1::text as message', ['Hello world!'])
  res.send(response);
})

app.get('/group', async (req, res) => {
  const user_id = "100262135207672155021";
  const query = `
    SELECT 
    g.name AS group_name,
    g.goal AS group_goal,
    u.name AS user_name,
    u.color AS user_color,
    u.user_id 
    FROM public.group g
    JOIN public.user u ON u.group_id = g.group_id
    WHERE g.group_id = (SELECT CU.group_id FROM public.user CU WHERE CU.user_id = $1 LIMIT 1)
`;
  const response = await executeQuery(query, [user_id])
  const groupData = {
    group_name: response[0].group_name,
    group_goal: response[0].group_goal,
    users: response.map(row => ({
      user_id: row.user_id,
      user_name: row.user_name,
      user_color: row.user_color
    }))
  };
  res.send(groupData);
});

app.get('/activities', async (req, res) => {
  const user_id = "100262135207672155021";
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
	    U.user_id,
      AT.activity_type_id,
      A.date AS activity_date,
      A.activity_id,
      A.amount AS time
    FROM public.group 
    JOIN public.user U ON public.group.group_id= U.group_id
    JOIN public.activity A ON A.user_id = U.user_id
    JOIN public.activity_type AT ON AT.activity_type_id = A.activity_type_id
    WHERE 
      public.group.group_id = (SELECT CU.group_id FROM public.user CU WHERE CU.user_id=$1 LIMIT 1)
    AND U.user_id = $1
	  AND A.date IN (${datePlaceholders})
  `;
  const response = await executeQuery(query, [user_id, ...dates]);
  res.send(response);
})

app.get('/current-week', jsonParser, authenticateToken, async (req, res) => {
  const user_id = "100262135207672155021";
  const beginning_of_current_week = getMonday();
  const query = `
    SELECT 
	    U.user_id,
      AT.activity_type_id,
      AT.name AS activity_type_name,
      A.date,
      A.activity_id,
      A.amount AS activity_amount
    FROM public.group 
    JOIN public.user U ON public.group.group_id= U.group_id
    JOIN public.activity A ON A.user_id = U.user_id
    JOIN public.activity_type AT ON AT.activity_type_id = A.activity_type_id
    WHERE 
      public.group.group_id = (SELECT CU.group_id FROM public.user CU WHERE CU.user_id=$1 LIMIT 1)
	  AND A.date >= $2
  `;
  const response = await executeQuery(query, [user_id, beginning_of_current_week]);
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
      date: row.date.toISOString().split('T')[0],
      time: row.activity_amount
    });
  });
  res.send(result);
});

app.get('/last-10-weeks', async (req, res) => {
  const query = `
    SELECT 
        U.user_id,
        DATE_TRUNC('week', A.date) AS week_start,
        SUM(A.amount) AS total_amount
    FROM public.activity A
    JOIN public.user U ON A.user_id = U.user_id
    WHERE A.date >= NOW() - INTERVAL '10 weeks'
    GROUP BY U.user_id, week_start
    ORDER BY week_start DESC, user_id
  `;
  const response = await executeQuery(query);
  const result = {};
  response.forEach(row => {
    const week = row.week_start.toISOString().split('T')[0];
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

app.delete('/activities/:id', async (req, res) => {
  const user_id = "100262135207672155021";
  const activity_id=req.params.id;
  const query = `
    DELETE FROM public.activity 
    WHERE activity_id=$1 AND user_id=$2
  `;
  await executeQuery(query, [activity_id, user_id]);
  res.send();
})

app.post('/activities', jsonParser,  async (req, res) =>{
  const user_id="100262135207672155021";
  const {activity_type_id, date, amount}= req.body;
  if (!activity_type_id || !date || amount == null)
    return;
  const query=`
    INSERT INTO public.activity(date, activity_type_id, user_id, amount)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `
  const response=await executeQuery(query, [date, activity_type_id, user_id, amount]);
  res.send(response[0]);
})

app.post("/google-auth", jsonParser, async (req, res) => {
  const group_id=1;
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
    const query = `INSERT INTO public.user (user_id, name, group_id, color) 
          VALUES ($1, $2, $3, $4) RETURNING *`;
    const response = await client.query(query, [sub, name, group_id, color]);
    user = response.rows[0];
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

app.listen(port, '0.0.0.0', () => {
  console.log(`Example app listening on port ${port}`);
})