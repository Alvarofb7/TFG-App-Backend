const { response } = require("express");
const Evento = require("../models/Evento");


const getEventos = async (req, resp = response) => {


    try {
        const { uid } = req;
        const eventos = await Evento.find({ user: uid })
            .populate("user", "name");

        resp.status(200).json({
            ok: true,
            eventos
        })
    } catch (error) {
        resp.status(500).json({
            ok: false,
            msg: "Hable con el administrador"
        })
    }

}


const crearEvento = async (req, resp = response) => {

    const evento = new Evento(req.body);

    try {
        evento.user = req.uid;

        const eventoGuardado = await evento.save();

        resp.status(200).json({
            ok: true,
            evento: eventoGuardado
        });

    } catch (error) {
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: "Hable con el administrador"
        });
    }

}


const actualizarEvento = async (req, resp = response) => {

    const { uid } = req;
    const eventoId = req.params.id;

    try {

        const evento = await Evento.findById(eventoId);

        if (!evento) {
            return resp.status(404).json({
                ok: false,
                msg: "Evento no existe con ese id"
            });
        }

        if (evento.user.toString() !== uid) {
            return resp.status(401).json({
                ok: false,
                msg: "No tiene privilegio de editar este evento"
            });
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, { new: true });

        resp.status(200).json({
            ok: true,
            evento: eventoActualizado,
        });

    } catch (error) {
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: "Hable con el administrador"
        });
    }


}


const eliminarEvento = async (req, resp = response) => {

    const { uid } = req;
    const eventoId = req.params.id;

    try {

        const evento = await Evento.findById(eventoId);

        if (!evento) {
            return resp.status(404).json({
                ok: false,
                msg: "No existe un evento con ese id",
            })
        }

        if (evento.user.toString() !== uid) {
            return resp.status(400).json({
                ok: false,
                msg: " No tiene privilegios para eliminar este evento",
            })
        }

        await Evento.findByIdAndDelete(eventoId);

        resp.status(200).json({
            ok: true,
            msg: "Evento eliminado"
        })

    } catch (error) {
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: "Hable con el administrador"
        })
    }

}



module.exports = {
    actualizarEvento,
    crearEvento,
    eliminarEvento,
    getEventos,
}