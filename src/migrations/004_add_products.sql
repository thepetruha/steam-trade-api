INSERT INTO products (name, price, currncy, quantity, in_stock, created_at, updated_at) VALUES
('10 Year Birthday Sticker Capsule', 95.79, 'EUR', 265, 265, to_timestamp(1661324437), to_timestamp(1737384095)),
('1st Lieutenant Farlow | SWAT', 613.08, 'EUR', 220, 220, to_timestamp(1607718784), to_timestamp(1737384095)),
('2020 RMR Challengers', 20.22, 'EUR', 1127, 1127, to_timestamp(1612431333), to_timestamp(1737384095)),
('2020 RMR Contenders', 25.54, 'EUR', 1113, 1113, to_timestamp(1612431333), to_timestamp(1737384095)),
('2020 RMR Legends', 21.29, 'EUR', 919, 919, to_timestamp(1612428014), to_timestamp(1737384095)),
('2021 Community Sticker Capsule', 137.3, 'EUR', 32, 32, to_timestamp(1631908649), to_timestamp(1737384095)),
('3rd Commando Company | KSK', 844.05, 'EUR', 396, 396, to_timestamp(1574830705), to_timestamp(1737384095)),
('Aces High Pin', 769.54, 'EUR', 85, 85, to_timestamp(1535988254), to_timestamp(1737384095)),
('AK-47 | Aquamarine Revenge (Battle-Scarred)', 2043.6, 'EUR', 11, 11, to_timestamp(1535988253), to_timestamp(1737384095)),
('AK-47 | Aquamarine Revenge (Factory New)', 11387.74, 'EUR', 34, 34, to_timestamp(1535988253), to_timestamp(1737384095))
ON CONFLICT (name) DO NOTHING;