import json
import os
import psycopg2

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def get_user(cur, session_id):
    if not session_id:
        return None
    cur.execute('''
        SELECT u.id, u.email, u.role FROM users u
        JOIN sessions s ON s.user_id = u.id
        WHERE s.id = %s AND s.expires_at > NOW()
    ''', (session_id,))
    row = cur.fetchone()
    if row:
        return {'id': row[0], 'email': row[1], 'role': row[2]}
    return None

def handler(event: dict, context) -> dict:
    """Курсы: публичный каталог, курсы пользователя, управление (админ), выдача доступа"""
    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Session-Id',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    method = event.get('httpMethod')
    params = event.get('queryStringParameters') or {}
    action = params.get('action', 'list')
    session_id = (event.get('headers') or {}).get('X-Session-Id', '')

    conn = get_conn()
    cur = conn.cursor()

    # GET ?action=list — публичный каталог
    if method == 'GET' and action == 'list':
        cur.execute('SELECT id, title, category, price, old_price, lessons_count, duration, level, emoji, description FROM courses WHERE is_active = TRUE ORDER BY id')
        rows = cur.fetchall()
        conn.close()
        result = [{'id': r[0], 'title': r[1], 'category': r[2], 'price': r[3],
                    'oldPrice': r[4], 'lessons': r[5], 'duration': r[6],
                    'level': r[7], 'emoji': r[8], 'desc': r[9]} for r in rows]
        return {'statusCode': 200, 'headers': cors, 'body': json.dumps(result)}

    # GET ?action=my — купленные курсы пользователя
    if method == 'GET' and action == 'my':
        user = get_user(cur, session_id)
        if not user:
            conn.close()
            return {'statusCode': 401, 'headers': cors, 'body': json.dumps({'error': 'Не авторизован'})}

        cur.execute('''
            SELECT c.id, c.title, c.emoji, c.lessons_count, c.duration, c.level, c.category, uc.granted_at
            FROM courses c
            JOIN user_courses uc ON uc.course_id = c.id
            WHERE uc.user_id = %s
            ORDER BY uc.granted_at DESC
        ''', (user['id'],))
        rows = cur.fetchall()
        conn.close()
        result = [{'id': r[0], 'title': r[1], 'emoji': r[2], 'lessons_count': r[3],
                    'duration': r[4], 'level': r[5], 'category': r[6],
                    'granted_at': str(r[7])} for r in rows]
        return {'statusCode': 200, 'headers': cors, 'body': json.dumps(result)}

    # POST ?action=grant — выдать доступ к курсу (только админ)
    if method == 'POST' and action == 'grant':
        user = get_user(cur, session_id)
        if not user or user['role'] != 'admin':
            conn.close()
            return {'statusCode': 403, 'headers': cors, 'body': json.dumps({'error': 'Доступ запрещён'})}

        body = json.loads(event.get('body') or '{}')
        email = body.get('email', '').strip().lower()
        course_id = body.get('course_id')

        cur.execute('SELECT id FROM users WHERE email = %s', (email,))
        target = cur.fetchone()
        if not target:
            conn.close()
            return {'statusCode': 404, 'headers': cors, 'body': json.dumps({'error': 'Пользователь не найден'})}

        cur.execute('INSERT INTO user_courses (user_id, course_id) VALUES (%s, %s) ON CONFLICT DO NOTHING', (target[0], course_id))
        conn.commit()
        conn.close()
        return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'ok': True})}

    # POST ?action=create-user — создать покупателя (только админ)
    if method == 'POST' and action == 'create-user':
        user = get_user(cur, session_id)
        if not user or user['role'] != 'admin':
            conn.close()
            return {'statusCode': 403, 'headers': cors, 'body': json.dumps({'error': 'Доступ запрещён'})}

        body = json.loads(event.get('body') or '{}')
        email = body.get('email', '').strip().lower()
        password = body.get('password', '')

        import hashlib
        pw_hash = hashlib.sha256(password.encode()).hexdigest()

        cur.execute('INSERT INTO users (email, password_hash, role) VALUES (%s, %s, %s) ON CONFLICT (email) DO NOTHING RETURNING id', (email, pw_hash, 'buyer'))
        row = cur.fetchone()
        conn.commit()
        conn.close()

        if not row:
            return {'statusCode': 409, 'headers': cors, 'body': json.dumps({'error': 'Пользователь уже существует'})}

        return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'ok': True, 'user_id': row[0]})}

    # GET ?action=users — список покупателей (только админ)
    if method == 'GET' and action == 'users':
        user = get_user(cur, session_id)
        if not user or user['role'] != 'admin':
            conn.close()
            return {'statusCode': 403, 'headers': cors, 'body': json.dumps({'error': 'Доступ запрещён'})}

        cur.execute('''
            SELECT u.id, u.email, u.created_at,
                   COUNT(uc.course_id) as courses_count
            FROM users u
            LEFT JOIN user_courses uc ON uc.user_id = u.id
            WHERE u.role = 'buyer'
            GROUP BY u.id, u.email, u.created_at
            ORDER BY u.created_at DESC
        ''')
        rows = cur.fetchall()
        conn.close()
        result = [{'id': r[0], 'email': r[1], 'created_at': str(r[2]), 'courses_count': r[3]} for r in rows]
        return {'statusCode': 200, 'headers': cors, 'body': json.dumps(result)}

    conn.close()
    return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'Неизвестный action'})}