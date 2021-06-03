import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    budgets:Budget!
    allPurchases: [Purchase!]!
    getPurchaseById(id: ID!): Purchase!
    getPurchaseWithPagination(
      page: Int
      limit: Int
      key: String
    ): PurchasePaginator!
  }
  extend type Mutation {
    createPurchase(newPurchase: PurchaseInput!): PurchaseMessageResponse! 
    deletePurchase(id: ID!): PurchaseMessageResponse! 
    updatePurchase(updatedPurchase: PurchaseInput, id: ID!): PurchaseMessageResponse!
  }

  type Purchase {
    id:ID!
    product: Product!
    supplier: Supplier!
    price: Int!
    qty: Int!
    createdAt: Date 
    updatedAt: Date
  }

  type Budget{
    id:ID!
    sum:Int!
  }

  input PurchaseInput {
        product: String!
        supplier: String!
        price: Int!
        qty: Int!
  }
  type PurchaseMessageResponse {
    message: String!
    success: Boolean
  }
  type PurchasePaginator {
    purchases: [Purchase!]!
    paginator: Paginator!
  }
`;
