let error_nomUtilisateur =document.getElementById('error-nomUtilisateur');
let error_courriel =document.getElementById('error-courriel');
let formAuth = document.getElementById('form-auth');
let inputNom = document.getElementById('form-nom');
let inputPrenom = document.getElementById('form-prenom');
let inputCourriel = document.getElementById('form-courriel');
let inputNomUtilisateur = document.getElementById('form-nomUtilisateur');
let inputPhone = document.getElementById('form-telephone');
let inputCarte = document.getElementById('form-carte');
let inputMotDepasse = document.getElementById('input-mot-de-passe');

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
    let response = await fetch('/inscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        window.location.replace('/connexion');
    } else if (response.status === 409) {
        let responseJson = await response.json();
        if (responseJson.includes("UNIQUE constraint failed: utilisateur.courriel")) {
            error_courriel.style.display = 'block';
            error_courriel.textContent = 'Adresse courriel déjà utilisée';
        }  
        if (responseJson.includes("UNIQUE constraint failed: utilisateur.nom_utilisateur")) {
            console.log('aaaaaaaaaaa');
            error_nomUtilisateur.style.display = 'block';
            error_nomUtilisateur.textContent = 'Nom d\'utilisateur déjà utilisé';
        }
       
    }
});