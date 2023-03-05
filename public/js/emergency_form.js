import formToObject from './formToObject.js';

let formUrgence = document.getElementById('emergency_form');
let btnSubmit = document.getElementById('add-submit');



// submit form 

formUrgence.addEventListener('submit', async (event) => {
    event.preventDefault();

    let selectedInputs = Array.from(document.querySelectorAll('input[type="checkbox"]:checked, input[type="radio"]:checked'))
    .map(input => ({ [input.name]: input.value }));

     console.log(selectedInputs);
     
     let data = formToObject(formUrgence);
     console.log("DATA : "+JSON.stringify(data));

    let response = await fetch('/addUrgence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(selectedInputs)
  });

  if (response.ok) {
    console.log('l urgence est ajoute');
    let res = await fetch('/addFormulaire', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      console.log(' form est ajoute');

    } else if (res.status === 409) {

        console.log('non ajoute');
        window.alert('Vous avez déjà créé un form d\'urgence. Vous ne pouvez pas en créer un autre.');
    }
    alert('l urgence est ajoute avec succes');

  } else if (response.status === 409) {

      console.log('non ajoute');
      window.alert('Vous avez déjà créé une demande d\'urgence. Vous ne pouvez pas en créer une autre.');
  }
   

  
 
    
 });