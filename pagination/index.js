const graphql = require("graphql");

const {
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLObjectType,
  GraphQLList,
} = graphql;

const Edge = (itemType) => {
  return new GraphQLObjectType({
    name: "EdgeType",
    fields: () => ({
      node: { type: itemType },
      time: { type: GraphQLString },
      cursors: { type: GraphQLString },
    }),
  });
};

const PageInfo = new GraphQLObjectType({
  name: "PageInfoType",
  fields: () => ({
    startCursor: { type: GraphQLString },
    endCursor: { type: GraphQLString },
    hasNextPage: { type: GraphQLBoolean },
  }),
});

const Page = (itemType) => {
  return new GraphQLObjectType({
    name: "PageType",
    fields: () => ({
      totalCount: { type: GraphQLInt },
      edges: { type: new GraphQLList(Edge(itemType)) },
      pageInfo: { type: PageInfo },
    }),
  });
};

/* Helper functions for base64 encoding and decoding */
const convertNodeToCursor = (node) => {
  // eslint-disable-next-line n/no-deprecated-api
  return new Buffer(node._id, "binary").toString("base64");
};

const convertCursorToNodeId = (cursor) => {
  // eslint-disable-next-line n/no-deprecated-api
  return new Buffer(cursor, "base64").toString("binary");
};

const ConvertTime = (node) => {
  let timeDisplay = "";
  const TimeNode = new Date(node.time);
  if (!node.time) {
  } else {
    const timeNow = new Date();
    const timeYear = timeNow.getFullYear();
    const yearNote = TimeNode.getFullYear();
    if (timeYear - yearNote === 0) {
    } else {
      timeDisplay = `${TimeNode.getDate()} ${TimeNode.getUTCMonth()} ${TimeNode.getFullYear()}`;
      console.log(timeDisplay);
    }
  }
  return timeDisplay;
};

module.exports = {
  Page,
  convertNodeToCursor,
  convertCursorToNodeId,
  ConvertTime,
};
