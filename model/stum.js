import { promesseConnexion } from './connexion.js';
export const getUrgences = async () => {
  let connexion = await promesseConnexion;

  let resultat = await connexion.all('SELECT * FROM urgence');

  return resultat;

}

export const updateEtatUrgence = async () => {
  let connexion = await promesseConnexion;
  let DATENOW = new Date(Date.now());
  await connexion.run(
    `UPDATE urgence
    SET etat_urgence = 0
    WHERE id_utilisateur IN (
        SELECT id_utilisateur
        FROM rendez_vous
        WHERE date_rendez_vous < ?
        
     )`,
     [DATENOW]
  );

}

export const updateRDVuser = async () => {

  updateEtatUrgence();

  let connexion = await promesseConnexion;

  // Récupérer la liste des utilisateurs ayant une urgence
  let utilisateurs = await connexion.all(
    `SELECT id_utilisateur FROM urgence `
  );
  

  let DATENOW = new Date(Date.now());
  let rdvs = await connexion.all(
    `SELECT id_rendez_vous, date_rendez_vous 
       FROM rendez_vous 
       where date_rendez_vous >= ?
       ORDER BY date_rendez_vous ASC`,
       [DATENOW]
  );
  console.log(rdvs) ;


  let urgences = await connexion.all(
        
    `SELECT id_urgence,id_utilisateur, points_urgence 
       FROM urgence 
       where etat_urgence =1
       ORDER BY points_urgence DESC`
  );





  if ( rdvs && rdvs.length > 0 ) {
    for (let i = 0; i < utilisateurs.length; i++) {
      let DATENOW = new Date(Date.now());

      // get ancien rdv avant update 

      let oldrdv = await connexion.get(
        `SELECT id_rendez_vous, date_rendez_vous FROM rendez_vous WHERE id_utilisateur = ? `,
        [utilisateurs[i]?.id_utilisateur]
      );
         // mettre a jour rdv 
      await connexion.run(
        `UPDATE rendez_vous SET date_rendez_vous = ? WHERE id_utilisateur = ?`,
        [rdvs[i]?.date_rendez_vous, urgences[i]?.id_utilisateur]
      );

      // get updatedrdv rdv avant update 
      let updatedrdv = await connexion.get(
        `SELECT id_rendez_vous, date_rendez_vous FROM rendez_vous WHERE id_utilisateur = ?`,
        [utilisateurs[i]?.id_utilisateur]
      );
          //verifier quel rdv mis a jour 
      if (oldrdv[i]?.date_rendez_vous !== updatedrdv[i]?.date_rendez_vous) {
        console.log(`Le rendez-vous pour l'utilisateur ${urgences[i]?.id_utilisateur} a été mis à jour.`);
      }
    }
  }
};



export const assignRdv = async (id_utilisateur) => {
  let connexion = await promesseConnexion;
  let lastRdv = await connexion.get(
    `SELECT MAX(date_rendez_vous) AS last_rdv_date FROM rendez_vous `
 
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


   await updateRDVuser();

}

export const  checkUrgenceEnCours = async (id_utilisateur) =>{
  let connexion = await promesseConnexion;
  try { 
   
    const result = await connexion.get(
      `SELECT COUNT(*) as count FROM urgence WHERE id_utilisateur = ? AND etat_urgence = 1`,
      [id_utilisateur]
    );
    return result.count;
  } catch (error) {
    console.error(error);
    return null;
  }
}







export const addUrgence = async (niveauUrgence, pointsUrgence, id_utilisateur) => {
  await updateEtatUrgence();

  let connexion = await promesseConnexion;
  let dateUrgence = new Date(Date.now());


 
  await connexion.run(
    `INSERT INTO urgence (id_utilisateur, niveau_urgence, points_urgence, date_urgence, etat_urgence)
        VALUES(?,?,?,?,?)`,
    [id_utilisateur, niveauUrgence, pointsUrgence, dateUrgence, 1]
  );

  await assignRdv(id_utilisateur);
  
 

}

