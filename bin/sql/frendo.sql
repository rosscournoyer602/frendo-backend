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
    person_two INTEGER REFERENCES person
);

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO node_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO node_user;

INSERT INTO auth_user
(email, password_hash)
VALUES
('aaron@email.com', 'password');

INSERT INTO person
(first_name, last_name, dob, street_address, city, state_province, phone, email)
VALUES
('Aaron', 'Aaronson', '1955-01-01', '123 Main St.', 'Hoboken', 'New Jersey', '6029926696', 'aaron@email.com');

DROP TABLE friendships;
DROP TABLE person;
DROP TABLE auth_user;