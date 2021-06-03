import { gql } from "apollo-server-express";
export default gql`
    extend type Query{
        allProducts(type:String):[Product!]!
        totalProduct: Int!
        getProductById(id:ID!):Product!
        getTopProducts:[Product!]!
        getProductsWithPagination(page:Int,limit:Int): ProductPaginator!
        getProductsWithPaginationCategory(page:Int,limit:Int,category:String): ProductPaginator!

    }
    extend type Mutation{
    createProduct(newProduct: ProductInput):ProductMessageResponse! 
    deleteProduct(id:ID!): ProductMessageResponse! 
    updateProduct(updatedProduct: ProductInput!,id:ID! ): ProductMessageResponse!
    reviewProduct(newReview:ReviewInput,user_id:ID,id:ID):ProductMessageResponse!
    deleteReview(id:ID!,user_id:ID!):ProductMessageResponse!
    updateProductPrice(id:ID!,price:Int!): ProductMessageResponse
    updateProductCountInstock(id:ID!,countInStock:Int!):ProductMessageResponse
    updateproductImage(id:ID!,file:String!):ProductMessageResponse
    } 
    input ProductInput{
    productName :String!
    productImage :String!
    category :String!
    description :String
    }

input ReviewInput{
    rating:Int
    comment: String!
}

type ProductMessageResponse {
        message: String!
        success: Boolean
    }

type Review{
    id:ID!
    name:String!
    rating:Int
    comment: String!
    user : User!

}

type ProductPaginator {
        products: [Product!]!
        paginator: Paginator!
    }
type Product{
    id:ID!
    productName :String!
    countInStock: Int!
    rating :Int!
    numOfReview :Int!
    productImage :String!
    price:Int!
    category :String!
    description :String!
    review: [Review!]!
    createdAt: Date 
    updatedAt: Date
}

`;
