import {gql} from 'apollo-server-express'

export default gql`

type Address{
    id:ID!
    village:String!
    houseNumber: Int
    commune: String!
    district: String!
    province: String!
}

`
