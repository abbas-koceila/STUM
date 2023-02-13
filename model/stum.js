import { promesseConnexion } from './connexion.js';

export const getUrgences = async () => {
    let connexion = await promesseConnexion;

    let resultat = await connexion.all('SELECT * FROM urgence');

    return resultat;

}