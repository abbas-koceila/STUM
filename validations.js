//validation du nom
const validateNom = (nom) => {
    return typeof nom === 'string' && !!nom;
}



//validation de la capacite pour que elle soit <=50   et > 0
const validateCapacity = (capacite) => {
  
        return typeof capacite === 'number' &&
        capacite > 0 &&
        capacite <= 50;
    
}


//validation de la date pour que le champ de saisie ne soit pas vide
const validateDate = (date_debut) => {
   if (date_debut.validity.valueMissing){
    return false;
   }
    
    else 
    {
    return true;}

 }





 //validation de la description pour que elle soit <=2000 carc  et >=10

 const validateDescription = (Description) => {

    return typeof Description === 'string' &&

           !!Description &&

           Description.length >= 10 &&

           Description.length <= 2000;

}

// fonction qui retourne un boolean de toutes les validation

export const validateForm = (body) => {

    return validateNom(body.nom) &&

    validateCapacity(body.capacite) &&

    validateDate(body.date_debut) &&

        validateDescription(body.description);

}