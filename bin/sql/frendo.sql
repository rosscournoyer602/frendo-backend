DROP TABLE chats;
DROP TABLE friendships;
DROP TABLE person;
DROP TABLE auth_user;

CREATE TABLE auth_user(
	email VARCHAR(40) PRIMARY KEY,
	password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE person(
    person_id serial PRIMARY KEY,
    first_name VARCHAR(40),
    last_name VARCHAR(40),
    street_address VARCHAR(50),
    city VARCHAR(40),
    state_province VARCHAR(30),
    phone VARCHAR(20),
    email VARCHAR(40) UNIQUE REFERENCES auth_user,
    avatar_url VARCHAR(100) UNIQUE
);

CREATE TABLE friendships(
    friendship_id serial PRIMARY KEY,
    person_one INTEGER REFERENCES person,
    person_two INTEGER REFERENCES person,
    friend_status INTEGER NOT NULL,
    action_taker INTEGER NOT NULL,
    CHECK (person_one < person_two),
    UNIQUE (person_one, person_two)
);

CREATE TABLE chats(
  chat_id serial PRIMARY KEY,
  friendship_id INTEGER UNIQUE REFERENCES friendships,
  messages TEXT
);

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO node_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO node_user;

CREATE INDEX searchpeople
ON person (first_name, last_name);