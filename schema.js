const axios = require('axios');
const urlSpaceX = 'https://api.spacexdata.com/v3/'
const urlLaunches = `${urlSpaceX}launches/`;
const urlRockets = `${urlSpaceX}rockets/`

const { 
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString,
    GraphQLBoolean,
    GraphQLList,
    GraphQLSchema
} = require('graphql');

const LaunchType = new GraphQLObjectType({
    name: 'Launch',
    fields: () => ({
        flight_number: {
            type: GraphQLInt
        },
        mission_name: {
            type: GraphQLString
        },
        launch_year: {
            type: GraphQLString
        },
        launch_date_local: {
            type: GraphQLString
        },
        launch_success: {
            type: GraphQLBoolean
        },
        rocket: {
            type: RocketType
        },
        links: {
            type: LinkType
        }
    })
});

const LaunchesPaginatedType = new GraphQLObjectType({
    name: 'LaunchesPaginated',
    fields: {
        list: {
            type: GraphQLList(LaunchType)
        },
        total: {
            type: GraphQLInt
        }
    }
});

const RocketType = new GraphQLObjectType({
    name: 'Rocket',
    fields: () => ({
        rocket_id: { type: GraphQLString },
        rocket_name: { type: GraphQLString },
        rocket_type: { type: GraphQLString }
    })
});

const LinkType = new GraphQLObjectType({
    name: 'Link',
    fields: {
        mission_patch: { type: GraphQLString },
        mission_patch_small: { type: GraphQLString },
        video_link: { type: GraphQLString }
    }
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: { 
        launches: {
            type: LaunchesPaginatedType,
            args: {
                limit: { type: GraphQLInt },
                offset: { type: GraphQLInt }
            },
            resolve(parent, args) {
                return axios.get(`${urlLaunches}?limit=${args.limit}&offset=${args.offset}`)
                    .then(res => {
                        console.log('res', res.headers['spacex-api-count']);
                        const data = {
                            list: res.data,
                            total: res.headers['spacex-api-count']
                        }
                        return data;
                    });
            }
        },
        rockets: {
            type: new GraphQLList(RocketType),
            resolve(parent, args) {
                return axios.get(urlRockets)
                    .then(res => res.data)
            }
        },
        launch: {
            type: LaunchType,
            args: {
                flight_number: { type: GraphQLInt }
            },
            resolve(parent, args) {
                return axios.get(`${urlLaunches}${args.flight_number}`)
                    .then(res => res.data);
            }
        },
        rocket: {
            type: RocketType,
            args: {
                id: { type: GraphQLString }
            },
            resolve(parent, args) {
                return axios.get(`${urlRockets}${args.id}`)
                    .then(res => res.data)
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});