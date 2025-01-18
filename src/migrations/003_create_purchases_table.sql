CREATE TABLE IF NOT EXISTS purchases (
    id SERIAL PRIMARY KEY,                                              -- Уникальный идентификатор покупки
    user_id INT NOT NULL,                                               -- Ссылка на пользователя
    product_id INT NOT NULL,                                            -- Ссылка на продукт
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,                  -- Дата и время покупки
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,       -- Связь с таблицей users
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE  -- Связь с таблицей products
);
