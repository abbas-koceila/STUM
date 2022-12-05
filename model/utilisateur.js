import { promesseConnexion } from "./connexion.js";
import { hash } from "bcrypt";


export const addUtilisateur =async (nomUtilisateur, motDePasse,courriel,nom,prenom)=>{
    let connexion = await promesseConnexion;

    let motDePasseHach= await hash(motDePasse, 10);
    await connexion.run(
        `INSERT INTO utilisateur (id_type_utilisateur,nom_utilisateur, courriel, mot_passe, prenom, nom)
        VALUES(?,?,?,?,?,?)`,
        [1,nomUtilisateur, courriel, motDePasseHach, prenom , nom]
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