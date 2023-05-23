CREATE TABLE app_user (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE tweet (
    id SERIAL PRIMARY KEY,
    value TEXT NOT NULL
);
