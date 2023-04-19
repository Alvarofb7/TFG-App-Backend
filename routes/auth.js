/**
 * Rutas de Usuarios / Auth
 * host + /api/auth
 */

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { crearUsuario, loginUsuario, revalidarToken } = require("../controllers/auth");
const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();

// Crear usuario
router.post(
    "/new",
    [ //* Middlewares
        check("name", "El nombre es obligatorio").not().isEmpty(),
        check("email", "El email es obligatorio").isEmail(),
        check("password", "La contraseña debe de ser de tener entre 6 y 20 caracteres").isLength({ min: 6, max: 20 }),
        check('password', 'La contraseña debe contener al menos una letra mayúscula')
            .matches(/[A-Z]/),
        check('password', 'La contraseña debe contener al menos una letra minúscula')
            .matches(/[a-z]/),
        check('password', 'La contraseña debe contener al menos un número')
            .matches(/[0-9]/),
        check('password', 'La contraseña debe contener al menos un caracter especial ($!%*?-_&)')
            .matches(/[$!%*?-_&]/),
        validarCampos
    ],
    crearUsuario
);


// Login
router.post(
    "/",
    [ //* Middlewares
        check("email", "El email es obligatorio").isEmail(),
        check("password", "La contraseña debe de ser de 6 caracteres").isLength({ min: 6 }),
        validarCampos
    ],
    loginUsuario
);

// Renovar token
router.get(
    "/renew",
    validarJWT, //* Middleware
    revalidarToken
);

module.exports = router;