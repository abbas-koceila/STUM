import formToObject from './formToObject.js';
let formUrgence = document.getElementById('emergency_form');
let btnSubmit = document.getElementById('add-submit');
const loader = document.getElementById('loader');



// submit form 

formUrgence.addEventListener('submit', async (event) => {
  event.preventDefault();
  loader.style.display = 'block';
  let selectedInputs = Array.from(document.querySelectorAll('input[type="checkbox"]:checked, input[type="radio"]:checked'))
    .map(input => ({ [input.name]: input.value }));

  console.log(selectedInputs);


  //YOUNIS
  let data = formToObject(formUrgence);
  console.log("DATA : " + JSON.stringify(data));

  let res = await fetch('/addFormulaire', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (res.ok) {
    console.log(' form est ajoute');
    let response = await fetch('/addUrgence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(selectedInputs)
    });
  
  
    loader.style.display = 'none';
  
    if (response.status === 200) {
      console.log('l urgence est ajoute');
      alert('l urgence est ajoute avec succes');
      window.location.replace('/rdvFutur');
  
  
  
  
    } else if (response.status === 409) {
  
      console.log('non ajoute');
      window.alert('Vous avez déjà créé une demande d\'urgence. Vous ne pouvez pas en créer une autre.');
    }
    else if (response.status === 400) {
      window.alert('Vous avez déjà  une demande d\'urgence en cours');
  
    }

    
  }
  else if (res.status === 409) {
    console.log('Vous avez déjà créé un form d\'urgence. Vous ne pouvez pas en créer un autre.');
  }







 


});

