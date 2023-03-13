// calcule le score d<urgence

import { promesseConnexion } from './connexion.js';


export function calculScore(inputs) {


    return inputs.reduce((accumulator, input) => {
      return accumulator + parseInt(Object.values(input)[0]);
  }, 0);
  
  }


// calcule le niveau d<urgence
export function calculNiveauUrgence(totalScore) {
    switch (true) {
      case totalScore > 60:
        return 1;
      case totalScore > 45:
        return 2;
      case totalScore > 30:
        return 3;
      case totalScore > 15:
        return 4;
      case totalScore > 0:
        return 5;
      default:
        return 0;
    }
  }


  
  export const getUrgenceValidByIdUser = async (user_id) => {
    let connexion = await promesseConnexion;
  
    let urgence = await connexion.get(
      `SELECT * FROM urgence WHERE id_urgence = ? and etat_urgence = 1`,
      [user_id]
    );
  
    return urgence;
  };
  
  
  
  
  
  


