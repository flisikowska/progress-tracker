import pg from 'pg';

const { Client } = pg;

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
const app = express();
const port = 5000;
var jsonParser= bodyParser.json();

const corsOptions = {
  credentials: true,
  origin: ['http://localhost:3000', 'http://localhost:5000'] // Whitelist the domains you want to allow
};
app.use(cors(corsOptions));
//TODO https://node-postgres.com/guides/async-express
app.get('/', async (req, res) => {
  const client = new Client({
    user: 'postgres',
    password: '123456',
    host: 'localhost',
    port: 5432,
    database: 'progress_tracker',
  });
  await client.connect();
   
  const resp = await client.query('SELECT $1::text as message', ['Hello world!'])
  const response=(resp.rows); // Hello world!
  await client.end();
  res.send(response);
})

function getMonday() {
  var d = new Date();
  var day = d.getDay() || 7; // Get current day number, converting Sun. to 7
  if (day !== 1) // Only manipulate the date if it isn't Mon.
    d.setHours(-24 * (day - 1)); // Set the hours to day number minus 1
  //   multiplied by negative 24
  return d;
}

app.get('/group', async (req, res) => {
  const user_id = 1;
  const query = `
    SELECT 
    g.name AS group_name,
    g.goal AS group_goal,
    u.name AS user_name,
    u.color AS user_color,
    u.user_id 
    FROM public.group g
    JOIN public.user u ON u.group_id = g.group_id
    WHERE g.group_id = (SELECT CU.group_id FROM public.user CU WHERE CU.user_id = $1 LIMIT 1
  )
`;
  const client = new Client({
    user: 'postgres',
    password: '123456',
    host: 'localhost',
    port: 5432,
    database: 'progress_tracker',
  });
 
  await client.connect();
  const resp = await client.query(query, [user_id])
  const groupData = {
    group_name: resp.rows[0].group_name,
    group_goal: resp.rows[0].group_goal,
    users: resp.rows.map(row => ({
      user_id: row.user_id,
      user_name: row.user_name,
      user_color: row.user_color
    }))
  };
  await client.end();
  res.send(groupData);
});

app.get('/activities', async (req, res) => {
  const user_id = 1;
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
      AT.name AS activity_type_name,
      AT.icon AS activity_type_icon,
      A.date AS activity_date,
      A.activity_id,
      A.amount AS activity_amount
    FROM public.group 
    JOIN public.user U ON public.group.group_id= U.group_id
    JOIN public.activity A ON A.user_id = U.user_id
    JOIN public.activity_type AT ON AT.activity_type_id = A.activity_type_id
    WHERE 
      public.group.group_id = (SELECT CU.group_id FROM public.user CU WHERE CU.user_id=$1 LIMIT 1)
    AND U.user_id = $1
	  AND A.date IN (${datePlaceholders})
  `;
  const client = new Client({
    user: 'postgres',
    password: '123456',
    host: 'localhost',
    port: 5432,
    database: 'progress_tracker',
  });
  await client.connect();
  const resp = await client.query(query, [user_id, ...dates])
  const response=(resp.rows);
  await client.end();
  res.send(response);
})

app.get('/current-week', async (req, res) => {
  const user_id = 1;
  const beginning_of_current_week = getMonday();

  // const activities = [
  //   {
  //     user_id,
  //     user_name,
  //     // TODO: Maybe extract
  //     activity_type_id: 1,
  //     activity_type_name: 'Siatkówka plażowa',
  //     activity_type_icon: 'volleyball',
  //     activity_date: '2024-08-13',
  //     activity_amount: 55
  //   }
  // ];

  const query = `
    SELECT 
	    U.user_id,
      U.name AS user_name,
      U.color AS user_color,
      AT.activity_type_id,
      AT.name AS activity_type_name,
      AT.icon AS activity_type_icon,
      A.date AS activity_date,
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
  const client = new Client({
    user: 'postgres',
    password: '123456',
    host: 'localhost',
    port: 5432,
    database: 'progress_tracker',
  });
  await client.connect();
  // const resp = await client.query('SELECT $1::text as message', ['Hello world!'])
  const resp = await client.query(query, [user_id, beginning_of_current_week])
  const response=(resp.rows);
  await client.end();
  res.send(response);
});

app.get('/last-10-weeks', async (req, res) => {
  const query = `
    SELECT 
        U.user_id,
        U.name AS user_name,
        DATE_TRUNC('week', A.date) AS week_start,
        SUM(A.amount) AS total_amount
    FROM public.activity A
    JOIN public.user U ON A.user_id = U.user_id
    WHERE A.date >= NOW() - INTERVAL '10 weeks'
    GROUP BY U.user_id, week_start
    ORDER BY week_start DESC, user_name;
  `;

  const client = new Client({
    user: 'postgres',
    password: '123456',
    host: 'localhost',
    port: 5432,
    database: 'progress_tracker',
  });
  await client.connect();
  const resp = await client.query(query)
  const response=resp.rows;
  await client.end();
  const result = {};
    response.forEach(row => {
      const week = row.week_start.toISOString().split('T')[0];
      if (!result[week]) {
        result[week] = {};
      }
      result[week][row.user_name] = parseInt(row.total_amount) || 0;
    });
  await client.end();
  res.send(result);
});
    


app.get('/activity-types', async (req, res) => {
  const query = `
  SELECT activity_type_id AS id, icon, name
	FROM public.activity_type;
`;
  const client = new Client({
    user: 'postgres',
    password: '123456',
    host: 'localhost',
    port: 5432,
    database: 'progress_tracker',
  });
  await client.connect();
  const resp = await client.query(query, [])
  const response=resp.rows;
  await client.end();
  res.send(response);
});

app.delete('/activities/:id', async (req, res) => {
  const user_id = 1;
  const activity_id=req.params.id;
  const query = `
    DELETE FROM public.activity 
    WHERE activity_id=$1 AND user_id=$2
  `;
  const client = new Client({
    user: 'postgres',
    password: '123456',
    host: 'localhost',
    port: 5432,
    database: 'progress_tracker',
  });
  await client.connect();
  await client.query(query, [activity_id, user_id]);
  await client.end();
  res.send();
})

app.post('/activities', jsonParser,  async (req, res) =>{
  const user_id=1;
  console.log(req.body);
  const {activity_type_id, date, amount}= req.body;
  if (!activity_type_id || !date || amount == null)
    return;
  const query=`
    INSERT INTO public.activity(date, activity_type_id, user_id, amount)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `
  const client = new Client({
    user: 'postgres',
    password: '123456',
    host: 'localhost',
    port: 5432,
    database: 'progress_tracker',
  });
  await client.connect();
  const resp=await client.query(query, [date, activity_type_id, user_id, amount]);
  const response=resp.rows[0];
  await client.end();
  res.send(response);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})