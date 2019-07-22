DROP TABLE friendships;
DROP TABLE person;
DROP TABLE auth_user;

CREATE TABLE auth_user(
	email VARCHAR(40) PRIMARY KEY,
	password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE person(
    person_id serial PRIMARY KEY,
    first_name VARCHAR(40) NOT NULL,
    last_name VARCHAR(40) NOT NULL,
    dob DATE NOT NULL,
    street_address VARCHAR(50) NOT NULL,
    city VARCHAR(40) NOT NULL,
    state_province VARCHAR(30) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(40) UNIQUE REFERENCES auth_user,
    avatar_url VARCHAR(100) UNIQUE
);

CREATE TABLE friendships(
    person_one INTEGER REFERENCES person,
    person_two INTEGER REFERENCES person,
    friend_status INTEGER NOT NULL,
    action_taker INTEGER NOT NULL
    CHECK (person_one < person_two),
    PRIMARY KEY(person_one, person_two)
);

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO node_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO node_user;