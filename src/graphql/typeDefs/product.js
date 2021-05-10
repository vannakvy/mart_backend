import { gql } from "apollo-server-express";
export default gql`
    extend type Query{
        allProducts:[Product!]!
        getProductById(id:ID!):Product!
        getTopProducts:[Product!]!
        getProductsWithPagination(page:Int,limit:Int): ProductPaginator!
        getProductsWithPaginationCategory(page:Int,limit:Int,category:String): ProductPaginator!

    }
    extend type Mutation{
    createProduct(newProduct: ProductInput):Product! @isAuth
    deleteProduct(id:ID!): ProductMessageResponse! @isAuth 
    updateProduct(updatedProduct: ProductInput!,id:ID! ): Product! @isAuth
    reviewProduct(newReview:ReviewInput,user_id:ID,id:ID):ProductMessageResponse! @isAuth 
    deleteReview(id:ID):ProductMessageResponse! @isAuth
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
    rating :Int!
    numOfReview :Int!
    productImage :String!
    category :String!
    description :String!
    review: [Review!]!
}


`;
