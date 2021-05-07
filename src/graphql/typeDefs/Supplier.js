import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
   allSuppliers: [Supplier!]!
    getSupplierById(id: ID!): Supplier!
       getMySuppliersWithPagination(page: Int, limit: Int): SupplierPaginator!
       getSupplierWithPagination(page: Int, limit: Int, user_id: ID): SupplierPaginator!
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
    address: Address!
    tel: String!
    createdAt: String!
    updatedAt: String!
  }

  input SupplierInput {
    firstName: String!
    lastName: String!
    tel: String!
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
