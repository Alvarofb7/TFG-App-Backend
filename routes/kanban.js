/**
 * Rutas de Usuarios / Kanban
 * host + api/kanban
 */

const { Router } = require("express");
const { check } = require("express-validator");

const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
const { isDate } = require("../helpers/isDate");
const {
	getTasks,
	createTask,
	updateTask,
	deleteTask,
	deleteAllTasksInDone,
} = require("../controllers/kanban");

const statusValues = ["To Do", "In Progress", "Done"];

const router = Router();

router.use(validarJWT);

// Obtener tareas
router.get("/", getTasks);

// Crear tarea
router.post(
	"/",
	[
		check("title", "El título es obligatorio").not().isEmpty(),
		check("status", "El estado es obligatorio").not().isEmpty(),
		check("status")
			.exists()
			.isIn(statusValues)
			.withMessage("El estado tiene que ser de un valor permitido"),
		check(
			"description",
			"La nota no puede tener más de 500 caracteres"
		).isLength({ max: 500 }),
		check("finish", "La fecha es obligatoria").custom(isDate),
		validarCampos,
	],
	createTask
);

// Actualizar tarea
router.put(
	"/:id",
	[
		check("title", "El título es obligatorio").not().isEmpty(),
		check("status", "El estado es obligatorio").not().isEmpty(),
		check("status")
			.exists()
			.isIn(statusValues)
			.withMessage("El estado tiene que ser de un valor permitido"),
		check(
			"description",
			"La nota no puede tener más de 500 caracteres"
		).isLength({ max: 500 }),
		check("finish", "La fecha es obligatoria").custom(isDate),
		validarCampos,
	],
	updateTask
);

// Eliminar tarea
router.delete("/delete/:id", deleteTask);

// Eliminar todas las tareas en done
router.delete("/deleteTasksDone", deleteAllTasksInDone);

module.exports = router;
