
//Dayy tables and data
CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL
);

INSERT INTO items (title) VALUES ('Buy milk')

//Week tables and data

CREATE TABLE itemsw (
id SERIAL PRIMARY KEY,
title VARCHAR(255)
);

INSERT INTO itemsw (title) VALUES ('Walk the dog')

//Month tables and data
CREATE TABLE itemsm(
id SERIAL PRIMARY KEY,
title VARCHAR(255)
);

INSERT INTO itemwsm (title) VALUES ('Go to the gym');

CREATE TABLE users(
id SERIAL PRIMARY KEY,
name VARCHAR (255)
);

ALTER TABLE items
ADD user_id INTEGER REFERENCES users(id);

ALTER TABLE itemsm
ADD user_id INTEGER REFERENCES users(id);

ALTER TABLE itemsw
ADD user_id INTEGER REFERENCES users(id);

INSERT INTO users (name)
VALUES ('Emre');

INSERT INTO items (title, user_id)
VALUES ('Bulaşıkları yıka',1);
INSERT INTO itemsm (title, user_id)
VALUES ('Bulaşıkları topla',1);
INSERT INTO itemsw (title, user_id)
VALUES ('Bulaşıkları boşalt',1);