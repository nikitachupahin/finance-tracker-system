// CREATE TABLE users (
// 	id uuid NOT NULL DEFAULT gen_random_uuid();
// 	email VARCHAR(120) UNIQUE NOT NULL,
// 	name VARCHAR(50) NOT NULL,
// 	password TEXT,
// 	createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
// );

// CREATE TABLE transactions (
//     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//     user_id UUID NOT NULL,
//     amount DECIMAL(10,2) NOT NULL,
//     type VARCHAR(10) CHECK (type IN ('income', 'expense')) NOT NULL,
//     category VARCHAR(255) NOT NULL,
//     description TEXT,
//     transaction_date TIMESTAMP NOT NULL DEFAULT NOW(),
//     created_at TIMESTAMP DEFAULT NOW()
// );

// CREATE TABLE goals (
//     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//     user_id UUID NOT NULL,
//     goal_name VARCHAR(255) NOT NULL,
//     target_amount DECIMAL(10,2) NOT NULL,
//     current_amount DECIMAL(10,2) DEFAULT 0,
//     deadline TIMESTAMP NOT NULL,
//     status VARCHAR(20) CHECK (status IN ('in_progress', 'completed', 'failed')) DEFAULT 'in_progress',
//     created_at TIMESTAMP DEFAULT NOW()
// );
