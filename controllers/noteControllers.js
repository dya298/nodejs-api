// Get Data Models
const Note = require("../../nodejs-api/Models/Notes/notesModel");
// Get all notes
exports.getNotes = async () => {
  try {
    const notes = await Note.find();
    return notes;
  } catch (err) {
    console.log(err);
  }
};

// Get single note by ID
exports.getSingleNote = async req => {
  try {
    const id = req.params === undefined ? req.id : req.params.id;
    const note = await Note.findById(id);
    return note;
  } catch (err) {
    console.log(err);
  }
};

// Add a new note
exports.addNote = async req => {
  try {
    const note = new Note(req);
    const newNote = await note.save();
    return newNote;
  } catch (err) {
    console.log(err);
  }
};

// Update an existing note
exports.updateNote = async req => {
  try {
    const id = req.params === undefined ? req.id : req.params.id;
    const updateData = req.params === undefined ? req : req.params;
    const update = await Note.findByIdAndUpdate(id, updateData, { new: true });
    return update;
  } catch (err) {
    console.log(err);
  }
};

// Delete a note
exports.deleteNote = async req => {
  try {
    const id = req.params === undefined ? req.id : req.params.id;
    const note = await Note.findByIdAndRemove(id);
    return note;
  } catch (err) {
    console.log(err);
  }
};