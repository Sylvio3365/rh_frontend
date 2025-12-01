# Projet de Suivi de Présence des Employés avec QR Code

Ce projet permet de suivre la présence des employés en utilisant un QR code. Chaque employé a un QR code unique, généré et lié à son identifiant dans une base de données MySQL. Le système scanne les QR codes via la caméra et enregistre la présence dans une table.

## Fonctionnalités :
- Génération de QR code unique pour chaque employé.
- Enregistrement de la présence des employés avec l'heure exacte.
- Interface de lecture des QR codes avec OpenCV.
- Suivi des présences dans une base de données MySQL.

## Installation :
1. Clonez ce dépôt.
2. Installez les dépendances avec `pip install -r requirements.txt`.
3. Configurez la base de données MySQL.
4. Lancez les scripts Python pour générer des QR codes et suivre la présence.

## Script :
- `insert_employe.py` : Pour ajouter un employé dans la base et générer son QR code.
- `scanner.py` : Pour scanner un QR code via la caméra et enregistrer la présence.
