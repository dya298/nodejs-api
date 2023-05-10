const graphql = require("graphql");

const controllers = require("../controllers");

const {
  GraphQLSchema,

  GraphQLObjectType,

  GraphQLString,

  GraphQLID,

  GraphQLList,

  GraphQLBoolean,

  GraphQLInt,

  GraphQLNonNull,
} = graphql;

const {
  Page,
  convertNodeToCursor,
  convertCursorToNodeId,
  ConvertTime
} = require("../pagination");

// Define Object Types

const noteType = new GraphQLObjectType({
  name: "Note",

  fields: () => ({
    _id: { type: GraphQLID },

    title: { type: GraphQLString },

    desc: { type: GraphQLString },

    topic_id: { type: GraphQLID },

    user_id: { type: GraphQLID },

    cloudinary_id: { type: GraphQLString },

    profile_img: { type: GraphQLString },

    topic: {
      type: topicType,

      async resolve(parent, args) {
        return await controllers.topics.getSingleTopic({ id: parent.topic_id });
      },
    },

    user: {
      type: userType,

      async resolve(parent, args) {
        return await controllers.users.getUserNote({ id: parent.user_id });
      },
    },
  }),
});

const topicType = new GraphQLObjectType({
  name: "Topic",

  fields: () => ({
    _id: { type: GraphQLID },

    title: { type: GraphQLString },

    desc: { type: GraphQLString },

    notes: {
      type: new GraphQLList(noteType),

      async resolve(parent, args) {
        return await controllers.topics.getTopicNote({ id: parent._id });
      },
    },
  }),
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

    image: { type: GraphQLString },

    notes: {
      type: new GraphQLList(noteType),

      async resolve(parent, args) {
        console.log(parent._id);
        return await controllers.users.getUserNote({ id: parent._id });
      },
    },
  }),
});

// Define Root Query

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",

  fields: {
    note: {
      type: noteType,

      args: { id: { type: GraphQLID } },

      async resolve(parent, args) {
        return await controllers.notes.getSingleNote(args);
      },
    },

    notes: {
      type: Page(noteType),

      args: {
        first: { type: GraphQLInt },
        afterCursor: { type: GraphQLString },
      },
      async resolve(parent, args) {
        const { first, afterCursor } = args;
        let afterIndex = 0;

        return await controllers.notes.getNotes().then((res) => {
          const data = res;
          if (typeof afterCursor === "string") {
            /* Extracting nodeId from afterCursor */
            const nodeId = convertCursorToNodeId(afterCursor);
            /* Finding the index of nodeId */
            const nodeIndex = data.findIndex((datum) => datum.id === nodeId);
            if (nodeIndex >= 0) {
              afterIndex = nodeIndex + 1;
            }
          }

          const slicedData = data.slice(afterIndex, afterIndex + !first ? data.length : first);
          const edges = slicedData.map((node) => ({
            node,
            time: ConvertTime(node),
            cursors: convertNodeToCursor(node),
          }));

          let startCursor;
          let endCursor = null;
          if (edges.length > 0) {
            startCursor = convertNodeToCursor(edges[0].node);
            endCursor = convertNodeToCursor(edges[edges.length - 1].node);
          }
          const hasNextPage = data.length > afterIndex + (!first ? data.length : first);

          return {
            totalCount: data.length,
            edges,
            pageInfo: {
              startCursor,
              endCursor,
              hasNextPage,
            },
          };
        });
      },
    },

    topic: {
      type: topicType,

      args: { id: { type: GraphQLID } },

      async resolve(parent, args) {
        return await controllers.topics.getSingleTopic(args);
      },
    },

    topics: {
      type: GraphQLList(topicType),

      async resolve(parent, args) {
        return await controllers.topics.getTopics();
      },
    },
  },
});

// Define Mutations

const Mutations = new GraphQLObjectType({
  name: "Mutations",

  fields: {
    deleteNote: {
      type: noteType,

      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },

      async resolve(parent, args) {
        const data = await controllers.notes.deleteNote(args);
        return data;
      },
    },

    addTopic: {
      type: topicType,

      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },

        desc: { type: new GraphQLNonNull(GraphQLString) },
      },

      async resolve(parent, args) {
        const data = await controllers.topics.addTopic(args);

        return data;
      },
    },

    editTopic: {
      type: topicType,

      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },

        title: { type: new GraphQLNonNull(GraphQLString) },

        desc: { type: new GraphQLNonNull(GraphQLString) },
      },

      async resolve(parent, args) {
        const data = await controllers.topics.updateTopic(args);

        return data;
      },
    },

    deleteTopic: {
      type: topicType,

      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },

      async resolve(parent, args) {
        const data = await controllers.topics.deleteTopic(args);

        return data;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,

  mutation: Mutations,
});
