import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    totalCustomer:Int!
    allCustomers: [Customer!]!
    getCustomerById(id: ID!): Customer!
    getCustomerWithPagination(
      page: Int
      limit: Int
      keyword:String
    ): CustomerPaginator!
  }
  extend type Mutation {
    createTests:String
    storeCustomerToken(uid:String!,token:String):Customer!
    createCustomer(newCustomer: CustomerInput!): Customer! 
    deleteCustomer(id: ID!): CustomerMessageResponse! 
    updateCustomer(updatedCustomer: CustomerInput, id: ID!): Customer!
  }

  type Customer {
    id: ID!
    name: String
    tel: String
    long:Float
    lat:Float   
    uid:String
    token:String 
    address:String
    customerImage:String
    email:String
    createdAt: Date
    updatedAt: Date
  }

  input CustomerInput {
    name: String
    tel: String
    long:Float
    lat:Float
    uid:String
    token:String
    address:String
    customerImage:String
    email:String
  }
  type CustomerMessageResponse {
    message: String!
    success: Boolean
  }
  type CustomerPaginator {
    customers: [Customer!]!
    paginator: Paginator!
  }
`;
