import formToObject from './formToObject.js';
let formInfo = document.getElementById('changeInfo_form');




// submit form 

formInfo.addEventListener('submit', async (event) => {
    event.preventDefault();
    let data = formToObject(formInfo);
    console.log(data)
    let res = await fetch('/changeInfo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (res.ok) {
        console.log(' vos informations sont changés avec succes');
    }
    else if (res.status === 409) {
        console.log('erreur de conflict ');
        document.getElementById("email").style.borderColor = "red";
        document.getElementById("error-email").innerHTML = "Cette adresse e-mail existe déjà dans notre base de données.";
    }
});

