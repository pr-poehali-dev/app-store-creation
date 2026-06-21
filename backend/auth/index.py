import json
import os
import hashlib
import secrets
import psycopg2

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def handler(event: dict, context) -> dict:
    """Авторизация: вход, выход, получение профиля текущего пользователя"""
    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Session-Id',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    method = event.get('httpMethod')
    params = event.get('queryStringParameters') or {}
    action = params.get('action', '')

    # POST ?action=login
    if method == 'POST' and action == 'login':
        body = json.loads(event.get('body') or '{}')
        email = body.get('email', '').strip().lower()
        password = body.get('password', '')

        if not email or not password:
            return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'Email и пароль обязательны'})}

        conn = get_conn()
        cur = conn.cursor()
        cur.execute('SELECT id, email, role FROM users WHERE email = %s AND password_hash = %s', (email, hash_password(password)))
        user = cur.fetchone()

        if not user:
            conn.close()
            return {'statusCode': 401, 'headers': cors, 'body': json.dumps({'error': 'Неверный email или пароль'})}

        session_id = secrets.token_hex(32)
        cur.execute('INSERT INTO sessions (id, user_id) VALUES (%s, %s)', (session_id, user[0]))
        conn.commit()
        conn.close()

        return {
            'statusCode': 200,
            'headers': cors,
            'body': json.dumps({'session_id': session_id, 'user': {'id': user[0], 'email': user[1], 'role': user[2]}})
        }

    # GET ?action=me
    if method == 'GET' and action == 'me':
        session_id = (event.get('headers') or {}).get('X-Session-Id', '')
        if not session_id:
            return {'statusCode': 401, 'headers': cors, 'body': json.dumps({'error': 'Не авторизован'})}

        conn = get_conn()
        cur = conn.cursor()
        cur.execute('''
            SELECT u.id, u.email, u.role FROM users u
            JOIN sessions s ON s.user_id = u.id
            WHERE s.id = %s AND s.expires_at > NOW()
        ''', (session_id,))
        user = cur.fetchone()
        conn.close()

        if not user:
            return {'statusCode': 401, 'headers': cors, 'body': json.dumps({'error': 'Сессия истекла'})}

        return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'id': user[0], 'email': user[1], 'role': user[2]})}

    # POST ?action=logout
    if method == 'POST' and action == 'logout':
        session_id = (event.get('headers') or {}).get('X-Session-Id', '')
        if session_id:
            conn = get_conn()
            cur = conn.cursor()
            cur.execute('UPDATE sessions SET expires_at = NOW() WHERE id = %s', (session_id,))
            conn.commit()
            conn.close()
        return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'ok': True})}

    return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'Укажите параметр action'})}