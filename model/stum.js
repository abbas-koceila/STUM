import { promesseConnexion } from './connexion.js';
import { getUtilisateurById } from './utilisateur.js';

//send email
import nodemailer from "nodemailer";

import 'dotenv/config';


export const getUrgences = async () => {
  let connexion = await promesseConnexion;

  let resultat = await connexion.all('SELECT * FROM urgence');

  return resultat;

}



export const sendEmail= async(emaildata)=> {

  const transporter = nodemailer.createTransport({
      host: 'smtp-mail.outlook.com',                  // hostname
      service: 'outlook',                             // service name
      secureConnection: false,
      tls: {
          ciphers: 'SSLv3'                            // tls version
      },
      port: 587,
      auth: {
          user: process.env.USEREMAIL,
          pass: process.env.PASSEMAIL,
      }
  });

  try {
      let info = await transporter.sendMail({
          from:  'STUM <stum.rdv@outlook.com>',
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
      console.error(" catch erreur envoi",err);
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
      const utilisateur = await getUtilisateurById(urgences[i]?.id_utilisateur);

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
                <img src="https://i.pinimg.com/236x/40/1a/46/401a463bbcdd588d251dfc7655fd1cfc.jpg" alt="Logo" style="width: 200px; height: 100px;">
                <p>Bonjour ${utilisateur.prenom} ${utilisateur.nom},</p>
                <p> Votre rendez-vous est prevu pour le ${dateNormaleRdv} .</p>
                <p>Veuillez noter que ceci est juste une version d'essai et que tout rendez-vous est juste une simulation.</p>
              </div>
            `
          };
          await sendEmail(emailData);

        }

        else {

          console.log(`bonjour,votre rendez-vous Mr l'utilisateur${utilisateur.prenom} ${utilisateur.nom} a été mis à jour. le nouveau rdv est prevu pour :${dateNormaleRdv}`);
          console.log("else");
          emailData = {
            to: utilisateur.courriel,
            subject: `rendez-vous d'urgence`,
            html: `
              <div>
                <img src="https://i.pinimg.com/236x/40/1a/46/401a463bbcdd588d251dfc7655fd1cfc.jpg" alt="Logo" style="width: 200px; height: 100px;">
                <p>Bonjour ${utilisateur.prenom} ${utilisateur.nom},</p>
                <p>Votre rendez-vous a été mis à jour. Le nouveau rendez-vous est prévu pour ${dateNormaleRdv}.</p>
                <p>Veuillez noter que ceci est juste une version d'essai et que tout rendez-vous est juste une simulation.</p>
              </div>
            `
          };

          await sendEmail(emailData);

        }
     

 
      }

      // si le rdv de la derniere urgence n<est pas modifie   il envoi un courriell au patient
      else if(lastUrgence?.id_utilisateur === urgences[i]?.id_utilisateur){
        console.log("else if");
        console.log(`bonjour , votre rendez-vous Mr l'utilisateur ${utilisateur.prenom} ${utilisateur.nom} est prevu pour le ${dateNormaleRdv} `);
        emailData = {
      
          to: utilisateur.courriel,
          subject: `rendez-vous d'urgence`,
          html: `
          <div >
            <img src="https://i.pinimg.com/236x/40/1a/46/401a463bbcdd588d251dfc7655fd1cfc.jpg" alt="Logo" style="width: 200px; height: 100px;">
            <p>Bonjour ${utilisateur.prenom} ${utilisateur.nom},</p>
            <p>Votre rendez-vous est prevu pour le ${dateNormaleRdv}</p>
            <p>Veuillez noter que ceci est juste une version d'essai et que tout rendez-vous est juste une simulation.</p>
          </div>
        `
        };

    
        await sendEmail(emailData);
      }
      console.log(emailData);






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
  if (lastRdv.last_rdv_date == null || (Date.now() - new Date(lastRdv.last_rdv_date) > 10 * 60 * 1000)) {
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
