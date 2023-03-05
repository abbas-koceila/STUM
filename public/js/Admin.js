//il faut faire un boucle pour le tableaux des button retournees 
let edits = document.querySelectorAll('.edit');
for (const edit of edits) {
    edit.addEventListener('click',(event)=>{
        console.log(event.currentTarget);       
            window.location.replace(`/modification/${event.currentTarget.dataset.id}`)
    })
}

