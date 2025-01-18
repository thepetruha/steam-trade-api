CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,                          -- Уникальный идентификатор продукта
    name VARCHAR(255) UNIQUE NOT NULL,              -- Уникальное имя продукта
    price NUMERIC(10, 2) NOT NULL,                  -- Цена продукта с точностью до двух десятичных знаков
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Дата создания записи
);
