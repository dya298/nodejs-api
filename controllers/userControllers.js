const boom = require("boom");

const Note = require("../../nodejs-api/Models/Notes/notesModel");

exports.getUserNote = async (req) => {
  try {
    const id = req.params === undefined ? req.id : req.params.id;

    const users = await Note.find({ user_id: id });

    return users;
  } catch (err) {
    throw boom.boomify(err);
  }
};
