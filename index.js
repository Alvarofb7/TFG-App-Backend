const express = require("express");
require("dotenv").config();

// Crear el servidor de express
const app = express();


// Escuchar el puerto
app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`)
}) 