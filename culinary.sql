
CREATE TABLE IF NOT EXISTS tags (
    id BIGSERIAL PRIMARY KEY,
    recipe_id INTEGER REFERENCES recipes(id),
    tag TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS comments (
    id BIGSERIAL PRIMARY KEY,
    recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
    comment_body TEXT NOT NULL,
    author TEXT NOT NULL,
    datetime timestamp with time zone
);

CREATE TABLE IF NOT EXISTS favorites (
    id BIGSERIAL PRIMARY KEY,
    recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ingredients (
    id BIGSERIAL PRIMARY KEY,
    recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
    ingredient TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS procedures (
    id BIGSERIAL PRIMARY KEY,
    recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
    step_no INTEGER NOT NULL,
    procedure TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS images (
    id BIGSERIAL PRIMARY KEY,
    recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL
);

ALTER TABLE recipes ALTER COLUMN id TYPE INTEGER;
ALTER TABLE tags DROP COLUMN id;
ALTER TABLE procedures DROP COLUMN id;
ALTER TABLE procedures ALTER COLUMN procedure TYPE VARCHAR(250)

