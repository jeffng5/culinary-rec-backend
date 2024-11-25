CREATE TABLE IF NOT EXISTS recipes (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL
);

UPDATE recipes SET name = 'Sweet and tangy glazed chicken wings' WHERE id = 14;