const { response } = require("express");
const Nota = require("../models/Nota");


const getNotes = async (req, resp = response) => {

    try {
        const { uid } = req;
        const notes = await Nota.find({ user: uid })
            .sort({date: -1})
            .populate("user", "name");

        resp.status(200).json({
            ok: true,
            notes
        })
    } catch (error) {
        resp.status(500).json({
            ok: false,
            msg: "Hable con el administrador"
        })
    }

}

const createNote = async (req, resp = response) => {
    const note = new Nota(req.body);

    try {
        note.user = req.uid;

        const noteSaved = await note.save();

        resp.status(200).json({
            ok: true,
            note: noteSaved
        });

    } catch (error) {
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: "Hable con el administrador"
        });
    }
}

const updateNote = async (req, resp = response) => {

    const { uid } = req;
    const noteId = req.params.id;

    try {
        const note = await Nota.findById(noteId);

        if (!note) {
            return resp.status(404).json({
                ok: false,
                msg: "Nota no existe con ese id"
            });
        }

        if (note.user.toString() !== uid) {
            return resp.status(401).json({
                ok: false,
                msg: "No tiene privilegio de editar esta nota"
            });
        }

        const newNote = {
            ...req.body,
            user: uid
        }

        const noteUpdated = await Nota.findByIdAndUpdate(noteId, newNote, { new: true });

        resp.status(200).json({
            ok: true,
            nota: noteUpdated,
        });

    } catch (error) {
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: "Hable con el administrador"
        });
    }
}

const deleteNote = async (req, resp = response) => {

    const { uid } = req;
    const noteId = req.params.id;

    try {

        const note = await Nota.findById(noteId);

        if (!note) {
            return resp.status(404).json({
                ok: false,
                msg: "No existe un evento con ese id",
            })
        }

        if (note.user.toString() !== uid) {
            return resp.status(400).json({
                ok: false,
                msg: " No tiene privilegios para eliminar este evento",
            })
        }

        await Nota.findByIdAndDelete(noteId);

        resp.status(200).json({
            ok: true,
            msg: "Nota eliminada"
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
    createNote,
    deleteNote,
    getNotes,
    updateNote,
}