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
  var current = new Date();
  const timeStamp = new Date(Date.UTC(current.getFullYear(), 
  current.getMonth(),current.getDate(),current.getHours(), 
  current.getMinutes(),current.getSeconds(), current.getMilliseconds()));
  let timeDisplay = "";
  const TimeNode = new Date(node.time);
  if (!node.time) {
  } else {
    // current
    const timeYear = timeStamp.getFullYear();
    const timeMonth = timeStamp.getMonth();
    const timeDay = timeStamp.getDay();
    const timeHour = timeStamp.getHours();
    const timeMinutes = timeStamp.getMinutes();
    // note
    const yearNote = TimeNode.getFullYear();
    const monthNote = TimeNode.getMonth();
    const dayNote = TimeNode.getDay();
    const timeHourNote = TimeNode.getHours();
    const timeMinutesNote = TimeNode.getMinutes();
    const event = new Date(
      TimeNode.getFullYear(),
      TimeNode.getMonth(),
      TimeNode.getDate()
    );
    console.log(timeMinutes);
    console.log(timeMinutesNote);
    if (timeYear - yearNote === 0) {
      if (timeMonth - monthNote === 0) {
        if (timeDay - dayNote === 0) {
          if (timeHour - timeHourNote === 0) {
            if (timeMinutes - timeMinutesNote === 0) {
              timeDisplay = `Just now`;
            } else {
              timeDisplay = `${timeMinutes - timeMinutesNote}mins ago`;
            }
          } else {
            timeDisplay = `${timeHour - timeHourNote}h ago`;
          }
        } else {
          timeDisplay = event.toDateString().substring(4).slice(0, -5);
        }
      } else {
        timeDisplay = event.toDateString().substring(4).slice(0, -5);
      }
    } else {
      timeDisplay = event.toDateString().substring(4);
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
