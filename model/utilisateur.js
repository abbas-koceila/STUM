import { promesseConnexion } from "./connexion.js";
import { hash } from "bcrypt";

export const getUserId = async (courriel) => {
    let connexion = await promesseConnexion;

    let newId = await connexion.run( `SELECT id_utilisateur FROM utilisateur WHERE courriel=?`,[courriel]);

    return newId.lastID;
}

export const getUtilisateurById = async (id) => {
    let connexion = await promesseConnexion;

    let utilisateur = await connexion.get( `SELECT * FROM utilisateur WHERE id_utilisateur=?`,[id]);

    return utilisateur;
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