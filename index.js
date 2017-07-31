const { graphql, buildSchema,
    GraphQLSchema,
    GraphQLID,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLBoolean,
    GraphQLInputObjectType
} = require('graphql');
const graphqlHTTP = require('express-graphql');
const express = require('express');

const { getVideoById, getVideos, createVideo } = require('./src/data');
const { globalIdField } = require('graphql-relay');
const { nodeInterface, nodeField } = require('./src/node');

const PORT = process.env.PORT || 3000;
const server = new express();

const videoType = new GraphQLObjectType({
    name: 'video',
    description: 'A video on Egghead.io',
    fields: {
        id: globalIdField(),
        title: {
            type: GraphQLString,
            description: 'The title of the video'
        },
        duration: {
            type: GraphQLInt,
            description: 'The duration of video (in seconds)'
        },
        watched: {
            type: GraphQLBoolean,
            description: 'Weather or not the viewer has watched the video.'
        },
        released: {
            type: GraphQLBoolean,
            description: 'Weather or not the video is released.'
        }
    },
    interfaces: [nodeInterface]
})

const queryType = new GraphQLObjectType({
    name: 'QueryType',
    description: 'The root query type.',
    fields: {
        node: nodeField,
        videos: {
            type: new GraphQLList(videoType),
            resolve: getVideos
        },
        video: {
            type: videoType,
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLID),
                    description: 'ID for video'
                }
            },
            resolve: (_, args) => {
                return getVideoById(args.id);
            }
        }
    }
});

const videoInputType = new GraphQLInputObjectType({
    name: 'VideoInput',
    fields: {
        title: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The title of the video'
        },
        duration: {
            type: new GraphQLNonNull(GraphQLInt),
            description: 'The duration of video (in seconds)'
        },
        released: {
            type: new GraphQLNonNull(GraphQLBoolean),
            description: 'Weather or not the video is released.'
        }
    }
});

const mutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'The root Mutation type.',
    fields: {
        createVideo: {
            type: videoType,
            args: {
                video: {
                    type: new GraphQLNonNull(videoInputType)
                }
            },
            resolve: (_, args) => {
                return createVideo(args.video);
            }
        }
    }
})

const schema = new GraphQLSchema({
    query: queryType,
    mutation: mutationType
});

server.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

server.listen(PORT, () => {
    console.log(`Listening on http ://localhost:${PORT}`);
});

exports.videoType = videoType;