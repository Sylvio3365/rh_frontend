-- Table des employés
CREATE TABLE employes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100),
    prenom VARCHAR(100),
    email VARCHAR(100),
    qr_code VARCHAR(255) -- Chemin vers le QR code de l'employé
);

-- Table des présences
CREATE TABLE presences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_employe INT,
    date_heure DATETIME,
    statut VARCHAR(20),
    FOREIGN KEY (id_employe) REFERENCES employes(id)
);