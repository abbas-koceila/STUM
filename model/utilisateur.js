import { promesseConnexion } from "./connexion.js";
import { hash } from "bcrypt";


export const addUtilisateur =async (nomUtilisateur, motDePasse,courriel,nom,prenom,Num_carte_sante,tel)=>{
    let connexion = await promesseConnexion;

    let motDePasseHach= await hash(motDePasse, 10);
    await connexion.run(
        `INSERT INTO utilisateur (id_type_utilisateur,nom_utilisateur, courriel, mot_passe, prenom, nom)
        VALUES(?,?,?,?,?,?)`,
        [1,nomUtilisateur, courriel, motDePasseHach, prenom , nom],
        `INSERT INTO patient (Num_carte_sante, tel)
        VALUES(?,?)`,
        [Num_carte_sante, tel]
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