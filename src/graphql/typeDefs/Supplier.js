import {gql} from 'apollo-server-express';

export default gql`
    extend type Query{
        getAllSuppliers:[Supplier!]!
    },
    type Post{
        firstName:String!
        lastName :String!
        address:String
        
    }
`