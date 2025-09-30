function cambioColor() {
    // Toggle clases principales
    document.querySelector("#header-content").classList.toggle("dark-mode-title");
    document.querySelector("#main-content").classList.toggle("dark-mode-main");
    document.querySelectorAll(".card").forEach(v => v.classList.toggle("card-dark-mode"));
    document.querySelectorAll("#button-ej1").forEach(v => v.classList.toggle("btn-dark-mode"));

    // Toggle para los algoritmos si existen
    if (document.querySelector("#config-content")) {
        document.querySelector("#config-content").classList.toggle("dark-mode-config");
        document.querySelector("#description-content").classList.toggle("text-content-dark-mode");
        document.querySelector("#graphic-content").classList.toggle("text-content-dark-mode");
        document.querySelector("#buttons-content").classList.toggle("text-content-dark-mode");
        document.querySelector(".init-content").classList.toggle("text-content-dark-mode");
        document.querySelector(".input-content").classList.toggle("text-content-dark-mode");
    }

    if (document.querySelector("#results-panel")) {
        document.querySelector("#results-panel").classList.toggle("dark-mode-table");
        document.querySelectorAll("#panels-graphics > div").forEach(v => v.classList.toggle("dark-mode-gray"));
    }

    // Guardar estado en sessionStorage
    const isDark = document.querySelector("#header-content").classList.contains("dark-mode-title");
    sessionStorage.setItem("darkMode", isDark ? "true" : "false");
}

// Al cargar la página, aplicamos el dark mode si estaba activado
window.addEventListener("DOMContentLoaded", () => {
    if (sessionStorage.getItem("darkMode") === "true") {
        cambioColor(); // Aplica toggle según el estado guardado
    }
});