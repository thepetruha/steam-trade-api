CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,                          -- Уникальный идентификатор продукта
    name VARCHAR(255) UNIQUE NOT NULL,              -- Уникальное имя продукта
    price NUMERIC(10, 2) NOT NULL,                  -- Цена продукта с точностью до двух десятичных знаков
    currncy VARCHAR(255) NOT NULL,                  -- Валюта
    quantity INT NOT NULL,                          -- Количество
    in_stock INT NOT NULL,                          -- Количество в наличии
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Дата создания
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Дата обновления
);

-- Индексы для оптимизации поиска
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);