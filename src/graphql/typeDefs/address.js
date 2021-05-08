import {gql} from 'apollo-server-express'

export default gql`

extend type Query {
   allAddress: [Address!]!
    getAddressById(id: ID!): Address!
    getAddressWithPagination(page: Int, limit: Int): AddressPaginatior!
  }
  extend type Mutation {
        createAddress(newAddress: AddressInput): Address! @isAuth
        deleteAddress(id: ID!): AddressMessageResponse! @isAuth
        updateAddress(updatedAddress: AddressInput, id: ID!): Address! @isAuth
    }

type Address{
    id:ID!
    village:String!
    houseNumber: Int
    commune: String!
    district: String!
    province: String!
    createdAt: String! 
    updatedAt: String!
}
 
 input AddressInput{
     houseNumber:Int
     village: String! 
     commune: String!
     district: String! 
     province: String! 
 }

 type AddressMessageResponse{
     message:String!
     success: Boolean 
 }
 type AddressPaginatior{
    addresses: [Address!]!
    paginator: Paginator! 
 }
`
