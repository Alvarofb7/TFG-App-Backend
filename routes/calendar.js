/**
 * Rutas de Usuarios / Calendar
 * host + /api/calendar
 */
const { Router } = require("express");
const { check } = require("express-validator");

const { validarJWT } = require("../middlewares/validar-jwt");
const {
	getEvents,
	createEvent,
	updateEvent,
	deleteEvent,
} = require("../controllers/calendar");
const { validarCampos } = require("../middlewares/validar-campos");
const { isDate } = require("../helpers/isDate");

const router = Router();

router.use(validarJWT);

// Obtener eventos
router.get("/", getEvents);

// Crear evento
router.post(
	"/",
	[
		check("title", "El título es obligatorio").not().isEmpty(),
		check("notes", "La nota no puede tener más de 50 caracteres").isLength({
			max: 50,
		}),
		check("start", "Fecha de inicio es obligatoria").custom(isDate),
		check("end", "Fecha de fin es obligatoria").custom(isDate),
		validarCampos,
	],
	createEvent
);

// Actualizar evento
router.put(
	"/:id",
	[
		check("title", "El título es obligatorio").not().isEmpty(),
		check("notes", "La nota no puede tener más de 100 caracteres").isLength({
			max: 100,
		}),
		check("start", "Fecha de inicio es obligatoria").custom(isDate),
		check("end", "Fecha de fin es obligatoria").custom(isDate),
		validarCampos,
	],
	updateEvent
);

// Actualizar evento
router.delete("/:id", [], deleteEvent);

module.exports = router;
