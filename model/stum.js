
import { promesseConnexion } from './connexion.js';
import { getUtilisateurById2 } from './utilisateur.js';
import { getUrgenceValidByIdUser } from './urgence.js';

//send email
import nodemailer from "nodemailer";

import 'dotenv/config';


export const getUrgences = async () => {
  let connexion = await promesseConnexion;

  let resultat = await connexion.all('SELECT * FROM urgence');

  return resultat;


}

export const getId_Urgence = async (id_utilisateur) => {
  let connexion = await promesseConnexion;

  let urgence = await connexion.get(
    `SELECT id_urgence FROM urgence WHERE id_utilisateur = 4 and etat_urgence = 1`,
    
  );
  let urgenceId = urgence;
    console.log('resulata')
  console.log(urgenceId)
  return urgenceId;

}

export const deleteEmergency = async (id_urgence) => {
  let connexion = await promesseConnexion;


  let rdvUrgence = await connexion.get(
    `SELECT date_rendez_vous FROM rendez_vous WHERE id_urgence = ?`,
    [id_urgence]);

  if (rdvUrgence) {
    let rdvDate = rdvUrgence.date_rendez_vous;
    let nowDate = new Date();
    let diffMinutes = Math.round((rdvDate - nowDate) / (1000 * 60)); // calculate the difference in minutes

    if (diffMinutes > 25) {
       

      // recupere la date rendez vous de l'urgence supprimé
      let daterdvsupprime =await connexion.get(
        `SELECT date_rendez_vous FROM rendez_vous WHERE id_urgence = ?`,
        [id_urgence]);

        // updater le dernier rdv avec le rdv supprimé  puis faire un update de tous les rdv
        await connexion.run(
          `UPDATE rendez_vous SET date_rendez_vous = ? WHERE date_rendez_vous = (
            SELECT MAX(date_rendez_vous) FROM rendez_vous
          );`,[daterdvsupprime.date_rendez_vous]);

      // delete the urgency and the last appointment in appoinment table 
      await connexion.run(`DELETE FROM rendez_vous WHERE id_urgence = ?`, [id_urgence]);
      await connexion.run(`DELETE FROM urgence WHERE id_urgence = ?`, [id_urgence]);
      await connexion.run(`DELETE FROM formulaire WHERE id_urgence = ?`, [id_urgence]);

      updateRDVuser();

    }

    else {
      await connexion.run(`DELETE FROM urgence WHERE id_urgence = ?`, [id_urgence]);
      await connexion.run(`DELETE FROM rendez_vous WHERE id_urgence = ?`, [id_urgence]);
      await connexion.run(`DELETE FROM formulaire WHERE id_urgence = ?`, [id_urgence]);


    }
  }

}




