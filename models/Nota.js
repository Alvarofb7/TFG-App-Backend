const { Schema, model } = require("mongoose");

const NotaSchema = Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String
    },
    date: {
        type: Date,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "Usuario",
        required: true,
    }
});

NotaSchema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;

    return object;
});

module.exports = model("Nota", NotaSchema);