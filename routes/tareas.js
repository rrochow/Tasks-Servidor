const express = require('express');
const router = express.Router();
const tareaController = require('../controllers/tareaController');
const auth = require('../middleware/auth');
const {check} = require('express-validator');

//Crear un Tareas
// api/tareas
router.post('/',
    auth,
    [
        check('nombre', 'El Nombre de la tarea es obligatorio').not().isEmpty(),
        check('proyecto', 'El Proyecto de la tarea es obligatorio').not().isEmpty()
    ],
    tareaController.crearTarea
);

// Obtener todos las tareas pro proyecto
router.get('/',
    auth,
    tareaController.obtenerTareas
)  

// Actualizar el nombre de una tarea
router.put('/:id',
    auth,
    [
        check('proyecto', 'El Proyecto de la tarea es obligatorio').not().isEmpty()
    ],
    tareaController.actualizarTarea
)

// Eliminar una Tarea
router.delete('/:id',
    auth,
    tareaController.eliminarTarea
)

module.exports = router;