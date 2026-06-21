CREATE TABLE IF NOT EXISTS user_courses (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  course_id INTEGER REFERENCES courses(id),
  granted_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, course_id)
)