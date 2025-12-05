const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = 3000;

// URL OBJETIVO: Usaremos x-rates para buscar Libra Esterlina (GBP) a Peso Mexicano (MXN)
// Requerimiento 1 y 2: Investigar sitio y analizar estructura
const URL_COTIZACION = 'https://www.x-rates.com/calculator/?from=GBP&to=MXN&amount=1';

// Función auxiliar para hacer el Scraping
async function obtenerCotizacionOriginal() {
    try {
        // 1. Descargar el HTML de la página
        const { data } = await axios.get(URL_COTIZACION);
        
        // 2. Cargar el HTML en Cheerio para poder leerlo
        const $ = cheerio.load(data);

        // 3. Extraer el texto del precio.
        // NOTA: Inspeccioné la página y la clase que tiene el precio es "ccOutputRslt"
        let precioTexto = $('.ccOutputRslt').text(); // Ejemplo: "22.50 MXN"
        
        // Limpiamos el texto para que quede solo el número (quitamos " MXN")
        let precioNumero = parseFloat(precioTexto.replace(' MXN', ''));

        return precioNumero;
    } catch (error) {
        console.error("Error haciendo scraping:", error);
        return null;
    }
}

// Requerimiento 4: Servicio para recuperar valor de COMPRA
// Requerimiento 3: Alterar a la baja (Menos 10% para que el usuario compre)
app.get('/api/compra', async (req, res) => {
    const precioReal = await obtenerCotizacionOriginal();
    
    if (precioReal) {
        // "Menos el 10% para que un usuario pueda comprar"
        const precioCompra = precioReal * 0.90; 
        
        res.json({
            moneda: "Libra Esterlina (GBP)",
            accion: "Compra",
            precio_mercado: precioReal,
            precio_mejorado_cliente: precioCompra.toFixed(2),
            mensaje: "¡Aprovecha! 10% más barato que el mercado."
        });
    } else {
        res.status(500).send("Error obteniendo la cotización");
    }
});

// Requerimiento 4: Servicio para recuperar valor de VENTA
// Requerimiento 3: Alterar al alza (Más 10% para que el usuario venda)
app.get('/api/venta', async (req, res) => {
    const precioReal = await obtenerCotizacionOriginal();
    
    if (precioReal) {
        // "Un 10% más para que el usuario pueda vender"
        const precioVenta = precioReal * 1.10;
        
        res.json({
            moneda: "Libra Esterlina (GBP)",
            accion: "Venta",
            precio_mercado: precioReal,
            precio_mejorado_cliente: precioVenta.toFixed(2),
            mensaje: "¡Te pagamos más! 10% por encima del mercado."
        });
    } else {
        res.status(500).send("Error obteniendo la cotización");
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor de cotizaciones corriendo en http://localhost:${PORT}`);
    console.log(`Prueba Compra: http://localhost:${PORT}/api/compra`);
    console.log(`Prueba Venta:  http://localhost:${PORT}/api/venta`);
});