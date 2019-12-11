const $dateValue = document.querySelector("#input-date");
const $predictButton = document.querySelector("#predict-button");
const $forecastResult = document.querySelector("#forecast-result");
const resultTemplate = document.querySelector("#result-template").innerHTML;

let items;

console.log("loaded");
$predictButton.addEventListener("click", (event) => {
    event.preventDefault();
    while ($forecastResult.firstChild) $forecastResult.removeChild($forecastResult.firstChild);

    const value = $dateValue.value;
    console.log(`date value: ${value}`);
    items = getItems();
    const html = Mustache.render(resultTemplate,{});
    $forecastResult.insertAdjacentHTML("beforeend", html);
});

$(document).ready(() => {
    $('#input-date').val(new Date().toDateInputValue());
});

function getItems() {
    return [
        {'foodName': 'Bakso Goreng',
            'ingredients': [
                {'ingredientName': 'Daging', 'quantity': 5830, 'metric': 'gram'},
                {'ingredientName': 'Bawang', 'quantity': 5830, 'metric': 'gram'}]},
        {'foodName': 'Mie Ayam',
            'ingredients': [
                {'ingredientName': 'Mie', 'quantity': 34200, 'metric': 'gram'},
                {'ingredientName': 'Kuah', 'quantity': 3420, 'metric': 'liter'}]},
        {'foodName': 'Bakso Keju',
            'ingredients': [
                {'ingredientName': 'Daging', 'quantity': 3290, 'metric': 'gram'},
                {'ingredientName': 'Keju', 'quantity': 3290, 'metric': 'gram'}]
        }];
}

Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});