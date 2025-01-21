CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,                          -- Уникальный идентификатор пользователя
    login VARCHAR(255) UNIQUE NOT NULL,             -- Уникальный логин пользователя
    password_hash VARCHAR(255) NOT NULL,            -- Хэшированный пароль
    balance_eur NUMERIC(10, 2) DEFAULT 0 NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Дата создания аккаунта
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Дата последнего обновления аккаунта
);

-- Индексы для оптимизации поиска
CREATE INDEX IF NOT EXISTS idx_users_login ON users(login);