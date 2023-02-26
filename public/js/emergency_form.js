
let formUrgence = document.getElementById('emergency_form');
let btnSubmit = document.getElementById('add-submit');



// submit form 

formUrgence.addEventListener('submit', async (event) => {
    event.preventDefault();

    let selectedInputs = Array.from(document.querySelectorAll('input[type="checkbox"]:checked, input[type="radio"]:checked'))
    .map(input => ({ [input.name]: input.value }));

     console.log(selectedInputs);


  
    let response = await fetch('/addUrgence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(selectedInputs)
  });

  if (response.ok) {
    console.log('l urgence est ajoute');
    alert('l urgence est ajoute avec succes');

  } else if (response.status === 409) {

      console.log('non ajoute');
      window.alert('Vous avez déjà créé une demande d\'urgence. Vous ne pouvez pas en créer une autre.');
  }



    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    

     var totalScore = calculScore(selectedInputs);


     console.log(totalScore);
     console.log("le niveau d'urgence est  ",calculNiveauUrgence(totalScore));




 });


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


