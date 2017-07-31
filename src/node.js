const {
    nodeDefinitions,
    fromGlobalId
} = require('graphql-relay');
const { getObjectById } = require('./data');
const { nodeInterface, nodeField } = nodeDefinitions(
    (globalId) => {
        const { type, id } = fromGlobalId(globalId);
        return getObjectById(type, id);
    },
    (object) => {
        if (object.title) {
            return videoType;
        }

        return null;
    }
)
const { videoType } = require('../index');

exports.nodeInterface = nodeInterface;
exports.nodeField = nodeField;