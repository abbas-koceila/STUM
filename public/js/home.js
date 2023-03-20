fetch('https://www.donneesquebec.ca/recherche/api/3/action/datastore_search_sql?sql=SELECT * from "b256f87f-40ec-4c79-bdba-a23e9c50e741" WHERE _id =73')
  .then(response => response.json())
  .then(data => {
    // Récupérer les champs que vous voulez afficher
    const record = data.result.records[0];

    // Créer un élément HTML
    const div = document.createElement('div');

    // Ajouter chaque champ à l'élément
    div.innerHTML = `
    <h2>Nombre total de patients présents à l'urgence: ${record['Nombre_total_de_patients_presents_a_lurgence']}</h2>
      <div>Nombre total de patients en attente de PEC: ${record['Nombre_total_de_patients_en_attente_de_PEC']}</div>
      
      <div>Nombre de civieres fonctionnelles: ${record['Nombre_de_civieres_fonctionnelles']}</div>
      <div>Nombre de civieres occupées: ${record['Nombre_de_civieres_occupees']}</div>
     
      <div>Mise à jour: ${record['Mise_a_jour']}</div>
 
                
      <h5> source : <a href="https://www.donneesquebec.ca/">donneesquebec.ca</a></h5>
    `;
    if (document.getElementById('data')) {
      document.getElementById('data').appendChild(div);
    }
  });


  // fetch("https://www.donneesquebec.ca/recherche/api/3/action/datastore_search_sql?sql=SELECT%20*%20from%20%22b256f87f-40ec-4c79-bdba-a23e9c50e741%22%20WHERE%20_id%20%3D73")
  // .then(response => response.json())
  // .then(data => console.log(data));

