import {
    gql
} from "apollo-server-express";

export default gql`
    extend type Query {
        authUser: User! @isAuth
        allUsers:[User!]
        getUserById(userId:String!):User!
        getUserWithPagination(page:Int,limit:Int,keyword:String):UserPaginator!
    }
    extend type Mutation {
        registerUser(newUser: UserInput!): userResponse!
        addRole(userId:ID!role:String!): userResponse!      
        deleteRole(userId:ID!,roleId:ID!): userResponse!
        loginUser(username: String!, password: String!):AuthUser!
        deleteUser(userId:ID!):userResponse!
        updateAccount(userId:ID!,password:String!,username:String!):userResponse!
        updateUserDetail(userId:ID!,tel:String!,firstName:String!,lastName:String!,email:String!):userResponse!
        updateProfileImage(userId:ID!,image:String!):userResponse!
    }

    input UserInput {
        email:String!
        username:String!
        lastName: String!
        password: String!
        firstName: String!
        role: String!
        tel:String!
    }

    type User {
        id: ID!
        email:String!
        username:String!
        lastName: String!
        firstName: String!
        image:String
        roles:[Role!]!
        createdAt: String
        updatedAt: String
        tel:String!
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

      type UserPaginator {
        users: [User!]!
        paginator: Paginator!
    }
`;




