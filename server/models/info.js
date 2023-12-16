const { Schema, model } = require('mongoose');

const schema = new Schema({
    manufacturer: {
        type: String,
        required: true,
        trim: true,
    },
    model: {
        type: String,
        required: true,
        trim: true,
    },
    startDateTime: {
        type: Date,
        required: true,
    },
    endDateTime: {
        type: Date,
        required: true,
    },
    carrier: {
        type: String,
        required: true,
        trim: true,
    },
    grade: {
        type: String,
        required: true,
        trim: true,
    },
    startAmount: {
        type: Number,
        required: true,
    },
    memory: {
        type: String,
        required: true,
        trim: true,
    },
    color: {
        type: String,
        required: true,
        trim: true,
    },
    units: {
        type: Number,
        required: true,
    },
    minIncrement: {
        type: Number,
        required: true,
    },
    reportFile: {
        type: String,
        required: true,
        trim: true,
    }
})

schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

const Info = model("info", schema);

exports.Info = Info;