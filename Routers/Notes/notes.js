const router = require("express").Router();
const upload = require("../../utils/multer");
const { verifyAccessToken } = require("../../Helpers/jwt");
const { addNoteSchema } = require("../../Helpers/validation_schema");
const noteControllers = require("../../controllers/noteControllers");

router.post(
  "/addNote",
  verifyAccessToken,
  upload.single("image"),
  async (req, res, next) => {
    try {
      // const resultSchema = await addNoteSchema.validateAsync(req.body);
      const note = req.body;
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
      const resultSchema = await addNoteSchema.validateAsync(req.body);
      const file = req.file.path;
      const data = await noteControllers.addNote(resultSchema, file);
      res.send(data);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
