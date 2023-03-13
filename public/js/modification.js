import formToObject from "./formToObject.js";
const loader = document.getElementById('loader');

let formUrgence = document.getElementById('form-hike');

// Get the value of douleur_present from your data source
const douleur_present = document.querySelector('.douleur_prensent_class').dataset.id;
console.log(douleur_present)
// Get all the radio buttons in the form
const radioButtons_douleur_present = document.getElementsByName('douleur_present');

// Loop through the radio buttons to find the one that matches the value of douleur_present
for (let i = 0; i < radioButtons_douleur_present.length; i++) {
  if (radioButtons_douleur_present[i].value == douleur_present) {
    // Set the checked property of the matching radio button to true
    radioButtons_douleur_present[i].checked = true;
    break;
  }
}


// Get the value of douleur_present from your data source
const douleur8jours = document.querySelector('.douleur8jours_class').dataset.id;
// Get all the radio buttons in the form
const radioButtons_douleur8jours = document.getElementsByName('douleur8jours');

// Loop through the radio buttons to find the one that matches the value of douleur_present
for (let i = 0; i < radioButtons_douleur8jours.length; i++) {
  if (radioButtons_douleur8jours[i].value == douleur8jours) {
    // Set the checked property of the matching radio button to true
    radioButtons_douleur8jours[i].checked = true;
    break;
  }
}


// Get the value of douleur_present from your data source
const douleur_intense = document.querySelector('.douleur_intense_class').dataset.id;
// Get all the radio buttons in the form
const radioButtons_douleur_intense = document.getElementsByName('douleur_intense');

// Loop through the radio buttons to find the one that matches the value of douleur_present
for (let i = 0; i < radioButtons_douleur_intense.length; i++) {
  if (radioButtons_douleur_intense[i].value == douleur_intense) {
    // Set the checked property of the matching radio button to true
    radioButtons_douleur_intense[i].checked = true;
    break;
  }
}



formUrgence.addEventListener('submit', async (event) => {
  event.preventDefault();

  let data = {
    id: document.querySelector('.id_urgence_class').dataset.id
  }
  try {
    let response = await fetch('/deleterdv', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (response.ok) {
      console.log('Rendez-vous deleted successfully');


      //add urgence 
      loader.style.display = 'block';
      let selectedInputs = Array.from(document.querySelectorAll('input[type="checkbox"]:checked, input[type="radio"]:checked'))
        .map(input => ({ [input.name]: input.value }));

      console.log(selectedInputs);

      // recupere lid de l'utilisateur de formulaire et le mettre dans la premiere place de tableau DATA
      selectedInputs.unshift(document.querySelector('.id_user_class').dataset)

      //   //YOUNIS
      let data = formToObject(formUrgence);
      data.id=(document.querySelector('.id_user_class').dataset)
      console.log(data.id)
      console.log("DATA : " + JSON.stringify(data));


      let response = await fetch('/addUrgence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedInputs)
      });


      loader.style.display = 'none';

      if (response.status === 200) {
        console.log('l urgence est ajoute');
        alert('l urgence est ajoute avec succes');
        let res = await fetch('/addFormulaire', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        if (res.ok) {
          console.log(' form est ajoute');
          //window.location.replace('/rdvFutur');
        }
        else if (res.status === 409) {
          console.log('Vous avez déjà créé un form d\'urgence. Vous ne pouvez pas en créer un autre.');
        }

      } else if (response.status === 409) {

        console.log('non ajoute');
        window.alert('Vous avez déjà créé une demande d\'urgence. Vous ne pouvez pas en créer une autre.');
      }
      else if (response.status === 400) {
        window.alert('Vous avez déjà  une demande d\'urgence en cours');

      }




    } else {
      console.error('Failed to delete Rendez-vous');
    }
  } catch (error) {
    console.log('erreur');
    console.error(error);
  }
});