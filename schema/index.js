const graphql = require("graphql");

const controllers = require("../controllers");

const {
  GraphQLSchema,

  GraphQLObjectType,

  GraphQLString,

  GraphQLID,

  GraphQLList,

  GraphQLBoolean,

  GraphQLNonNull
} = graphql;

// Define Object Types

const noteType = new GraphQLObjectType({
  name: "Note",

  fields: () => ({
    _id: { type: GraphQLID },

    title: { type: GraphQLString },

    desc: { type: GraphQLString },

    topic_id: { type: GraphQLID },

    user_id: { type: GraphQLID },

    topic: {
      type: topicType,

      async resolve (parent, args) {
        return await controllers.topics.getSingleTopic({ id: parent.topic_id });
      }
    },

    user: {
      type: topicType,

      async resolve (parent, args) {
        return await controllers.topics.getSingleTopic({ id: parent.topic_id });
      }
    }
  })
});

const topicType = new GraphQLObjectType({
  name: "Topic",

  fields: () => ({
    _id: { type: GraphQLID },

    title: { type: GraphQLString },

    desc: { type: GraphQLString },

    notes: {
      type: new GraphQLList(noteType),

      async resolve (parent, args) {
        return await controllers.topics.getTopicNote({ id: parent._id });
      }
    }
  })
});

const userType = new GraphQLObjectType({
  name: "User",

  fields: () => ({
    _id: { type: GraphQLID },

    email: { type: GraphQLString },

    password: { type: GraphQLString },

    name: { type: GraphQLString },

    phone: { type: GraphQLString },

    isVerify: { type: GraphQLBoolean },

    emailToken: { type: GraphQLString },

    notes: {
      type: new GraphQLList(noteType),

      async resolve (parent, args) {
        return await controllers.users.getUserNote({ id: parent._id });
      }
    }
  })
});

// Define Root Query

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",

  fields: {
    note: {
      type: noteType,

      args: { id: { type: GraphQLID } },

      async resolve (parent, args) {
        return await controllers.notes.getSingleNote(args);
      }
    },

    notes: {
      type: new GraphQLList(noteType),

      async resolve (parent, args) {
        return await controllers.notes.getNotes();
      }
    },

    topic: {
      type: topicType,

      args: { id: { type: GraphQLID } },

      async resolve (parent, args) {
        return await controllers.topics.getSingleTopic(args);
      }
    }
  }
});

// Define Mutations

const Mutations = new GraphQLObjectType({
  name: "Mutations",

  fields: {
    addNote: {
      type: noteType,

      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },

        desc: { type: new GraphQLNonNull(GraphQLString) },

        topic_id: { type: GraphQLID },

        user_id: { type: GraphQLID }
      },

      async resolve (parent, args) {
        const data = await controllers.notes.addNote(args);

        return data;
      }
    },

    editNote: {
      type: noteType,

      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },

        title: { type: new GraphQLNonNull(GraphQLString) },

        desc: { type: new GraphQLNonNull(GraphQLString) },

        note_id: { type: GraphQLID }
      },

      async resolve (parent, args) {
        const data = await controllers.notes.updateNote(args);

        return data;
      }
    },

    deleteNote: {
      type: noteType,

      args: {
        id: { type: new GraphQLNonNull(GraphQLID) }
      },

      async resolve (parent, args) {
        const data = await controllers.notes.deleteNote(args);

        return data;
      }
    },

    addTopic: {
      type: topicType,

      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },

        desc: { type: new GraphQLNonNull(GraphQLString) }
      },

      async resolve (parent, args) {
        const data = await controllers.topics.addTopic(args);

        return data;
      }
    },

    editTopic: {
      type: topicType,

      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },

        title: { type: new GraphQLNonNull(GraphQLString) },

        desc: { type: new GraphQLNonNull(GraphQLString) }
      },

      async resolve (parent, args) {
        const data = await controllers.topics.updateTopic(args);

        return data;
      }
    },

    deleteTopic: {
      type: topicType,

      args: {
        id: { type: new GraphQLNonNull(GraphQLID) }
      },

      async resolve (parent, args) {
        const data = await controllers.topics.deleteTopic(args);

        return data;
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,

  mutation: Mutations
});
