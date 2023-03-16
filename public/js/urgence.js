const annulerRdvButtons = document.querySelectorAll('.rdvfutur');

//confirm button script 
const confirmModal = document.querySelector('.confirm-modal');
const confirmButton = document.querySelector('#confirm-button');
const cancelButton = document.querySelector('#cancel-button');

annulerRdvButtons.forEach(button => {
  button.addEventListener('click', () => {
  
    confirmModal.style.display = 'flex';
    confirmButton.dataset.id = button.dataset.id;

    console.log('waggiii id urgence confirm button',  confirmButton.dataset.id);
  });
});


confirmButton.addEventListener('click', async () => {
  console.log("akhirrclick annuler");
  try {
    const response = await fetch('/deleterdv', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: confirmButton.dataset.id
      })
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
  confirmModal.style.display = 'none';
});

cancelButton.addEventListener('click', () => {
  confirmModal.style.display = 'none';
});
