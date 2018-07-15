CREATE TABLE person(
    person_id serial PRIMARY KEY,
    first_name VARCHAR(40) NOT NULL,
    last_name VARCHAR(40) NOT NULL,
    dob DATE NOT NULL,
    street_address VARCHAR(50) NOT NULL,
    city VARCHAR(40) NOT NULL,
    state VARCHAR(30) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(40) NOT NULL
);

INSERT INTO person
(first_name, last_name, dob, street_address, city, state, phone, email)
VALUES
('Aaron', 'Aaronson', '1955-01-01', '123 Main St.', 'Hoboken', 'New Jersey', '6029926696', 'aaron@email.com'),
('Bob', 'Aaronson', '1955-01-02', '123 Main St.', 'Hoboken', 'New Jersey', '602992667', 'bob@email.com'),
('Ross', 'Cournoyer', '1984-12-07', 'Changshu Lu 163 Nong', 'Shanghai', 'China', '6029926696', 'ross@email.com'),
('Dale', 'Cournoyer', '1990-06-01', 'Changshu Lu 163 Nong', 'Shanghai', 'China', '6029926698', 'dale@email.com'),
('Starr', 'Cournoyer', '1957-02-14', '4046 E Pullman Rd', 'Cave Creek', 'AZ', '6029926699', 'starr@email.com');


CREATE TABLE friendships(
    person_one INTEGER REFERENCES person,
    person_two INTEGER REFERENCES person
);

SELECT * FROM person;
