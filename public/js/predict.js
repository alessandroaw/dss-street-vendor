const $dateValue = document.querySelector("#input-date");
const $predictButton = document.querySelector("#predict-button");
const $forecastResult = document.querySelector("#forecast-result");
const resultTemplate = document.querySelector("#result-template").innerHTML;

console.log("loaded");
$predictButton.addEventListener("click", (event) => {
    event.preventDefault();
    while ($forecastResult.firstChild) $forecastResult.removeChild($forecastResult.firstChild);
    const value = $dateValue.value;
    console.log(`date value: ${value}`);

    const items = getItems();
    const html = Mustache.render(resultTemplate,{items});
    $forecastResult.insertAdjacentHTML("beforeend", html);
});

$(document).ready(() => {
    $('#input-date').val(new Date().toDateInputValue());
});

function getItems() {
    return [
        {itemName: "tes", quantity:"120"},
        {itemName: "tes", quantity:"120"},
        {itemName: "tes", quantity:"120"}];
}

Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});