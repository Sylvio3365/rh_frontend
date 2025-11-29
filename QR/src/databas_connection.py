import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    """
    Connexion PostgreSQL - Même base que Spring Boot
    """
    return psycopg2.connect(
        host="localhost",
        port=5432,
        user="postgres",
        password="ondryboutry006",
        database="rhdb",
        cursor_factory=RealDictCursor  # Retourne des dictionnaires
    )
