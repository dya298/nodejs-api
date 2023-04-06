const boom = require("boom");

const Topic = require("../../nodejs-api/Models/Topics/topicModel");

const Note = require("../../nodejs-api/Models/Notes/notesModel");

exports.getTopic = async () => {
  try {
    const topics = await Topic.find();

    return topics;
  } catch (err) {
    throw boom.boomify(err);
  }
};

exports.getSingleTopic = async (req) => {
  try {
    const id = req.params === undefined ? req.id : req.params.id;

    const topic = await Topic.findById(id);

    return topic;
  } catch (err) {
    throw boom.boomify(err);
  }
};

exports.getTopicNote = async (req) => {
  try {
    const id = req.params === undefined ? req.id : req.params.id;

    const topics = await Note.find({ topic_id: id });

    return topics;
  } catch (err) {
    throw boom.boomify(err);
  }
};

exports.addTopic = async (req) => {
  try {
    const topic = new Topic(req);

    const newTopic = await topic.save();

    return newTopic;
  } catch (err) {
    throw boom.boomify(err);
  }
};

exports.updateTopic = async (req) => {
  try {
    const id = req.params === undefined ? req.id : req.params.id;

    const updateData = req.params === undefined ? req : req.params;

    const update = await Topic.findByIdAndUpdate(id, updateData, { new: true });

    return update;
  } catch (err) {
    throw boom.boomify(err);
  }
};

exports.deleteTopic = async (req) => {
  try {
    const id = req.params === undefined ? req.id : req.params.id;

    const topic = await Topic.findByIdAndRemove(id);

    return topic;
  } catch (err) {
    throw boom.boomify(err);
  }
};
