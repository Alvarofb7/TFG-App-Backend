const { Schema, model } = require("mongoose");

const TaskSchema = Schema({
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
	},
	status: {
		type: String,
		required: true,
	},
	finish: {
		type: Date,
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
});

TaskSchema.method("toJSON", function () {
	const { __v, _id, ...object } = this.toObject();
	object.id = _id;

	return object;
});

module.exports = model("Task", TaskSchema);
