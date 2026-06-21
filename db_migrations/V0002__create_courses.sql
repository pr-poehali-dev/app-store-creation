CREATE TABLE IF NOT EXISTS courses (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  category VARCHAR(100),
  price INTEGER NOT NULL DEFAULT 0,
  old_price INTEGER,
  lessons_count INTEGER NOT NULL DEFAULT 0,
  duration VARCHAR(50),
  level VARCHAR(50),
  emoji VARCHAR(10) DEFAULT '🍽️',
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
)