import os
import json
import time
from typing import Dict, Any
from pathlib import Path
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parent
load_dotenv(ROOT / ".env")

DATABASE_URL = os.getenv("DATABASE_URL", "")

IS_POSTGRES = DATABASE_URL.startswith("postgres://") or DATABASE_URL.startswith("postgresql://")

if IS_POSTGRES:
    import psycopg2
    print("Using PostgreSQL database.")
else:
    import sqlite3
    DB_PATH = ROOT / "classok.db"
    print("Using SQLite database.")

def init_db():
    try:
        if IS_POSTGRES:
            conn = psycopg2.connect(DATABASE_URL)
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS user_sync (
                    user_id VARCHAR(255) PRIMARY KEY,
                    state_data TEXT,
                    updated_at BIGINT
                )
            """)
        else:
            conn = sqlite3.connect(str(DB_PATH))
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS user_sync (
                    user_id TEXT PRIMARY KEY,
                    state_data TEXT,
                    updated_at INTEGER
                )
            """)
        conn.commit()
        cursor.close()
        conn.close()
        print("Database initialized successfully.")
    except Exception as exc:
        print(f"Failed to initialize database: {exc}")

def get_user_state(user_id: str) -> Dict[str, Any]:
    try:
        if IS_POSTGRES:
            conn = psycopg2.connect(DATABASE_URL)
            cursor = conn.cursor()
            cursor.execute("SELECT state_data FROM user_sync WHERE user_id = %s", (user_id,))
        else:
            conn = sqlite3.connect(str(DB_PATH))
            cursor = conn.cursor()
            cursor.execute("SELECT state_data FROM user_sync WHERE user_id = ?", (user_id,))
        
        row = cursor.fetchone()
        cursor.close()
        conn.close()
        if row and row[0]:
            return json.loads(row[0])
    except Exception as exc:
        print(f"get_user_state failed: {exc}")
    return {}

def save_user_state(user_id: str, state_data: Dict[str, Any]) -> bool:
    try:
        serialized = json.dumps(state_data, ensure_ascii=False)
        updated_at = int(time.time())
        if IS_POSTGRES:
            conn = psycopg2.connect(DATABASE_URL)
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO user_sync (user_id, state_data, updated_at)
                VALUES (%s, %s, %s)
                ON CONFLICT(user_id) DO UPDATE SET
                    state_data = EXCLUDED.state_data,
                    updated_at = EXCLUDED.updated_at
            """, (user_id, serialized, updated_at))
        else:
            conn = sqlite3.connect(str(DB_PATH))
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO user_sync (user_id, state_data, updated_at)
                VALUES (?, ?, ?)
                ON CONFLICT(user_id) DO UPDATE SET
                    state_data = excluded.state_data,
                    updated_at = excluded.updated_at
            """, (user_id, serialized, updated_at))
        conn.commit()
        cursor.close()
        conn.close()
        return True
    except Exception as exc:
        print(f"save_user_state failed: {exc}")
        return False

# Initialize database
init_db()
