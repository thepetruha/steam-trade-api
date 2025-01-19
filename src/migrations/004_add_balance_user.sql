ALTER TABLE users
ADD COLUMN IF NOT EXISTS balanceUSD NUMERIC(10, 2) DEFAULT 0 NOT NULL; -- Баланс в USD с точностью до двух десятичных знаков

CREATE INDEX IF NOT EXISTS idx_users_balanceUSD ON users(balanceUSD);