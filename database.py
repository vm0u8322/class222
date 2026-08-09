import os
import json
import time
import sqlite3
from pathlib import Path
from typing import Dict, Any

ROOT = Path(__file__).resolve().parent
DB_PATH = ROOT / "classok.db"

def init_db():
    try:
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
        conn.close()
        print("SQLite sync database initialized successfully.")
    except Exception as exc:
        print(f"Failed to initialize SQLite database: {exc}")

def get_user_state(user_id: str) -> Dict[str, Any]:
    try:
        conn = sqlite3.connect(str(DB_PATH))
        cursor = conn.cursor()
        cursor.execute("SELECT state_data FROM user_sync WHERE user_id = ?", (user_id,))
        row = cursor.fetchone()
        conn.close()
        if row and row[0]:
            return json.loads(row[0])
    except Exception as exc:
        print(f"SQLite get_user_state failed: {exc}")
    return {}

def save_user_state(user_id: str, state_data: Dict[str, Any]) -> bool:
    try:
        conn = sqlite3.connect(str(DB_PATH))
        cursor = conn.cursor()
        serialized = json.dumps(state_data, ensure_ascii=False)
        updated_at = int(time.time())
        cursor.execute("""
            INSERT INTO user_sync (user_id, state_data, updated_at)
            VALUES (?, ?, ?)
            ON CONFLICT(user_id) DO UPDATE SET
                state_data = excluded.state_data,
                updated_at = excluded.updated_at
        """, (user_id, serialized, updated_at))
        conn.commit()
        conn.close()
        return True
    except Exception as exc:
        print(f"SQLite save_user_state failed: {exc}")
        return False

# Initialize the database on import
init_db()
