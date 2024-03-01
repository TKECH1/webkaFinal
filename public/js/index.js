const dropdown = document.getElementById("lang-select");

dropdown.addEventListener("change", function() {

    document.getElementById("lang-form-container").submit();
});