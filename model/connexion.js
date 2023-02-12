
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
            courriel TEXT NOT NULL UNIQUE,
            mot_passe TEXT NOT NULL,
            prenom TEXT NOT NULL,
            nom TEXT NOT NULL,
            CONSTRAINT fk_type_utilisateur 
                FOREIGN KEY (id_type_utilisateur)
                REFERENCES type_utilisateur(id_type_utilisateur) 
                ON DELETE SET NULL 
                ON UPDATE CASCADE
        );
        
        CREATE TABLE IF NOT EXISTS patient(
            id_utilisateur INTEGER PRIMARY KEY,
            Num_carte_sante INTEGER PRIMARY KEY ,
            tel TEXT NOT NULL,
            CONSTRAINT fk_id_utilisateur 
                FOREIGN KEY (id_utilisateur)
                REFERENCES utilisateur(id_utilisateur) 
                ON DELETE SET NULL 
                ON UPDATE CASCADE
        );
        CREATE TABLE IF NOT EXISTS infirmier(
            id_utilisateur INTEGER PRIMARY KEY,
            code_infirmier INTEGER PRIMARY KEY ,
            CONSTRAINT fk_id_utilisateur 
                FOREIGN KEY (id_utilisateur)
                REFERENCES utilisateur(id_utilisateur) 
                ON DELETE SET NULL 
                ON UPDATE CASCADE
        );
        
        CREATE TABLE IF NOT EXISTS urgence(
            id_urgence INTEGER AUTOINCREMENT,
            id_utilisateur INTEGER,
            PRIMARY KEY (id_urgence, id_utilisateur),
            niveau_urgence INTEGER,
            points_urgences INTEGER,
            date_urgence DATE,
            etat_urgence enum('active','termine'),
            CONSTRAINT fk_utilisateur_urgence
                FOREIGN KEY (id_utilisateur)
                REFERENCES utilisateur(id_utilisateur) 
                ON DELETE SET NULL 
                ON UPDATE CASCADE
        );
        
        // INSERT INTO type_utilisateur (type) VALUES 
        //     ('regulier'),
        //     ('administrateur');
        // INSERT INTO utilisateur (id_type_utilisateur, courriel, mot_passe, prenom, nom) VALUES 
        //     (2, 'admin@admin.com', 'admin', 'Admin', 'Admin'),
        //     (1, 'john_doe@gmail.com', 'passw0rd', 'John', 'Doe'),
        //     (1, 'sera@gmail.com', 'passw0rd', 'Seraphina', 'Lopez'),
        //     (1, 'arlo_shield@gmail.com', 'passw0rd', 'Arlo', 'Shield'),
        //     (1, 'blyke_ray@gmail.com', 'passw0rd', 'Blyke', 'Leclerc'),
        //     (1, 'remi_fast@gmail.com', 'passw0rd', 'Remi', 'Smith'),
        //     (1, 'isen_radar@gmail.com', 'passw0rd', 'Isen', 'Turner'),
        //     (1, 'elaine_doc@gmail.com', 'passw0rd', 'Elaine', 'Nelson'),
        //     (1, 'zeke_the_form@gmail.com', 'passw0rd', 'Zeke', 'Anderson');
            
        // INSERT INTO hike (nom, date_debut, nb_hike, capacite, description) VALUES 
        //     ('Luskville Falls', 1662508800000, 12, 12, 'This trail offers amazing views of the surrounding area and a few waterfalls. While the waterfalls may not be very active during the dry season. The difficulty level of this trail is largely due to the initial incline which can be intense.'),
        //     ('Mont King', 1662681600000, 10, 24, 'For such a short hike, you get breathtaking and clear views of the region, including of Gatineau and Ottawa. There is even a little lake where there is usually beaver activity.'),
        //     ('Tomato Hill', 1661522400000, 8, 20, 'Situated on the Western section of the Eardley Escarpment, this trail offers breathtaking lookout point of the Outaouais River and the surrounding area. For a trail that is not too difficult, this is a great trail to do on the weekend. '),
        //     ('Grandview Loop', 1662418800000, 9, 10, 'This loop is essentially this first part of the Yellow Box Trail. For such a short hike, you get unbelievable views. Because it only takes 2 hours to complete,'),
        //     ('Wolf Trail', 1662465600000, 15, 25, 'The Wolf trail is a classic among hikers of the Gatineau Park. It offers amazing views not only of the interior of the Gatineau Park, but also of the Outaouais River. The last lookout point (complete the trail counterclockwise) offers a great view of the sunset'),
        //     ('Lusk Cave Trail', 1662588000000, 5, 15, 'This is probably the most unique trail in the entire Gatineau Park. While the trail itself is relatively ordinary, passing along the beautiful Philippe Lake and Lusk Lake, the key attraction is the Lusk Cave system. This cave system can be explored (at your own risk)'),
        //     ('Pink Lake', 1667257200000, 1, 45, 'The Pink Lake trail is probably one of the most popular trails in the Gatineau Park for first-time visitors and hiking enthusiasts alike. With its turquoise green, sometimes bleu water, the Pink Lake is absolutely beautiful, especially on a nice summer day');
        
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
