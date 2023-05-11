// Get Data Models
const Note = require("../Models/Notes/notesModel");
const cloudinary = require("../utils/cloudinary");
// Get all notes
exports.getNotes = async (topic_id) => {
  try {
    console.log(topic_id);
    if (topic_id) {
      const notes = await Note.find({ topic_id: topic_id }).sort({
        time: "desc",
      });
      return notes;
    }
    const notes = await Note.find().sort({ time: "desc" });
    return notes;
  } catch (err) {
    console.log(err);
  }
};

// Get single note by ID
exports.getSingleNote = async (req) => {
  try {
    const id = req.params === undefined ? req.id : req.params.id;
    const note = await Note.findById(id);
    return note;
  } catch (err) {
    console.log(err);
  }
};

// Add a new note
exports.addNote = async (req, file) => {
  try {
    const note = new Note(req);
    if (file != null) {
      const result = await cloudinary.uploader.upload(file);
      note.profile_img = result.secure_url;
      note.cloudinary_id = result.public_id;
    }
    const newNote = await note.save();
    return newNote;
  } catch (err) {
    console.log(err);
  }
};

// Update an existing note
exports.updateNote = async (req, file) => {
  try {
    const id = req.params === undefined ? req.id : req.params.id;
    const updateData = req.params === undefined ? req : req.params;
    const update = await Note.findByIdAndUpdate(id, updateData, { new: true });
    const { cloudinary_id } = update;
    if (cloudinary_id) {
      await cloudinary.uploader.destroy(cloudinary_id, async (rs, error) => {
        if (error) console.log(error);
        if (file != null) {
          const result = await cloudinary.uploader.upload(file);
          update.profile_img = result.secure_url;
          update.cloudinary_id = result.public_id;
          await update.save();
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
};

// Delete a note
exports.deleteNote = async (req) => {
  try {
    const id = req.params === undefined ? req.id : req.params.id;
    const note = await Note.findByIdAndRemove(id);
    console.log(note);
    const { cloudinary_id } = note;
    if (cloudinary_id) {
      await cloudinary.uploader.destroy(cloudinary_id, (result, error) => {
        if (error) console.log(error);
        return note;
      });
    }
    return note;
  } catch (err) {
    console.log(err);
  }
};
