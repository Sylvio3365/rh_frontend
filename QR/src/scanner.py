import cv2
from pyzbar.pyzbar import decode
import requests
from datetime import datetime
import time

# Configuration du backend Spring Boot
BACKEND_URL = "http://localhost:9090/api/pointage/enregistrer"

# Cooldown pour éviter les scans multiples (en secondes)
SCAN_COOLDOWN = 3
last_scan_time = {}

def enregistrer_presence(employe_id, type_pointage="ENTREE"):
    """
    Envoie le pointage au backend Spring Boot
    """
    try:
        # Préparer les données
        pointage_data = {
            "personnel": {"idPersonnel": employe_id},
            "typePointage": type_pointage,
            "dateHeure": datetime.now().isoformat(),
            "methode": "QR_CODE_PYTHON",
            "localisation": "Scanner Python Desktop"
        }
        
        # Envoyer au backend
        response = requests.post(BACKEND_URL, json=pointage_data, timeout=5)
        
        if response.status_code == 200:
            print(f"✓ Pointage enregistré pour l'employé {employe_id}")
            return True
        else:
            print(f"✗ Erreur {response.status_code}: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"✗ Erreur de connexion au backend: {e}")
        return False

def parse_qr_data(qr_data):
    """
    Parse le contenu du QR code
    Formats acceptés: "EMPLOYEE_ID:123", "ID:123", "123"
    """
    if "EMPLOYEE_ID:" in qr_data:
        return int(qr_data.split("EMPLOYEE_ID:")[1])
    elif "ID:" in qr_data:
        return int(qr_data.split("ID:")[1])
    else:
        return int(qr_data)

def can_scan(employe_id):
    """
    Vérifie si on peut scanner (cooldown)
    """
    current_time = time.time()
    if employe_id in last_scan_time:
        if current_time - last_scan_time[employe_id] < SCAN_COOLDOWN:
            return False
    return True

def main():
    """
    Scanner QR code via webcam et envoyer au backend Spring Boot
    """
    print("=" * 50)
    print("Scanner QR Code - Pointage RH")
    print("=" * 50)
    print(f"Backend: {BACKEND_URL}")
    print("Appuyez sur 'q' pour quitter")
    print("Appuyez sur 'e' pour ENTREE, 's' pour SORTIE")
    print("=" * 50)
    
    # Ouvrir la webcam
    cap = cv2.VideoCapture(0)
    
    if not cap.isOpened():
        print("✗ Impossible d'ouvrir la caméra")
        return
    
    type_pointage = "ENTREE"  # Par défaut
    
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        
        # Afficher le type de pointage actuel
        cv2.putText(frame, f"Type: {type_pointage}", (10, 30), 
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        
        # Décoder les QR codes
        decoded_objects = decode(frame)
        
        for obj in decoded_objects:
            try:
                qr_data = obj.data.decode('utf-8')
                employe_id = parse_qr_data(qr_data)
                
                # Vérifier le cooldown
                if can_scan(employe_id):
                    print(f"\n📷 QR Code détecté: {qr_data}")
                    print(f"   ID Employé: {employe_id}")
                    print(f"   Type: {type_pointage}")
                    
                    # Enregistrer
                    if enregistrer_presence(employe_id, type_pointage):
                        last_scan_time[employe_id] = time.time()
                        
                        # Dessiner un rectangle vert autour du QR
                        points = obj.polygon
                        if len(points) == 4:
                            pts = [(point.x, point.y) for point in points]
                            for i in range(4):
                                cv2.line(frame, pts[i], pts[(i+1)%4], (0, 255, 0), 3)
                else:
                    print(f"⏳ Cooldown actif pour l'employé {employe_id}")
                    
            except (ValueError, IndexError) as e:
                print(f"✗ QR Code invalide: {qr_data}")
        
        # Afficher le flux
        cv2.imshow("Scanner QR Code - Pointage RH (q=quitter, e=ENTREE, s=SORTIE)", frame)
        
        # Gestion des touches
        key = cv2.waitKey(1) & 0xFF
        if key == ord('q'):
            break
        elif key == ord('e'):
            type_pointage = "ENTREE"
            print("\n→ Mode: ENTREE")
        elif key == ord('s'):
            type_pointage = "SORTIE"
            print("\n→ Mode: SORTIE")
        elif key == ord('p'):
            type_pointage = "PAUSE_DEBUT"
            print("\n→ Mode: PAUSE_DEBUT")
        elif key == ord('f'):
            type_pointage = "PAUSE_FIN"
            print("\n→ Mode: PAUSE_FIN")
    
    cap.release()
    cv2.destroyAllWindows()
    print("\n✓ Scanner arrêté")

if __name__ == "__main__":
    main()
