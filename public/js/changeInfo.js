
let formAuth = document.getElementById('form-auth');
let inputNom = document.getElementById('form-nom');
let inputPrenom = document.getElementById('form-prenom');
let inputCourriel = document.getElementById('form-courriel');
let inputPhone = document.getElementById('form-tel');
let inputCarte = document.getElementById('form-carte');

formAuth.addEventListener('submit', async (event) => {
    
    event.preventDefault();
    let data = {
        nomUtilisateur: inputNomUtilisateur.value,
        motDePasse: inputMotDepasse.value,
        courriel: inputCourriel.value,
        nom: inputNom.value,
        prenom: inputPrenom.value,
        numeroCarteSante: inputCarte.value,
        numeroTel: inputPhone.value

        // ajouter phone carte adresse 
    }
    let response = await fetch('/changeInfo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        window.location.replace('/');
    } else if (response.status === 409) {
        
    }
});