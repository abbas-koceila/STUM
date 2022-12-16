//import { getTypeAcces } from "../../model/utilisateur";
let formAuth = document.getElementById('form-connexion');
let inputNomUtilisateur = document.getElementById('input-nom-utilisateur');
let inputMotDepasse = document.getElementById('input-mot-de-passe');
let incorrectPasswordDiv = document.getElementById('password-message');
let incorrectUsernameDiv = document.getElementById('username-message');

const MotDePasseInvalide = () => {
    let p = document.createElement('p');
    p.classList.add('incorrect');
    p.innerText = "Le mot de passe est invalide";

    incorrectPasswordDiv.append(p);
}

const UsernameInvalide = () => {
    let p = document.createElement('p');
    p.classList.add('incorrect');
    p.innerText = "Le nom d'utilisateur est invalide";

    incorrectUsernameDiv.append(p);
}
console.log("hello");
formAuth.addEventListener('submit', async (event) => {
    console.log("connected");
    event.preventDefault();
    let data = {
        nomUtilisateur: inputNomUtilisateur.value,
        motDePasse: inputMotDepasse.value
    }
    let response = await fetch('/connexion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (response.ok) {
        window.location.replace('/'); 

    
      
    } 
    else if (response.status === 401) {
        ///afficher erreur dans linterface graphic et suprimer le console.log
        let info = await response.json();

        if (info.erreur === 'erreur_nom_utilisateur') {
            incorrectUsernameDiv.innerHTML = '';
            incorrectPasswordDiv.innerHTML = '';
            UsernameInvalide();
        }
        else if (info.erreur === 'erreur_mot_de_passe') {
            incorrectUsernameDiv.innerHTML = '';
            incorrectPasswordDiv.innerHTML = '';
            MotDePasseInvalide();
        }
    }
});