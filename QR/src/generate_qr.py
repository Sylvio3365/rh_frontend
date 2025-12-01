import qrcode
import os
from databas_connection import get_db_connection

def generate_qr_code(employe_id, output_dir="qr_codes"):
    """
    Génère un QR code pour un employé
    Format: EMPLOYEE_ID:123 (compatible avec le scanner Vue.js)
    """
    # Format compatible avec QrScanner.vue
    qr_data = f"EMPLOYEE_ID:{employe_id}"
    qr_filename = os.path.join(output_dir, f"qr_employee_{employe_id}.png")
    
    # Créer le dossier si nécessaire
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    # Générer le QR code avec haute qualité
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(qr_data)
    qr.make(fit=True)
    
    # Créer l'image
    img = qr.make_image(fill_color="black", back_color="white")
    img.save(qr_filename)
    
    print(f"✓ QR code généré: {qr_filename}")
    return qr_filename

def generate_qr_for_all_employees(output_dir="qr_codes"):
    """
    Génère des QR codes pour tous les employés de la base
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Récupérer tous les employés
        cursor.execute("""
            SELECT id_personnel, nom, prenom 
            FROM personnel 
            WHERE statut = 1
            ORDER BY id_personnel
        """)
        
        employees = cursor.fetchall()
        
        print(f"Génération de {len(employees)} QR codes...")
        
        for emp in employees:
            emp_id = emp['id_personnel']
            nom = emp['nom']
            prenom = emp['prenom']
            
            filename = generate_qr_code(emp_id, output_dir)
            print(f"  - {nom} {prenom} (ID: {emp_id})")
        
        print(f"\n✓ {len(employees)} QR codes générés dans {output_dir}/")
        
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    # Générer pour tous les employés
    generate_qr_for_all_employees()
    
    # Ou générer pour un employé spécifique
    # generate_qr_code(1)
