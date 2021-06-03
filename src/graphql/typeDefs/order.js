import {gql} from 'apollo-server-express'


export default gql`

extend type Query{
allOrders: [Order!]!
getOrderById(id:ID!):Order!
getNewOrder:numOfNewOrder!
getMyOrder(user_id:ID!):[Order!]!
getLatestOrder:[Order!]!
getAllOrderWithPagination(page:Int,limit:Int):OrderPaginator!
getMyOrderWithPagination(page:Int,limit:Int,user_id:ID!):OrderPaginator!

}
extend type Subscription {
    newOrder: Order!
}

extend type Mutation{
    createOrderItem(newOrder:OrderInput!,user_id:ID!):Order!
    delete(id:ID!):OrderMessageResponse!
    updateOrderConfirmed(id:ID!,data:Boolean!):OrderMessageResponse!
    updateOrderPaid(id:ID!,data:Boolean!):OrderMessageResponse! 
    updateOrderDelivered(id:ID!,data:Boolean!):OrderMessageResponse!
}


input ShipAddressInput{
    address: String!
    tel: String!
    email:String
    long:Int 
    lat:Int
}

input OrderItemInput{
    name:String!
    qty: Int!
    image:String 
    salePrice: Int!
    product: String!
   
}

input OrderInput{
    orderItems:[OrderItemInput!]!
    paymentMethod:String!
    shippingPrice:Int
    totalPrice:Int!
    shippingAddress:ShipAddressInput!
    taxPrice:Int
}
type numOfNewOrder{
    num: Int!
}
scalar Date
type Order{
    id:ID!
    orderItems:[OrderItem!]!
    user:User!
    paymentMethod:String!
    shippingPrice:Int
    totalPrice:Int!
    shippingAddress:ShipAddress!
    taxPrice:Int
    paidAt: Date
    isPaid:Boolean!
    isDelivered: Boolean!
    deliveredAt: Date
    orderConfirmed: Boolean!
    orderConfirmedAt   : Date
    createdAt:Date 
    updatedAt: Date
}

type ShipAddress{
    address: String!
    tel: String!
    email:String
    long :Int!
    lat:Int!
}


type OrderItem{
    name: String!
    qty: String!
    image:String 
    salePrice: Int!
    product: Product!
}

input InputItems{
    name: String!
    qty: String!
    image:String 
    salePrice: Int!
    product: ProductInput!
}

    type OrderPaginator {
        orders: [Order!]!
        paginator: Paginator!
    }

    type OrderMessageResponse{
        success: Boolean! 
        message:String!
    }



`