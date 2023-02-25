import { promesseConnexion } from './connexion.js';

export const getUrgences = async () => {
    let connexion = await promesseConnexion;

    let resultat = await connexion.all('SELECT * FROM urgence');

    return resultat;
}

export const addUrgence = async (idUtilisateur, niveauUrgence, pointsUrgence, dateUrgence, etatUrgence) => {
    let connexion = await promesseConnexion;

    let resultat = await connexion.run(
        `INSERT INTO urgence (id_utilisateur, id_urgence, niveau_urgence, points_urgence, date_urgence, etat_urgence) 
        VALUES (?,?,0,?,?)`,
        [idUtilisateur, niveauUrgence, pointsUrgence, dateUrgence, etatUrgence]
    );
}

export const deleteUrgence= async (id)=>{
    let connexion = await promesseConnexion;
    
     await connexion.run(
        `DELETE FROM  urgence WHERE id_urgence = ? `,
        [id]
    ); 
}
export const getNiveauUrgence= async()=>{
    let connexion = await promesseConnexion;
    
   let resultat= await connexion.run(
       `SELECT COUNT(*) FROM urgence WHERE niveau_urgence = ? `,
       [id]
   ); 
   return resultat;
}