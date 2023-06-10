const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bodyParser = require('body-parser');

const CONFIG =
  process.env.NODE_ENV === 'production'
    ? {
        user: 'postgres',
        database: 'tweets_database',
        host: '/var/run/postgresql',
      }
    : {
        user: 'postgres',
        database: 'tweets_database',
        port: 5432, // default PostgreSQL port is 5432
      };

const app = express();
const pool = new Pool(CONFIG);

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors());

pool.connect((err) => {
  if (err != null) {
    console.error(err);
    return;
  }
  console.log('Connected to the database');
});

const router = express.Router();

// Load the page for the user
router.get('/tweets', (request, response) => {
  pool.query('SELECT * FROM tweet', [], (err, result) => {
    response.json(result.rows);
  });
});

// Grab specific tweet by id
router.get('/tweets/:id', (request, response) => {
  pool.query(
    'SELECT * FROM tweet WHERE id = $1',
    [request.params.id],
    (err, result) => {
      response.json(result.rows);
    }
  );
});

// Create a new tweet
router.post('/tweets', (request, response) => {
  const tweetValue = request.body.value;
  const tweetAuthor = request.body.name;
  if (tweetValue == null || tweetValue === '') {
    console.log('Value is null');
    console.log(request);
    response.status(500);
    return;
  }

  pool.query(
    'INSERT INTO tweet(value, name) VALUES ($1, $2) RETURNING id, value, name',
    [tweetValue, tweetAuthor],
    (err, result) => {
      if (err != null) {
        console.log(err);
        response.status(500);
      } else {
        console.log(result.rows);
        response.json(result.rows[0]);
      }
    }
  );
});

// Edit existing tweet
router.put('/tweets/:id', (request, response) => {
  if (request.body.value == null || request.body.value === '') {
    console.log('Value is null');
    response.status(500);
    return;
  }

  pool.query(
    'UPDATE tweet SET value = $1 WHERE id = $2 RETURNING value, id',
    [request.body.value, request.params.id],
    (err, result) => {
      console.log(err);
      response.json(result.rows[0]);
    }
  );
});

// Delete all tweeets
router.delete('/tweets', (request, response) => {
  pool.query('DELETE FROM tweet', () => {
    response.json({ result: 'success' });
  });
});

// Delete existing tweet
router.delete('/tweets/:id', (request, response) => {
  const id = request.params.id;
  pool.query('DELETE FROM tweet WHERE id = $1', [id], (err, result) => {
    response.json({ rowsDeleted: result.rowCount });
  });
});

// SSE endpoint
router.get('/events', async (req, res) => {
  res.type('text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Listen for new tweets
  const client = await pool.connect();
  await client.query('LISTEN new_tweet');
  client.on('notification', (data) => {
    const payload = JSON.parse(data.payload);
    console.log('RECEIVED new row', payload);
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  });

  req.on('close', () => {
    client.release();
  });
});

app.use('/media', router);
app.listen(3001, '0.0.0.0', () => console.log('Listening!'));
