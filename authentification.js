import { compare } from "bcrypt";
import passport from "passport";
import {Strategy} from "passport-local";
import { getUtilisateurByNom } from "./model/utilisateur.js";


let config = {
    usernameField: 'nomUtilisateur',
    passwordField: 'motDePasse'
};
passport.use(new Strategy(config, async (nomUtilisateur, motDePasse, done) => {
    try{
    let utilisateur = await getUtilisateurByNom(nomUtilisateur);
    
    if (!utilisateur) {
        return done(null, false, { erreur: 'erreur_nom_utilisateur' })
    }
    let valide = await compare(motDePasse, utilisateur.mot_passe);

    if (!valide) {
        return done(null, false, { erreur: 'erreur_mot_de_passe' })
    }

    return done(null, utilisateur);
}
    catch(error){
        return done(error);
    }
}
));

passport.serializeUser((utilisateur, done )=>{
    done(null, utilisateur.nom_utilisateur)
});

passport.deserializeUser(async(nomUtilisateur, done)=>{
    try{
    let utilisateur = await getUtilisateurByNom(nomUtilisateur);
    done(null,utilisateur)
    }catch(error){
        done(error);
    }
});