import { promesseConnexion } from './connexion.js';
import {getUserId} from './utilisateur.js'

export const getUrgences = async () => {
    let connexion = await promesseConnexion;

    let resultat = await connexion.all('SELECT * FROM urgence');

    return resultat;

}


export const addUrgence = async (niveauUrgence, pointsUrgence,id_utilisateur) => {
    
    let connexion = await promesseConnexion;
    let dateUrgence = new Date(Date.now());
 

    await connexion.run(
        `INSERT INTO urgence (id_utilisateur, niveau_urgence, points_urgence, date_urgence, etat_urgence)
        VALUES(?,?,?,?,?)`,
        [id_utilisateur, niveauUrgence, pointsUrgence, dateUrgence, 1]
    );
}

