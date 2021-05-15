import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    allSuppliers: [Supplier!]!
    getSupplierById(id: ID!): Supplier!
    getSupplierWithPagination(
      page: Int
      limit: Int
    ): SupplierPaginator!
  }
  extend type Mutation {
    createSupplier(newSupplier: SupplierInput): Supplier! @isAuth
    deleteSupplier(id: ID!): SupplierMessageResponse! @isAuth
    updateSupplier(updatedSupplier: SupplierInput, id: ID!): Supplier! @isAuth
  }

  type Supplier {
    id: ID!
    firstName: String!
    lastName: String!
    tel: String!
    houseNumber:Int
     village: String! 
     commune: String!
     district: String! 
     province: String!
    createdAt: String!
    updatedAt: String!
    imgUrl:String!
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
     imgUrl:String
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
