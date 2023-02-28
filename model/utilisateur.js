import { promesseConnexion } from "./connexion.js";
import { hash } from "bcrypt";

export const getUserId = async (courriel) => {
    let connexion = await promesseConnexion;

    let newId = await connexion.run( `SELECT id_utilisateur FROM utilisateur WHERE courriel=?`,[courriel]);

    return newId.lastID;
}

const addUtilisateur =async (access, nomUtilisateur, nom, prenom, courriel, motDePasse)=>{
    let connexion = await promesseConnexion;

    let motDePasseHach= await hash(motDePasse, 10);
    await connexion.run(
        `INSERT INTO utilisateur (id_type_utilisateur,nom_utilisateur, nom, prenom, courriel, mot_passe)
        VALUES(?,?,?,?,?,?)`,
        [access,nomUtilisateur, nom, prenom, courriel, motDePasseHach]
    )

}

export const addPatient = async (nomUtilisateur, nom, prenom, courriel, motDePasse, numeroCarteSante, numeroTel) => {
    await addUtilisateur(1, nomUtilisateur, nom, prenom, courriel, motDePasse);
    let userId = await getUserId(courriel);

    let connexion = await promesseConnexion;

    await connexion.run(
        `INSERT INTO patient (id_utilisateur, numero_carte_sante, numero_tel)
        VALUES(?,?,?)`,
        [userId, numeroCarteSante, numeroTel]
    )
}

export const addInfirmier = async (nomUtilisateur, nom, prenom, courriel, motDePasse) => {
    await addUtilisateur(2, nomUtilisateur, nom, prenom, courriel, motDePasse);
    let userId = await getUserId(courriel);

    let connexion = await promesseConnexion;

    await connexion.run(
        `INSERT INTO infirmier (id_utilisateur) VALUES (?)`,
        [userId]
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

export const getUtilisateurById=async (idUtilisateur)=>{
    let connexion = await promesseConnexion;

   let utilisateur= await  connexion.get(
        `SELECT * FROM utilisateur U INNER JOIN patient P ON U.id_utilisateur = P.id_utilisateur
        WHERE U.id_utilisateur= ?`,
        [idUtilisateur]
    );
    console.log(utilisateur)
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

export const updatePatient = async (idUtilisateur, nom, prenom, courriel, tel, carteSante) => {
    let connexion = await promesseConnexion;

    await connexion.run(
        `UPDATE utilisateur
        SET nom = ?, prenom = ?, courriel = ?
        WHERE id_utilisateur = ?`,
        [nom, prenom, courriel, idUtilisateur]
    );

    await connexion.run(
        `UPDATE patient
        SET numero_carte_sante = ?, numero_tel = ?
        WHERE id_utilisateur = ?`,
        [carteSante, tel, idUtilisateur]
    );
}