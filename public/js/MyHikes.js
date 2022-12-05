let cardButtons = document.querySelectorAll('#liste-card button');

// Fonction qui supprime la carte lorsque l'utilisateur se desincrit d'un hike
const deleteHikeClient = (id) => {

    let divDel = document.getElementById(id);
    
    divDel.remove();
}

// Fonction qui desinscrit l'utilisateur d'un hike et fait appel a la fonction deleteHikeClient pour supprimer la carte hike
const myHikeDesinscrireServeur = async (event) => {
    event.preventDefault();
    let data = {
        id: event.currentTarget.id
    }
    deleteHikeClient(data.id);
   
    await fetch('/', {

        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    //window.location.reload();
}

// Creation des eventlistener pour les bouttons de chaque carte hike
for (let supButton of cardButtons) {
    
            supButton.addEventListener('click', myHikeDesinscrireServeur);
        supButton.addEventListener('click',()=>{
           
       // supButton.innerHTML = 'Inscrire';
        //supButton.className = 'btn btn-primary btn-lg btn-block';
       
        });
        
       
    }
