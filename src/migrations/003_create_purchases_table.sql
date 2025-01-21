CREATE TABLE IF NOT EXISTS purchases (
    id SERIAL PRIMARY KEY,                                              -- Уникальный идентификатор покупки
    user_id INT NOT NULL,                                               -- Ссылка на пользователя
    product_id INT NOT NULL,                                            -- Ссылка на продукт
    quantity INT NOT NULL,                                              -- Количество товаров
    total_price NUMERIC(10, 2) NOT NULL,                                -- Общая стоимость покупки
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,                  -- Дата и время покупки
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,       -- Связь с таблицей users
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE  -- Связь с таблицей products
);

-- Индекс для ускорения запросов по user_id и product_id
CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_product_id ON purchases(product_id);