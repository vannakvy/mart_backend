import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    totalCustomer:Int!
    allCustomers: [Customer!]!
    getCustomerById(id: ID!): Customer!
    getCustomerWithPagination(
      page: Int
      limit: Int
    ): CustomerPaginator!
  }
  extend type Mutation {
    createCustomer(newCustomer: CustomerInput!): Customer! 
    deleteCustomer(id: ID!): CustomerMessageResponse! 
    updateCustomer(updatedCustomer: CustomerInput, id: ID!): CustomerMessageResponse!
  }

  type Customer {
    id: ID!
    name: String!
    tel: String!
    long:Int!
    lat:Int!
    address:String!
    customerImage:String
    email:String
    createdAt: String!
    updatedAt: String!
 

  }

  input CustomerInput {
    name: String!
    tel: String!
    long:Int!
    lat:Int!
    address:String!
    customerImage:String
  }
  type CustomerMessageResponse {
    message: String!
    success: Boolean
  }
  type CustomerPaginator {
    Customers: [Customer!]!
    paginator: Paginator!
  }
`;
