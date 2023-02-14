import { promesseConnexion } from "./connexion.js";
import { hash } from "bcrypt";

const getUserId = async (courriel) => {
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

export const updateUtilisateur = async (nomUtilisateur, nom, prenom, courriel, idUtilisateur) => {
    let connexion = await promesseConnexion;

    await connexion.run(
        `UPDATE utilisateur SET (nom_utilisateur, nom, prenom, courriel, mot_passe) VALUES(?,?,?,?,?,?) WHERE id_utilisateur = ?`,
        [nomUtilisateur, nom, prenom, courriel, motDePasseHach],
        [idUtilisateur]
    )
}

export const updatePatient = async (nomUtilisateur, nom, prenom, courriel, numeroCarteSante, numeroTel) => {
    let connexion = await promesseConnexion;

    let idUtilisateur = getUserId();

    updateUtilisateur(nomUtilisateur, nom, prenom, courriel, idUtilisateur)

    await connexion.run(
        `UPDATE patient SET (id_utilisateur, numero_carte_sante, numero_tel) WHERE id_utilisateur = ?`, 
        [userId, numeroCarteSante, numeroTel], [idUtilisateur]
    );
}