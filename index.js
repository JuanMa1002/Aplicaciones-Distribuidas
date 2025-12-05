const axios = require("axios");
const cheerio = require("cheerio");

async function obtenerLibra() {
    const url = "https://www.x-rates.com/calculator/?from=GBP&to=MXN&amount=1";

    try {
        const response = await axios.get(url);
        const html = response.data;

        // Cargar HTML
        const $ = cheerio.load(html);

        // Buscar el elemento donde aparece la cotización
        const resultado = $("span.ccOutputRslt").text().trim();

        console.log("HTML descargado correctamente.\n");
        console.log("Cotización encontrada en el HTML:");
        console.log(resultado);

    } catch (error) {
        console.error("Error descargando la página:", error);
    }
}

obtenerLibra();
