const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const {validationResult} = require('express-validator');

// Crea una nueva tarea
exports.crearTarea = async (req, res) => {

    // Revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()})
    }

    try{
        // extraer el proyecto y comprobar si existe
        const {proyecto} = req.body;

        const existeProyecto = await Proyecto.findById(proyecto);
        if(!existeProyecto){
            return res.status(404).json({msg: 'Proyecto no encontrado'});
        }

        // Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'No autorizado'});
        }

        // Crear una tarea nueva
        const tarea = new Tarea(req.body);

        // Guardar tarea
        tarea.save();
        res.json({tarea});

    } catch (error){
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

// Obtiene todas las tareas por proyecto
exports.obtenerTareas = async (req, res) => {
    try {
        // extraer el proyecto y comprobar si existe
        const {proyecto} = req.query;

        const existeProyecto = await Proyecto.findById(proyecto);
        if(!existeProyecto){
            return res.status(404).json({msg: 'Proyecto no encontrado'});
        }

        // Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'No autorizado'});
        }

        // Obtener las tareas por proyecto
        const tareas = await Tarea.find({proyecto}).sort({creado: -1});
        res.json({tareas});
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

// Actualiza una tarea
exports.actualizarTarea = async(req, res) => {
    try {
        // Revisar si hay errores
        const errores = validationResult(req);

        // extraer la información de la tarea
        const {proyecto, nombre, estado} = req.body;
        const nuevaTarea = {};

        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;

        if(!errores.isEmpty()){
            return res.status(400).json({errores: errores.array()})
        }

        const existeTarea = await Tarea.findById(req.params.id);
        if(!existeTarea){
            return res.status(404).json({msg: 'Tarea no existe'});
        }

        const existeProyecto = await Proyecto.findById(proyecto);
        if(!existeProyecto){
            return res.status(404).json({msg: 'Proyecto no encontrado'});
        }

        // Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'No autorizado'});
        }

        // Actualizar
        tarea = await Tarea.findByIdAndUpdate({ _id: req.params.id}, {$set: nuevaTarea}, {new: true});

        res.json({tarea});

    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
}

// Elimina una tarea
exports.eliminarTarea = async (req, res) => {
    try {
        // Extrar el proyecto y comprobar si existe
        const {proyecto} = req.query;

        let tarea = await Tarea.findById(req.params.id);

        // Si la tarea existe o no
        if (!tarea) {
            return res.status(404).json({msg: 'Tarea no encontrada'});
        }

        // extraer proyecto
        const existeProyecto = await Proyecto.findById(proyecto);

        // Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'No autorizado'});
        }

        const existeTarea = await Tarea.findById(req.params.id);
        if(!existeTarea){
            return res.status(404).json({msg: 'Tarea no existe'});
        }

        // Eliminar
        tarea = await Tarea.findOneAndRemove({ _id: req.params.id});

        res.json({msg: 'Tarea eliminada'});

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}