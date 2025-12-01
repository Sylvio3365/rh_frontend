import mysql.connector
from datetime import datetime

def enregistrer_presence(employe_id):
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",
        database="qr"
    )
    cursor = conn.cursor()

    # Enregistrer la présence de l'employé
    cursor.execute("INSERT INTO presences (id_employe, date_heure, statut) VALUES (%s, %s, %s)", 
                   (employe_id, datetime.now(), "présent"))
    
    conn.commit()
    cursor.close()
    conn.close()

# Utiliser la fonction lors de la détection d'un QR code
enregistrer_presence(1)
