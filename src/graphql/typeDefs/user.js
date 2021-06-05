import {
    gql
} from "apollo-server-express";

export default gql `
    extend type Query {
        authUser: User! @isAuth
        allUsers:[User!]
        getUserById(userId:String!):User!
       
    }
    extend type Mutation {
        registerUser(newUser: UserInput!): AuthUser!
        loginUser(username: String!, password: String!):AuthUser!
        deleteUser(userId:String):userResponse!
        updateUser(userId:String,updatedUser:UserInput):userResponse!
  
    }
    input UserInput {
        email:String!
        username:String!
        lastName: String!
        password: String!
        firstName: String!
        role: String!
    }

    type User {
        id: ID!
        email:String!
        username:String!
        lastName: String!
        firstName: String!
        roles:[Role!]!
        createdAt: String
        updatedAt: String
    }

    type AuthUser {
        user: User!
        token:String!
    }
    type Role {
       id:ID!
       role:String!
      }

      type userResponse{
          success: Boolean!
          message: String!

      }
`;