const express = require("express");
const cors = require("cors");
const { Client } = require("pg");
const bodyParser = require("body-parser");

const app = express();
const client = new Client({
  user: "postgres",
  database: "tweets_database",
  port: 5432, // default PostgreSQL port is 5432
});

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors());

client.connect((err) => {
  if (err != null) {
    console.error(err);
    return;
  }
  console.log("Connected to the database");
});

// Load the page for the user
app.get("/tweets", (request, response) => {
  client.query("SELECT * FROM tweet", [], (err, result) => {
    console.log(err);
    response.json(result.rows);
  });
});

// Grab specific tweet by id
app.get("/tweets/:id", (request, response) => {
  client.query(
    "SELECT * FROM tweet WHERE id = $1",
    [request.params.id],
    (err, result) => {
      response.json(result.rows);
    }
  );
});

// Create a new tweet
app.post("/tweets", (request, response) => {
  const tweetValue = request.body.value;
  if (tweetValue == null || tweetValue === "") {
    console.log("Value is null");
    console.log(request);
    response.status(500);
    return;
  }

  client.query(
    "INSERT INTO tweet(value) VALUES ($1) RETURNING id, value",
    [tweetValue],
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
app.put("/tweets/:id", (request, response) => {
  if (request.body.value == null || request.body.value === "") {
    console.log("Value is null");
    response.status(500);
    return;
  }

  client.query(
    "UPDATE tweet SET value = $1 WHERE id = $2 RETURNING value, id",
    [request.body.value, request.params.id],
    (err, result) => {
      console.log(err);
      response.json(result.rows[0]);
    }
  );
});

// Delete all tweeets
app.delete("/tweets", (request, response) => {
  client.query("DELETE FROM tweet", () => {
    response.json({ result: "success" });
  });
});

// Delete existing tweet
app.delete("/tweets/:id", (request, response) => {
  const id = request.params.id;
  client.query("DELETE FROM tweet WHERE id = $1", [id], (err, result) => {
    response.json({ rowsDeleted: result.rowCount });
  });
});

// Create a new user
app.post("/user", (req, res) => {
  client.query(
    "INSERT INTO user(username, password) VALUES($1 , $2)",
    [req.body.username, req.body.password],
    (err, result) => {
      console.log(err);
      res.json(result.rows[0]);
    }
  );
});

app.get("/user", (req, res) => {
  client.query(
    "SELECT id FROM app_user WHERE username = $1 AND password = $2",
    [req.body.username, req.body.password],
    (err, result) => {
      res.json(result.rows[0]);
    }
  );
});

app.listen(3001, () => console.log("Listening!"));
