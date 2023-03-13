/**
 * Convertit les éléments d'un formulaire HTML en object.
 * @param {HTMLFormElement} form Le formulaire à convertir en objet.
 */
export default function formToObject(form) {
    // Object qui va contenir tous les champs du formulaire
    let data = {};

    for(let element of form) {
        if(!element.name){
            // Si l'élément n'a pas de nom, on l'ignore
            continue;
        }
        else if(element.type === 'radio' && !element.checked){
            // Si l'élément est un radio button qui n'est pas coché, on 
            // l'ignore
            continue;
        }
        else if(element.type === 'checkbox' && element.value === 'on'){
            // Si l'élément est un checkbox qui ne fait pas parti d'un 
            // groupe, on l'ajoute comme un booléen
            data[element.name] = element.checked;
        }
        else if(element.type === 'checkbox' && element.value !== 'on'){
            // Si l'élément est un checkbox qui fait parti d'un groupe, 
            // on l'ajoute comme un tableau de valeurs
            if(!data[element.name]){
                data[element.name] = [];
            }

            if(element.checked){
                data[element.name].push(element.value);
            }
        }
        else if(element.options && element.multiple){
            // Si l'élément est un select qui accepte plusieurs valeurs, 
            // on l'ajoute comme un tableau de valeurs
            data[element.name] = [];
            for(let option of element){
                if(option.selected){
                    data[element.name].push(option.value);
                }
            }
        }
        else{
            // Si l'élément est un input, un select à valeur unique ou un 
            // textarea avec un nom, on l'ajoute comme une string
            data[element.name] = element.value;
        }
    }

    return data;
}
