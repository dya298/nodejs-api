const createHttpError = require("http-errors");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create model notes schema
const NotesSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  },
  time: {
    type: Date,
    default: Date.now()
  }
});

// init collection notes
const Notes = mongoose.model("notes", NotesSchema);

// Create a new note
const InsertApp = async (data) => {
  try {
    const Note = new Notes();
    const NoteSaveIntoMongoDB = await Note.save(data);
    return NoteSaveIntoMongoDB;
  } catch (error) {
    throw createHttpError.BadRequest(error.message);
  }
};

exports.InsertApp = InsertApp;
exports.Notes = Notes;
