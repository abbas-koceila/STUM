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


     console.log(totalScore);

     window.location.replace('/rdvFutur'); 

 });

