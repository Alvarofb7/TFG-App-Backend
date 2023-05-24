const { response } = require("express");
const Note = require("../models/Note");

const getNotes = async (req, resp = response) => {
	try {
		const { uid } = req;
		const notes = await Note.find({ user: uid })
			.sort({ date: -1 })
			.populate("user", "name");

		resp.status(200).json({
			ok: true,
			notes,
		});
	} catch (error) {
		resp.status(500).json({
			ok: false,
			msg: "Hable con el administrador",
		});
	}
};

const createNote = async (req, resp = response) => {
	try {
		const note = new Note(req.body);
		note.user = req.uid;

		const noteSaved = await note.save();

		resp.status(200).json({
			ok: true,
			note: noteSaved,
		});
	} catch (error) {
		console.log(error);
		resp.status(500).json({
			ok: false,
			msg: "Hable con el administrador",
		});
	}
};

const updateNote = async (req, resp = response) => {
	try {
		const { uid } = req;
		const noteId = req.params.id;
		const note = await Note.findById(noteId);

		if (!note) {
			return resp.status(404).json({
				ok: false,
				msg: "Nota no existe con ese id",
			});
		}

		if (note.user.toString() !== uid) {
			return resp.status(401).json({
				ok: false,
				msg: "No tiene privilegio de editar esta nota",
			});
		}

		const newNote = {
			...req.body,
			user: uid,
		};

		const noteUpdated = await Note.findByIdAndUpdate(noteId, newNote, {
			new: true,
		});

		resp.status(200).json({
			ok: true,
			nota: noteUpdated,
		});
	} catch (error) {
		console.log(error);
		resp.status(500).json({
			ok: false,
			msg: "Hable con el administrador",
		});
	}
};

const deleteNote = async (req, resp = response) => {
	try {
		const { uid } = req;
		const noteId = req.params.id;
		const note = await Note.findById(noteId);

		if (!note) {
			return resp.status(404).json({
				ok: false,
				msg: "No existe una nota con ese id",
			});
		}

		if (note.user.toString() !== uid) {
			return resp.status(400).json({
				ok: false,
				msg: " No tiene privilegios para eliminar esta nota",
			});
		}

		await Note.findByIdAndDelete(noteId);

		resp.status(200).json({
			ok: true,
			msg: "Nota eliminada",
		});
	} catch (error) {
		console.log(error);
		resp.status(500).json({
			ok: false,
			msg: "Hable con el administrador",
		});
	}
};

module.exports = {
	createNote,
	deleteNote,
	getNotes,
	updateNote,
};
