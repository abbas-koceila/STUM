
//il faut faire un boucle pour le tableaux des button retournees 
let edits = document.querySelectorAll('.edit');
for (const edit of edits) {
    edit.addEventListener('click', (event) => {
        console.log(event.currentTarget);
        window.location.replace(`/modification/${event.currentTarget.dataset.id}`)
    });
}

let deleteBtns = document.querySelectorAll('.delete')
for (const deleteBtn of deleteBtns) {
    deleteBtn.addEventListener('click', async (event) => {
        event.preventDefault();
        console.log(event.currentTarget.dataset.id)
        let data = {
            id: event.currentTarget.dataset.id
        }
        try {
            const confirmed = confirm("Êtes-vous sûr de vouloir d'annuler ce rendez-vous ?");
      if (!confirmed) {
        return; // Sortir de la fonction si l'utilisateur a annulé
      }
            let response = await fetch('/deleterdv', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                console.log('Rendez-vous deleted successfully');
                location.reload();
            } else {
                console.error('Failed to delete Rendez-vous');
            }
        } catch (error) {
            console.error(error);
        }
    });
}

