/**
 * Rutas de Usuarios / Calendar
 * host + /api/calendar
 */
const { Router } = require("express");
const { check } = require("express-validator");

const { validarJWT } = require("../middlewares/validar-jwt");
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require("../controllers/calendar");
const { validarCampos } = require("../middlewares/validar-campos");
const { isDate } = require("../helpers/isDate");

const router = Router();

router.use(validarJWT);

// Obtener eventos
router.get(
    "/",
    getEventos
);

// Crear evento
router.post(
    "/",
    [
        check("title", "El título es obligatorio").not().isEmpty(),
        check("start", "Fecha de inicio es obligatoria").custom(isDate),
        check("end", "Fecha de fin es obligatoria").custom(isDate),
        validarCampos
    ],
    crearEvento
);

// Actualizar evento
router.put(
    "/:id",
    [
        check("title", "El título es obligatorio").not().isEmpty(),
        check("start", "Fecha de inicio es obligatoria").custom(isDate),
        check("end", "Fecha de fin es obligatoria").custom(isDate),
        validarCampos
    ],
    actualizarEvento
);

// Actualizar evento
router.delete(
    "/:id",
    [

    ],
    eliminarEvento
);

module.exports = router;