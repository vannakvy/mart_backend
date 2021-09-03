import { gql } from "apollo-server-express";
export default gql`
    extend type Query{
        allOffers:[Offer!]!
        getOfferById(id:ID!):Offer!
        getLatestOffer:[Offer!]!
        getOffersWithPagination(page:Int,limit:Int,keyword:String): OfferPaginator!
    }
    extend type Mutation{
    createOffer(newOffer: OfferInput):OfferMessageResponse! 
    deleteOffer(id:ID!): OfferMessageResponse! 
    updateOffer(updatedOffer: OfferInput!,id:ID! ): OfferMessageResponse!
    } 
    input OfferInput{
    title :String!
    start_date :Date
    end_date :Date
    discount: Float
    product: ID
    description :String
    isAllProduct: Boolean
    }

type OfferMessageResponse {
        message: String!
        success: Boolean
    }
type Offer{
    id:ID!
    title :String!
    start_date :Date
    end_date :Date
    discount: Float
    product: Product
    description :String
    isAllProduct:Boolean
    createdAt: Date 
    updatedAt: Date
}

type OfferPaginator {
        offers: [Offer!]!
        paginator: Paginator!
    }

`;
