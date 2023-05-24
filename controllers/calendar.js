const { response } = require("express");
const Event = require("../models/Event");

const getEvents = async (req, resp = response) => {
	try {
		const { uid } = req;
		const events = await Event.find({ user: uid }).populate("user", "name");

		resp.status(200).json({
			ok: true,
			eventos: events,
		});
	} catch (error) {
		resp.status(500).json({
			ok: false,
			msg: "Hable con el administrador",
		});
	}
};

const createEvent = async (req, resp = response) => {
	const event = new Event(req.body);

	try {
		event.user = req.uid;

		const eventSaved = await event.save();

		resp.status(200).json({
			ok: true,
			evento: eventSaved,
		});
	} catch (error) {
		console.log(error);
		resp.status(500).json({
			ok: false,
			msg: "Hable con el administrador",
		});
	}
};

const updateEvent = async (req, resp = response) => {
	const { uid } = req;
	const eventId = req.params.id;

	try {
		const event = await Event.findById(eventId);

		if (!event) {
			return resp.status(404).json({
				ok: false,
				msg: "Evento no existe con ese id",
			});
		}

		if (event.user.toString() !== uid) {
			return resp.status(401).json({
				ok: false,
				msg: "No tiene privilegio de editar este evento",
			});
		}

		const newEvent = {
			...req.body,
			user: uid,
		};

		const eventUpdated = await Event.findByIdAndUpdate(eventId, newEvent, {
			new: true,
		});

		resp.status(200).json({
			ok: true,
			evento: eventUpdated,
		});
	} catch (error) {
		console.log(error);
		resp.status(500).json({
			ok: false,
			msg: "Hable con el administrador",
		});
	}
};

const deleteEvent = async (req, resp = response) => {
	const { uid } = req;
	const eventId = req.params.id;

	try {
		const event = await Event.findById(eventId);

		if (!event) {
			return resp.status(404).json({
				ok: false,
				msg: "No existe un evento con ese id",
			});
		}

		if (event.user.toString() !== uid) {
			return resp.status(400).json({
				ok: false,
				msg: " No tiene privilegios para eliminar este evento",
			});
		}

		await Event.findByIdAndDelete(eventId);

		resp.status(200).json({
			ok: true,
			msg: "Evento eliminado",
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
	createEvent,
	deleteEvent,
	getEvents,
	updateEvent,
};
