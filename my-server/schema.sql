CREATE TABLE tweet (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    value TEXT NOT NULL
);


CREATE OR REPLACE FUNCTION notify_new_tweet()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify('new_tweet', row_to_json(NEW)::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER tweet_after_insert
AFTER INSERT ON tweet
FOR EACH ROW EXECUTE FUNCTION notify_new_tweet();