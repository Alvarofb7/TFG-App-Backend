const { response } = require("express");
const Tarea = require("../models/Tarea");

const getTasks = async (req, resp = response) => {
	try {
		const { uid } = req;
		const tasks = await Tarea.find({ user: uid }).populate("user", "name");

		resp.status(200).json({
			ok: true,
			tasks,
		});
	} catch (error) {
		resp.status(500).json({
			ok: false,
			msg: "Hable con el administrador",
		});
	}
};

const createTask = async (req, resp = response) => {
	try {
		const task = new Tarea(req.body);
		task.user = req.uid;

		const taskSaved = await task.save();
		resp.status(200).json({
			ok: true,
			task: taskSaved,
		});
	} catch (error) {
		console.log(error);
		resp.status(500).json({
			ok: false,
			msg: "Hable con el administrador",
		});
	}
};

const updateTask = async (req, resp = response) => {
	try {
		const { uid } = req;
		const taskId = req.params.id;

		const task = await Tarea.findById(taskId);

		if (!task) {
			return resp.status(404).json({
				ok: false,
				msg: "Tarea no existe con ese id",
			});
		}

		if (task.user.toString() !== uid) {
			return resp.status(401).json({
				ok: false,
				msg: "No tiene privilegios para editar esta tarea",
			});
		}

		const newTask = {
			...req.body,
			user: uid,
		};

		const taskUpdated = await Tarea.findByIdAndUpdate(taskId, newTask, {
			new: true,
		});

		resp.status(200).json({
			ok: true,
			task: taskUpdated,
		});
	} catch (error) {
		console.log(error);
		resp.status(500).json({
			ok: false,
			msg: "Hable con el administrador",
		});
	}
};

const deleteTask = async (req, resp = response) => {
	try {
		const { uid } = req;
		const taskId = req.params.id;
		const task = await Tarea.findById(taskId);

		if (!task) {
			return resp.status(404).json({
				ok: false,
				msg: "No existe un evento con ese id",
			});
		}

		if (task.user.toString() !== uid) {
			return resp.status(400).json({
				ok: false,
				msg: " No tiene privilegios para eliminar este evento",
			});
		}

		await Tarea.findByIdAndDelete(taskId);

		resp.status(200).json({
			ok: true,
			msg: "Tarea eliminada",
		});
	} catch (error) {
		console.log(error);
		resp.status(500).json({
			ok: false,
			msg: "Hable con el administrador",
		});
	}
};

const deleteAllTasksInDone = async (req, resp = response) => {
	try {
		const { uid } = req;

		const tasksDone = await Tarea.find({ user: uid, status: "Terminado" });
		if (tasksDone.length === 0) {
			return resp.status(404).json({
				ok: false,
				msg: "No existen tareas con status 'Terminado'",
			});
		}

		tasksDone.map((task) => {
			if (task.user.toString() !== uid) {
				return resp.status(400).json({
					ok: false,
					msg: " No tiene privilegios para eliminar esta tarea",
				});
			}
		});

		await Tarea.deleteMany({ user: uid, status: "Terminado" });

		resp.status(200).json({
			ok: true,
			msg: "Notas con status 'Terminado' eliminadas",
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
	createTask,
	deleteAllTasksInDone,
	deleteTask,
	getTasks,
	updateTask,
};
