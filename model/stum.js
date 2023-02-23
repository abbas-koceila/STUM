import { promesseConnexion } from './connexion.js';
import {getUserId} from './utilisateur.js'

export const getUrgences = async () => {
    let connexion = await promesseConnexion;

    let resultat = await connexion.all('SELECT * FROM urgence');

    return resultat;

}


export const assignRdv = async (id_utilisateur) => {
    let connexion = await promesseConnexion;
    let lastRdv = await connexion.get(
      `SELECT MAX(date_rendez_vous) AS last_rdv_date FROM rendez_vous WHERE id_utilisateur = ?`,
      [id_utilisateur]
    );
    
    let newRdvDate;
    //si le rdv il n<existe pas ou le dernier rdv date de plus de 10 minutes en arriere 
    //pour pouvoir donner au patient le temps de se rendre a l hopital 
    if (lastRdv.last_rdv_date == null || (Date.now() - new Date(lastRdv.last_rdv_date) > 10 * 60 * 1000) ) {
      newRdvDate = new Date(Date.now() + 30 * 60 * 1000);
    } else {
      newRdvDate = new Date(lastRdv.last_rdv_date);
      newRdvDate.setMinutes(newRdvDate.getMinutes() + 30);
    }
  
    await connexion.run(
      `INSERT INTO rendez_vous (id_utilisateur, date_rendez_vous)
       VALUES (?, ?)`,
      [id_utilisateur, newRdvDate]
    );
  }
  


export const addUrgence = async (niveauUrgence, pointsUrgence,id_utilisateur) => {
    
    let connexion = await promesseConnexion;
    let dateUrgence = new Date(Date.now());
 

    await connexion.run(
        `INSERT INTO urgence (id_utilisateur, niveau_urgence, points_urgence, date_urgence, etat_urgence)
        VALUES(?,?,?,?,?)`,
        [id_utilisateur, niveauUrgence, pointsUrgence, dateUrgence, 1]
    );

    await assignRdv(id_utilisateur);

}

