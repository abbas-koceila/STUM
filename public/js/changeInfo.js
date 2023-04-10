import formToObject from './formToObject.js';
let formInfo = document.getElementById('changeInfo_form');


//confirm button script 
const confirmModal = document.querySelector('.confirm-modal');
const confirmButton = document.querySelector('#confirm-button');
const cancelButton = document.querySelector('#cancel-button');

formInfo.addEventListener('submit', async (event) => {
    event.preventDefault();
    
      confirmModal.style.display = 'flex';
      confirmButton.dataset.id = button.dataset.id;
  
      
    });

// submit form 
confirmButton.addEventListener('click', async () => {;
    let data = formToObject(formInfo);
    console.log(data)
    let response = await fetch('/changeInfo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (response.ok) {
        location.reload();
    }
    else if (response.status === 409) {
        console.log('erreur de conflict ');
        document.getElementById("email").style.borderColor = "red";
        document.getElementById("error-email").innerHTML = "Cette adresse e-mail existe déjà dans notre base de données.";
    }
    
});

