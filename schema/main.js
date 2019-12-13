const graphql = require('graphql')

const { GraphQLObjectType, GraphQLString, 
    GraphQLID, GraphQLNonNull, GraphQLSchema,GraphQLList } = graphql

const User = require('../models/user')
const Forum = require('../models/forum')

//Schema defines data on the Graph like object types(book type), relation between 
//these object types and descibes how it can reach into the graph to interact with 
//the data to retrieve or mutate the data 

const UserType = new GraphQLObjectType({
    name : 'User',
    fields : () => ({
        id : { 
            type : GraphQLID
        },
        name : {
            type : GraphQLString
        },
        forums : {
            type : new GraphQLList(ForumType),
            resolve(parent,args) {
                return Forum.find({userId : parent.id})
            }
        }
    })
})

const ForumType = new GraphQLObjectType({
    name : 'Forum',
    fields : () => ({
        id : {
            type : GraphQLString
        },
        title : {
            type : GraphQLString
        },
        desc : {
            type : GraphQLString
        },
        user : { 
            type : UserType,
            resolve(parent,args) {
                return User.findById(parent.userId)
            }
        }
    })
})

//RootQuery describe how users can use the graph and grab data.
//E.g Root query to get all authors, get all books, get a particular book 
//or get a particular author.

const RootQuery = new GraphQLObjectType({
    name : 'RootQueryType',
    fields : {
        users : {
            type : new GraphQLList(UserType),
            resolve(parent,args) {
                return User.find({})
            } 
        },
        user : {
            type : new GraphQLList(UserType),
            args : { id: { type : GraphQLString } },
            resolve(parent,args) {
                return User.find({_id :  args.id})
            }
        },
        forums : {
            type : new GraphQLList(ForumType),
            resolve(parent,args){
                return Forum.find({})
            }
        },
        forum : {
            type : new GraphQLList(ForumType),
            args : { id : { type : GraphQLString } },
            resolve(parent,args) {
                return Forum.find(args.id)
            }
        }
    }
})

const Mutation = new GraphQLObjectType({
    name : 'Mutation',
    fields : {
        addUser : {
            type : UserType,
            args : {
                name : {
                    type : GraphQLString
                }
            },
            resolve(parent,args){
                let user = new User({
                    name : args.name
                })
                return user.save()
            }
        },
        addForum : {
            type : ForumType,
            args : {
                title : {
                    type : GraphQLString
                },
                desc  : {
                    type : GraphQLString
                },
                userId : {
                    type : GraphQLString
                }
            },
            resolve(parent,args) {
                let forum = new Forum({
                    title : args.title,
                    desc : args.desc,
                    userId : args.userId
                })
                return forum.save()
            }
        }
    }
})

//Creating a new GraphQL Schema, with options query which defines query 
//we will allow users to use when they are making request.
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation : Mutation
});