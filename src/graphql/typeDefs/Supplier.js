import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    getAllSuppliers: [Supplier!]!
    getSupplierById(id: ID!): Supplier!
    #    getMySuppliersWithPagination(page: Int, limit: Int): SupplierPaginator!
    #    getSuppliersWithPagination(page: Int, limit: Int, user_id: ID): SupplierPaginator!
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
    address: [Address]
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
    # type PostPaginator {
    #     posts: [Post!]!
    #     paginator: Paginator!
    # }
#   type Paginator {
#       slNo: Int
#       prev: Int
#       next: Int
#       perPage: Int
#       totalPosts: Int
#       totalPages: Int
#       currentPage: Int
#       hasPrevPage: Boolean
#       hasNextPage: Boolean
#   }

  


`;
