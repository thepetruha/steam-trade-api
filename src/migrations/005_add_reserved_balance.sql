-- Миграция: добавление нового поля reserved_balance
DO $$
BEGIN
    -- Проверяем, есть ли уже такое поле в таблице
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'reserved_balance'
    ) THEN
        -- Добавляем новое поле reserved_balance
        ALTER TABLE users
        ADD COLUMN reserved_balance NUMERIC(10, 2) DEFAULT 0 NOT NULL;
    END IF;
END $$;