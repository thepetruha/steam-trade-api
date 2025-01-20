CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,                          -- Уникальный идентификатор пользователя
    login VARCHAR(255) UNIQUE NOT NULL,             -- Уникальный логин пользователя
    password_hash VARCHAR(255) NOT NULL,            -- Хэшированный пароль
    balanceUSD NUMERIC(10, 2) DEFAULT 0 NOT NULL
    email VARCHAR(255) UNIQUE,                      -- Электронная почта (может быть NULL)
    is_active BOOLEAN DEFAULT TRUE,                 -- Флаг активности аккаунта
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Дата создания аккаунта
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Дата последнего обновления аккаунта
    CONSTRAINT chk_email CHECK (
        email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
        OR email IS NULL
    )                                               -- Ограничение для проверки формата email
);

-- Индексы для оптимизации поиска
CREATE INDEX IF NOT EXISTS idx_users_login ON users(login);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);