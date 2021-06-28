import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    allSuppliers: [Supplier!]!
    getSupplierById(id: ID!): Supplier!
    getSupplierWithPagination(
      page: Int!
      limit: Int!
      keyword:String
    ): SupplierPaginator!
  }
  extend type Mutation {
    createSupplier(newSupplier: SupplierInput!): Supplier! 
    deleteSupplier(id: ID!): SupplierMessageResponse! 
    updateSupplier(updatedSupplier: SupplierInput, id: ID!): SupplierMessageResponse!
  }

  type Supplier {
    id: ID!
    firstName: String!
    lastName: String!
    tel: String!
    houseNumber:Int!
     village: String! 
     commune: String!
     district: String! 
     province: String!
    createdAt: String!
    updatedAt: String!
    imageUrl:String
    email:String
    gender:String
  }

  input SupplierInput {
    firstName: String!
    lastName: String!
    tel: String!
    houseNumber:Int
     village: String! 
     commune: String!
     district: String! 
     province: String!
     imageUrl:String
     email:String
     gender:String
  }
  type SupplierMessageResponse {
    message: String!
    success: Boolean
  }
  type SupplierPaginator {
    suppliers: [Supplier!]!
    paginator: Paginator!
  }
`;
