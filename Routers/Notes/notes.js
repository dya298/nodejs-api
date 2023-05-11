const router = require("express").Router();
const upload = require("../../utils/multer");
const { verifyAccessToken } = require("../../Helpers/jwt");
const {
  addNoteSchema,
  updateNoteSchema,
} = require("../../Helpers/validation_schema");
const noteControllers = require("../../controllers/noteControllers");

router.post(
  "/addNote",
  verifyAccessToken,
  upload.single("image"),
  async (req, res, next) => {
    try {
      const note = await addNoteSchema.validateAsync(req.body);
      let file = null;
      if (req.file != null) {
        file = req.file.path;
      }
      const data = await noteControllers.addNote(note, file);
      res.send(data);
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  }
);

router.post(
  "/editNote",
  verifyAccessToken,
  upload.single("image"),
  async (req, res, next) => {
    try {
      const note = await updateNoteSchema.validateAsync(req.body);
      let file = null;
      if (req.file != null) {
        file = req.file.path;
      }
      await noteControllers.updateNote(note, file);
      res.status(200).send("OK");
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  }
);

module.exports = router;
