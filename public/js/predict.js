const $dateValue = document.querySelector("#input-date");
const $predictButton = document.querySelector("#predict-button");
const $forecastResult = document.querySelector("#forecast-result");
const $resultTemplate = document.querySelector("#result-template");

console.log("loaded");
$predictButton.addEventListener("click", (event) => {
    event.preventDefault();
    while ($forecastResult.firstChild) $forecastResult.removeChild($forecastResult.firstChild);

    const value = $dateValue.value;
    // if (!value) {
    //     alert("input tidak boleh kosong");
    //     return;
    // }

    console.log(`date value: ${value}`);
    const html = Mustache.render($resultTemplate.innerHTML,{});
    $forecastResult.insertAdjacentHTML("beforeend", html);
});