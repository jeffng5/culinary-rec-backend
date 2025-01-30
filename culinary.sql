CREATE TABLE IF NOT EXISTS recipes (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL
);

UPDATE recipes SET name = 'Sweet and tangy glazed chicken wings' WHERE id = 14;
CREATE TABLE tags (
    id BIGSERIAL PRIMARY KEY,
    recipe_id INTEGER REFERENCES recipes(id),
    tag TEXT NOT NULL
);

CREATE TABLE comments (
    id BIGSERIAL PRIMARY KEY,
    recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
    comment_body TEXT NOT NULL,
    author TEXT NOT NULL,
    datetime timestamp with time zone
);

CREATE TABLE favorites (
    id BIGSERIAL PRIMARY KEY,
    recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE
);

CREATE TABLE ingredients (
    id BIGSERIAL PRIMARY KEY,
    recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
    ingredient TEXT NOT NULL
);

CREATE TABLE procedures (
    id BIGSERIAL PRIMARY KEY,
    recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
    step_no INTEGER NOT NULL,
    procedure TEXT NOT NULL
);

CREATE TABLE images (
    id BIGSERIAL PRIMARY KEY,
    recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL
);

ALTER TABLE recipes ALTER COLUMN id TYPE INTEGER;
ALTER TABLE tags DROP COLUMN id;
ALTER TABLE procedures DROP COLUMN id;
ALTER TABLE procedures ALTER COLUMN procedure TYPE VARCHAR(250)

