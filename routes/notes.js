/**
 * Rutas de Usuarios / Calendar
 * host + /api/notes
 */
const { Router } = require("express");
const { check } = require("express-validator");

const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
const { isDate } = require("../helpers/isDate");
const { getNotes, createNote, updateNote, deleteNote } = require("../controllers/notes");

const router = Router();

router.use(validarJWT);

// Obtener notas
router.get(
    "/",
    getNotes
)

// Crear nota
router.post(
    "/",
    [
        check("title", "El título es obligatorio").not().isEmpty(),
        check("description", "La nota no puede tener más de 500 caracteres").isLength({ max: 500 }),
        check("date", "La fecha es obligatorio").custom(isDate),
        validarCampos
    ],
    createNote
);

// Actualizar nota
router.put(
    "/:id",
    [
        check("title", "El título es obligatorio").not().isEmpty(),
        check("description", "La nota no puede tener más de 500 caracteres").isLength({ max: 500 }),
        check("date", "La fecha es obligatorio").custom(isDate),
        validarCampos
    ],
    updateNote
)

// Eliminar nota
router.delete(
    "/:id",
    deleteNote
)

module.exports = router;