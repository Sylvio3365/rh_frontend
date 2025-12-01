import mysql.connector
from generate_qr import generate_qr_code

def insert_employe(nom, prenom, email):
    # Se connecter à la base de données
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",
        database="qr"
    )
    cursor = conn.cursor()

    # Insérer l'employé dans la base
    cursor.execute("INSERT INTO employes (nom, prenom, email) VALUES (%s, %s, %s)", (nom, prenom, email))
    
    # Récupérer l'ID de l'employé après insertion
    employe_id = cursor.lastrowid

    # Générer le QR code pour l'employé
    qr_code_filename = generate_qr_code(employe_id)
    
    # Mettre à jour l'employé avec le chemin du QR code
    cursor.execute("UPDATE employes SET qr_code = %s WHERE id = %s", (qr_code_filename, employe_id))
    
    # Sauvegarder les changements et fermer la connexion
    conn.commit()
    cursor.close()
    conn.close()

# Exemple d'ajout d'un employé
insert_employe("John", "Doe", "john.doe@email.com")
