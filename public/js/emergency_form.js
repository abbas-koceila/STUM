
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

