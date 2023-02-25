import { existsSync } from 'fs';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

/**
 * Constante indiquant si la base de données existe au démarrage du serveur 
 * ou non.
 */
const IS_NEW = !existsSync(process.env.DB_FILE)

/**
 * Crée une base de données par défaut pour le serveur. Des données fictives
 * pour tester le serveur y ont été ajouté.
 */
const createDatabase = async (connectionPromise) => {
    let connection = await connectionPromise;

    await connection.exec(
        `CREATE TABLE IF NOT EXISTS type_utilisateur(
            id_type_utilisateur INTEGER PRIMARY KEY,
            type TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS utilisateur(
            id_utilisateur INTEGER PRIMARY KEY AUTOINCREMENT,
            id_type_utilisateur INTEGER NOT NULL,
            nom_utilisateur TEXT NOT NULL UNIQUE,
            nom TEXT NOT NULL,
            prenom TEXT NOT NULL,
            courriel TEXT NOT NULL UNIQUE,
            mot_passe TEXT NOT NULL,
            date_ajout DATE,
            CONSTRAINT fk_type_utilisateur 
                FOREIGN KEY (id_type_utilisateur)
                REFERENCES type_utilisateur(id_type_utilisateur) 
                ON DELETE SET NULL 
                ON UPDATE CASCADE
        );
        
        CREATE TABLE IF NOT EXISTS patient(
            id_utilisateur INTEGER NOT NULL,
            numero_carte_sante TEXT NOT NULL,
            numero_tel TEXT NOT NULL,
            CONSTRAINT fk_id_utilisateur
                FOREIGN KEY (id_utilisateur)
                REFERENCES utilisateur(id_utilisateur)
                ON DELETE SET NULL
                ON UPDATE CASCADE
        );
        
        CREATE TABLE IF NOT EXISTS infirmier(
            code_infirmier INTEGER PRIMARY KEY AUTOINCREMENT,
            id_utilisateur INTEGER,
            CONSTRAINT fk_id_utilisateur
                FOREIGN KEY (id_utilisateur)
                REFERENCES utilisateur(id_utilisateur) 
                ON DELETE SET NULL 
                ON UPDATE CASCADE
        );

        CREATE TABLE IF NOT EXISTS urgence(
            id_utilisateur INTEGER NOT NULL,
            id_urgence INTEGER PRIMARY KEY AUTOINCREMENT,
            niveau_urgence INTEGER NOT NULL,
            points_urgence INTEGER NOT NULL,
            date_urgence DATE,
            etat_urgence BIT NOT NULL,
            CONSTRAINT fk_id_utilisateur
                FOREIGN KEY (id_utilisateur)
                REFERENCES utilisateur(id_utilisateur)
                ON DELETE SET NULL
                ON UPDATE CASCADE
        );
        
        INSERT INTO type_utilisateur (type) VALUES 
            ('regulier'),
            ('infirmier'),
            ('administrateur');

        INSERT INTO utilisateur (id_utilisateur, id_type_utilisateur, nom, prenom, courriel, nom_utilisateur, mot_passe,date_ajout) VALUES 
            (1, 2, 'Admin', 'admin', 'admin@stum.ca', 'admin', '$2b$10$kQWXsHl9PG5puNHj7q8qY.AQ8LgsTxJISfgy1AVS7dwZ.kzeBCeYS',datetime('now', 'localtime')),
            (2, 1, 'Patient', 'test', 'patient@stum.com', 'patient', 'test',datetime('now', 'localtime'));

        INSERT INTO patient(id_utilisateur, numero_carte_sante, numero_tel) VALUES
            (2, '1234', '1234567890');
        
        INSERT INTO infirmier (code_infirmier, id_utilisateur) VALUES
            (2000, 1);
`
    );

    return connection;
}

// Base de données dans un fichier
export let promesseConnexion = open({
    filename: process.env.DB_FILE,
    driver: sqlite3.Database
});

// Si le fichier de base de données n'existe pas, on crée la base de données
// et on y insère des données fictive de test.
if (IS_NEW) {
    promesseConnexion = createDatabase(promesseConnexion);
} 

