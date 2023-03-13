const annulerRdvButtons = document.querySelectorAll('.rdvfutur');

annulerRdvButtons.forEach(button => {
  button.addEventListener('click', async () => {

    console.log("akhirrclick annuler");
    try {
      const response = await fetch('/deleterdv', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: button.dataset.id
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
  });
});