export const sendEmail = async (emaildata) => {

  const transporter = nodemailer.createTransport({

    service: 'gmail',

    auth: {
      user: process.env.USEREMAIL,
      pass: process.env.PASSEMAIL,
    }
  });

  try {
    let info = await transporter.sendMail({
      from: 'STUM <stum.rdv@gmail.com>',
      to: emaildata.to,
      subject: emaildata.subject,
      html: emaildata.html,

    });
    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    return 'Email sent successfully';

  } catch (err) {
    console.error(" catch erreur envoi", err);
    throw new Error('Failed to send email');
  }
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
//mettre a jour le rdv
export const updateRDVuser = async () => {

  updateEtatUrgence();

  let connexion = await promesseConnexion;

  // Récupérer la liste des utilisateurs ayant une urgence
  let utilisateurs = await connexion.all(
    `SELECT id_utilisateur FROM urgence where etat_urgence =1 `
  );


  // get rdv by date order
  let DATENOW = new Date(Date.now());
  let rdvs = await connexion.all(
    `SELECT id_rendez_vous, date_rendez_vous 
       FROM rendez_vous 
       where date_rendez_vous >= ?
       ORDER BY date_rendez_vous ASC`,
    [DATENOW]
  );

  // get urgence by point order
  let urgences = await connexion.all(

    `SELECT id_urgence,id_utilisateur, points_urgence 
       FROM urgence 
       where etat_urgence =1
       ORDER BY points_urgence DESC`
  );

  const emailsPromises = [];
  // update rdv   et comparer entre l<ancien et le nouveau rdv pour les notifications
  if (rdvs && rdvs.length > 0) {
    for (let i = 0; i < utilisateurs.length; i++) {
      let DATENOW = new Date(Date.now());

      // Récupérer l'ancien rendez-vous avant la mise à jour
      let oldrdv = await connexion.get(
        `SELECT id_rendez_vous, date_rendez_vous 
             FROM rendez_vous 
             WHERE id_utilisateur = ?`,
        [urgences[i]?.id_utilisateur]
      );


      // mettre a jour rdv 
      await connexion.run(
        `UPDATE rendez_vous SET date_rendez_vous = ? WHERE id_utilisateur = ?`,
        [rdvs[i]?.date_rendez_vous, urgences[i]?.id_utilisateur]
      );

      // Récupérer le rendez-vous mis à jour
      let updatedrdv = await connexion.get(
        `SELECT id_rendez_vous, date_rendez_vous 
           FROM rendez_vous 
           WHERE id_utilisateur = ?`,
        [urgences[i]?.id_utilisateur]
      );


      //get last urgence

      let lastUrgence = await connexion.get(
        `SELECT id_utilisateur FROM urgence ORDER BY id_urgence DESC LIMIT 1`
      );

      let emailData;
      //get user info
      const utilisateur = await getUtilisateurById2(urgences[i]?.id_utilisateur);

      const date = new Date(rdvs[i]?.date_rendez_vous);
      const dateNormaleRdv = date.toLocaleString();

      // Comparer les deux rendez-vous pour déterminer si l'ancien rendez-vous est différent du nouveau

      if (oldrdv?.date_rendez_vous !== updatedrdv?.date_rendez_vous) {



        //si le  premier rdv de l<utilisateur a ete updater des le premier coup 

        if (lastUrgence?.id_utilisateur === urgences[i]?.id_utilisateur) {

          console.log(`bonjour , votre rendez-vous Mr l'utilisateur${utilisateur.prenom} ${utilisateur.nom}est prevu pour le ${dateNormaleRdv} `);
          console.log(" if");
          emailData = {

            to: utilisateur.courriel,
            subject: `rendez-vous d'urgence`,
            html: `
              <div >
               
                <p>Bonjour ${utilisateur.prenom} ${utilisateur.nom},</p>
                <p> Votre rendez-vous est prevu pour le ${dateNormaleRdv} .</p>
                <p>Veuillez noter que ceci est juste une version d'essai et que tout rendez-vous est juste une simulation.</p>
              </div>
            `
          };
         emailsPromises.push(sendEmail(emailData));

        }

        else {

          console.log(`bonjour,votre rendez-vous Mr l'utilisateur${utilisateur.prenom} ${utilisateur.nom} a été mis à jour. le nouveau rdv est prevu pour :${dateNormaleRdv}`);
          console.log("else");
          emailData = {
            to: utilisateur.courriel,
            subject: `rendez-vous d'urgence`,
            html: `
              <div>
               
                <p>Bonjour ${utilisateur.prenom} ${utilisateur.nom},</p>
                <p>Votre rendez-vous a été mis à jour. Le nouveau rendez-vous est prévu pour ${dateNormaleRdv}.</p>
                <p>Veuillez noter que ceci est juste une version d'essai et que tout rendez-vous est juste une simulation.</p>
              </div>
            `
          };
         emailsPromises.push(sendEmail(emailData));

        }



      }

      // si le rdv de la derniere urgence n<est pas modifie   il envoi un courriell au patient
      else if (lastUrgence?.id_utilisateur === urgences[i]?.id_utilisateur) {
        console.log("else if");
        console.log(`bonjour , votre rendez-vous Mr l'utilisateur ${utilisateur.prenom} ${utilisateur.nom} est prevu pour le ${dateNormaleRdv} `);
        emailData = {

          to: utilisateur.courriel,
          subject: `rendez-vous d'urgence`,
          html: `
          <div >
           
            <p>Bonjour ${utilisateur.prenom} ${utilisateur.nom},</p>
            <p>Votre rendez-vous est prevu pour le ${dateNormaleRdv}</p>
            <p>Veuillez noter que ceci est juste une version d'essai et que tout rendez-vous est juste une simulation.</p>
          </div>
        `
        };


        emailsPromises.push(sendEmail(emailData));
      }
      console.log(emailData);






    }
    // send all emails asynchronously and continue with program execution
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


    // il envois un email chaque 10 secondes pour eviter limit exeeded

    async function sendEmails() {
      for (let i = 0; i < emailsPromises.length; i++) {
        const timestamp = Date.now();
        console.log(`Sending email ${i} at ${timestamp} ms`);
        await delay(10000); // 10 second delay
        try {
          await emailsPromises[i];
        } catch (error) {
          console.error('Error sending email:', error);
        }
      }
      console.log('All emails sent successfully');
    }

   sendEmails();


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
  if (lastRdv.last_rdv_date == null || (Date.now() - new Date(lastRdv.last_rdv_date) > 10 * 60 * 1000)) {
    newRdvDate = new Date(Date.now() + 30 * 60 * 1000);


  } else {


    newRdvDate = new Date(lastRdv.last_rdv_date);
    newRdvDate.setMinutes(newRdvDate.getMinutes() + 30);

  }
  console.log('id utili kocyl', id_utilisateur)

  let urgence = await connexion.get(
    `SELECT id_urgence FROM urgence WHERE id_utilisateur = ? and etat_urgence = 1`,
    [id_utilisateur]
  );
  let urgenceId = urgence.id_urgence;
  console.log("wagi id urgence", urgenceId);


  await connexion.run(
    `INSERT INTO rendez_vous (id_utilisateur,id_urgence, date_rendez_vous)
     VALUES (?, ?, ?)`,
    [id_utilisateur, urgenceId, newRdvDate]
  );


  await updateRDVuser();

}



export const checkUrgenceEnCours = async (id_utilisateur) => {
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
export const addFormulaire = async (id_utilisateur, data) => {
  let connexion = await promesseConnexion;
  console.log('athaaayyaaa id utili')
  console.log(id_utilisateur)
  let id_urgence;
  try {
  let urgence = await connexion.get(
    `SELECT id_urgence FROM urgence WHERE id_utilisateur = ? and etat_urgence = 1`,
    [id_utilisateur]
  );
 console.log('wayiiiiiii id urgence')
  id_urgence =urgence.id_urgence;
  console.log( urgence);
} catch (error) {
  console.error(error);
}

  await connexion.run(
    `INSERT INTO formulaire (id_utilisateur,id_urgence, date_debut_symptomes, description, symptomes, medical_condition, hospital_history, medication_history, last_meal, tete_gauche, tete_droite, cou_gauche, cou_droite, epaule_gauche, epaule_droite, poitrine_gauche, poitrine_droite, coude_gauche, coude_droite, main_et_poignet_gauche, main_et_poignet_droit, hanche_gauche, hanche_droite, cuisse_gauche, cuisse_droite, genou_gauche, genou_droit, jambe_gauche, jambe_droite, pied_gauche, pied_droite, douleur_present, douleur8jours, douleur_intense)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [id_utilisateur, id_urgence, data.date_debut_symptomes, data.description, data.symptomes, data.medical_condition, data.hospital_history, data.medication_history, data.last_meal, data.tete_gauche[0], data.tete_droite[0], data.cou_gauche[0], data.cou_droite[0], data.epaule_gauche[0], data.epaule_droite[0], data.poitrine_gauche[0], data.poitrine_droite[0], data.coude_gauche[0], data.coude_droite[0], data.main_et_poignet_gauche[0], data.main_et_poignet_droit[0], data.hanche_gauche[0], data.hanche_droite[0], data.cuisse_gauche[0], data.cuisse_droite[0], data.genou_gauche[0], data.genou_droit[0], data.jambe_gauche[0], data.jambe_droite[0], data.pied_gauche[0], data.pied_droite[0], data.douleur_present, data.douleur8jours, data.douleur_intense]
  )
}







export const getRdvFutur = async (id_Utilisateur) => {
  let connexion = await promesseConnexion;

  try {
    let RdvFutur = await connexion.all(
      `SELECT  * FROM rendez_vous RV INNER JOIN urgence U ON RV.id_utilisateur = U.id_utilisateur WHERE etat_urgence = 1 AND U.id_utilisateur = ?`,
      [id_Utilisateur]
    );

    // Convertir la date en format LocalDate string
    RdvFutur = RdvFutur.map((rdv) => {
      const dateRdv = new Date(rdv.date_rendez_vous);
      rdv.date_rendez_vous = dateRdv.toLocaleString();
      return rdv;
    });


    return RdvFutur;
  }
  catch (error) {
    console.log(error);
    return null;
  }

}
