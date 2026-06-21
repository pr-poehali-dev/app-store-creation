INSERT INTO users (email, password_hash, role)
VALUES (
  'admin@tut-vkusnoru.ru',
  'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f',
  'admin'
)
ON CONFLICT (email) DO NOTHING