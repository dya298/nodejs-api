const router = require("express").Router();
const cloudinary = require("../../utils/cloudinary");
const upload = require("../../utils/multer");
const Note = require("../../Models/Notes/notesModel");

router.post("/uploadimage", upload.single("image"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    // eslint-disable-next-line camelcase
    const _id = req.query._id;
    // eslint-disable-next-line camelcase
    const note = await Note.findOne({ _id });
    note.profile_img = result.secure_url;
    note.cloudinary_id = result.public_id;
    await note.save();
    res.status(200).send({
      note
    });
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;
