import { promesseConnexion } from "./connexion.js";
import { hash } from "bcrypt";

export const getUserId = async (courriel) => {
    let connexion = await promesseConnexion;

    let newId = await connexion.run( `SELECT id_utilisateur FROM utilisateur WHERE courriel=?`,[courriel]);

    return newId.lastID;
}

const addUtilisateur =async (nomUtilisateur, nom, prenom, courriel, motDePasse)=>{
    let connexion = await promesseConnexion;

    let motDePasseHach= await hash(motDePasse, 10);
    await connexion.run(
        `INSERT INTO utilisateur (id_type_utilisateur,nom_utilisateur, nom, prenom, courriel, mot_passe)
        VALUES(?,?,?,?,?,?)`,
        [1,nomUtilisateur, nom, prenom, courriel, motDePasseHach]
    )

}

export const addPatient = async (nomUtilisateur, nom, prenom, courriel, motDePasse, numeroCarteSante, numeroTel) => {
    await addUtilisateur(nomUtilisateur, nom, prenom, courriel, motDePasse);
    let userId = await getUserId(courriel);

    let connexion = await promesseConnexion;

    await connexion.run(
        `INSERT INTO patient (id_utilisateur, numero_carte_sante, numero_tel)
        VALUES(?,?,?)`,
        [userId, numeroCarteSante, numeroTel]
    )
}

export const getUtilisateurByNom=async (nomUtilisateur)=>{
    let connexion = await promesseConnexion;

   let utilisateur= await  connexion.get(
        `SELECT id_utilisateur , id_type_utilisateur, nom_utilisateur , mot_passe  FROM utilisateur 
        WHERE nom_utilisateur= ?`,
        [nomUtilisateur]
    );
    return utilisateur;
}
export const getTypeAcces=async (nomUtilisateur)=>{
    let connexion = await promesseConnexion;

   let Typeutilisateur= await  connexion.get(
        `id_type_utilisateur FROM utilisateur 
        WHERE nom_utilisateur= ?`,
        [nomUtilisateur]
    );
    return Typeutilisateur;
}
export const getPatient=async ()=>{
    let connexion = await promesseConnexion;

   let utilisateur= await  connexion.all(
        `SELECT ur.date_urgence, ur.niveau_urgence, ut.nom , ut.prenom, rdv.date_rendez_vous FROM urgence ur
        INNER JOIN utilisateur ut 
        ON ur.id_utilisateur = ut.id_utilisateur
        INNER JOIN rendez_vous rdv  
        ON ur.id_utilisateur = rdv.id_utilisateur
        WHERE ur.etat_urgence=1
        ORDER BY rdv.date_rendez_vous DESC`,
    );
    for (let i = 0; i < utilisateur.length; i++) {
        let dateur=new Date(utilisateur[i].date_urgence);
        utilisateur[i].date_urgence =  dateur.toDateString()+", "+dateur.getHours() + ":" + dateur.getMinutes();
        let daterdv=new Date(utilisateur[i].date_rendez_vous);
        utilisateur[i].date_rendez_vous =  daterdv.toDateString()+", "+daterdv.getHours() + ":" + daterdv.getMinutes();
       
    }
    
    return utilisateur;
}