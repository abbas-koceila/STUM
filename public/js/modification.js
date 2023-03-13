// Get the value of douleur_present from your data source
const douleur_present =document.querySelector('.douleur_prensent_class').dataset.id;
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
const douleur8jours =document.querySelector('.douleur8jours_class').dataset.id;
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
const douleur_intense =document.querySelector('.douleur_intense_class').dataset.id;
// Get all the radio buttons in the form
const radioButtons_douleur_intense = document.getElementsByName('douleur_intense');
