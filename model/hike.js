//importer la laision ver la base de donnee 
import { promesseConnexion } from './connexion.js';

/* fonction pour recuper les hikes de la base de donnee  */
export const getHikes = async () => {
    let connexion = await promesseConnexion;

    let resultat = await connexion.all('SELECT * FROM hike');
    for (let i = 0; i < resultat.length; i++) {
        let date=new Date(resultat[i].date_debut);
 
        resultat[i].date_debut=  date.toDateString()+", "+date.getHours() + ":" + date.getMinutes();
    }

    return resultat;

}

// fonction pour ajoputer des hikes a la base de donnee 
export const addHike = async (nom, date_debut, capacite, description) => {
    let connexion = await promesseConnexion;
   const date =new Date(date_debut).getTime();

    let resultat = await connexion.run(
        `INSERT INTO hike (nom, date_debut, nb_hike, capacite, description) 
        VALUES (?,?,0,?,?)`,
        [nom,date,capacite,description]
    );

    return resultat.lastID;
}


// fonction pour supprimer un hike de la base de donnee a partir son id 
export const deleteHike= async (id)=>{
    let connexion = await promesseConnexion;
    
     await connexion.run(
        `DELETE FROM  hike WHERE id_hike = ? `,
        [id]
    );
   
    
}
// fonction pour recuperer les hikes auquel lutilisateur est inscrit de la base de donnee
export const getMyHikes = async () => {
    let connexion = await promesseConnexion;

    let resultat = await connexion.all('SELECT * FROM hike INNER JOIN hike_utilisateur ON hike.id_hike=hike_utilisateur.id_hike AND id_utilisateur = 1 ');
    for (let i = 0; i < resultat.length; i++) {
        let date=new Date(resultat[i].date_debut);
       
      
        resultat[i].date_debut=  date.toDateString()+", "+date.getHours() + ":" + date.getMinutes();
    }
    return resultat;
}

/*inscrire un utilisateur a un hike en lajoutanat a la table hike_utilisateur 
Mais avant on verifie si on a des places vide pour ce hike
*/ 
export const inscrireHike =async(id)=>{
     let connexion =await promesseConnexion;
     console.log('hello');
     let Cap=await connexion.run( `SELECT capacite FROM hike WHERE id_hike=?`,[id]);
     let nbHike=await connexion.run( `SELECT nb_hike FROM hike WHERE id_hike=?`,[id]);

         


         if (Cap>=nbHike){
         
     await connexion.run(
         `INSERT INTO  hike_utilisateur (id_hike, id_utilisateur) 
         VALUES  (?,1)`,
         [id]
     );
     await connexion.run(
        `UPDATE hike
        SET nb_hike = nb_hike+1
        WHERE id_hike=?`,
        [id]
    );
     }
 }
 /*desinscrire un utilisateur a un hike en le supprimant a la table hike_utilisateur*/
 export const desinscrireHike= async (id)=>{
     let connexion = await promesseConnexion;
    
      await connexion.run(
         `DELETE FROM   hike_utilisateur WHERE id_hike = ? `,
         [id]
     );
     await connexion.run(
        `UPDATE hike
        SET nb_hike = nb_hike-1
        WHERE id_hike=?`,
        [id]
    )
}
// fonction qui retourne les inscription aux hikes de la base de donnee
//on retourne la table hike_utilisateurpouir la comparer apres 
export const getInscription= async ()=>{
    let connexion = await promesseConnexion;
    
     let resultat=await connexion.all(
        'SELECT * FROM hike_utilisateur'
    );
    return resultat;
}