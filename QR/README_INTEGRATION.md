# 🔗 Intégration Python avec Spring Boot

## 📦 Installation

```bash
cd QR
pip install -r requirement.txt
```

## 🎯 Utilisation

### 1. Générer les QR Codes

```bash
python src/generate_qr.py
```

Cela va :
- Se connecter à PostgreSQL (rhdb)
- Récupérer tous les employés actifs
- Générer un QR code pour chacun dans `qr_codes/`
- Format: `EMPLOYEE_ID:123` (compatible avec le scanner Vue.js)

### 2. Scanner avec la webcam

```bash
python src/scanner.py
```

**Contrôles :**
- `e` : Mode ENTREE
- `s` : Mode SORTIE
- `p` : Mode PAUSE_DEBUT
- `f` : Mode PAUSE_FIN
- `q` : Quitter

Le scanner envoie automatiquement les pointages au backend Spring Boot (`http://localhost:9090/api/pointage/enregistrer`)

## 🔄 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    PostgreSQL (rhdb)                     │
│                                                          │
│  Tables: personnel, pointage, presence_journaliere, etc. │
└─────────────────────────────────────────────────────────┘
                    ↑                    ↑
                    │                    │
        ┌───────────┴──────┐   ┌────────┴─────────┐
        │                  │   │                  │
        │  Python Scripts  │   │  Spring Boot     │
        │                  │   │  (Port 9090)     │
        │  - generate_qr   │   │                  │
        │  - scanner       │   │  - API REST      │
        │                  │   │  - Consolidation │
        └──────────────────┘   └──────────────────┘
                                        ↑
                                        │
                                ┌───────┴────────┐
                                │                │
                                │  Vue.js        │
                                │  Frontend      │
                                │  (Port 4000)   │
                                │                │
                                │  - QrScanner   │
                                │  - Pointage UI │
                                └────────────────┘
```

## 🔧 Configuration

### databas_connection.py
```python
host="localhost"
port=5432
user="postgres"
password="ondryboutry006"  # ← Votre mot de passe
database="rhdb"
```

### scanner.py
```python
BACKEND_URL = "http://localhost:9090/api/pointage/enregistrer"
```

## 📋 Formats de QR Code

Les QR codes générés utilisent le format : `EMPLOYEE_ID:123`

Ce format est compatible avec :
- ✓ Scanner Python (scanner.py)
- ✓ Scanner Vue.js (QrScanner.vue)
- ✓ Backend Spring Boot

## 🎨 Exemples

### Générer un QR pour un employé spécifique
```python
from src.generate_qr import generate_qr_code
generate_qr_code(1)  # Génère pour l'employé ID=1
```

### Envoyer un pointage manuellement
```python
from src.scanner import enregistrer_presence
enregistrer_presence(1, "ENTREE")
```

## 🚀 Workflow complet

1. **Générer les QR codes** : `python src/generate_qr.py`
2. **Imprimer les QR codes** pour chaque employé
3. **Démarrer le backend** : `mvn spring-boot:run` (dans rh_backend/)
4. **Scanner** :
   - Option A : Webcam Python → `python src/scanner.py`
   - Option B : Interface web → `npm run dev` (dans rh_frontend/)

## 🔒 Sécurité

- Les scripts Python se connectent directement à PostgreSQL
- Le scanner Python envoie les données via l'API REST Spring Boot
- Même validation et consolidation que l'interface web
