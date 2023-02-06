
let formUrgence = document.getElementById('emergency_form');
let btnSubmit = document.getElementById('add-submit');




function calculScore(inputs) {

    return Array.prototype.reduce.call(inputs, function (accumulator, element) {
        return accumulator + parseInt(element.value);
    }, 0);

}


console.log(formUrgence);
formUrgence.addEventListener('submit', async (event) => {
    event.preventDefault();
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    
    var selectedInputs = document.querySelectorAll('input[type="checkbox"]:checked, input[type="radio"]:checked');

     var totalScore = calculScore(selectedInputs);


     console.log("le  totalScore",totalScore);

    //  document.documentElement.setAttribute("content-security-policy", "default-src 'self'; connect-src https://www.donneesquebec.ca");
    //  async function getData() {
    //     const resource_id = 'b256f87f-40ec-4c79-bdba-a23e9c50e741';
    //     const response = await fetch(`https://www.donneesquebec.ca/recherche/api/3/action/datastore_search?resource_id=${resource_id}&limit=2`);
       
    //     if(response.ok){
    //         console.log("ikchemmm");
    //         const data = await response.json();
    //         console.log(data);
    //        console.log(JSON.stringify(data));
    //     }else{
    //         console.log(response.statusText);
    //     }
    // }
  
    getData();

    //  window.location.replace('/rdvFutur'); 

 });

