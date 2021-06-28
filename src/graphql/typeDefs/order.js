import {gql} from 'apollo-server-express'


export default gql`

extend type Query{
classifyNumberOfProductSold: orderedProductSpecified!
allOrders: [Order!]!
getOrderById(id:ID!):Order!
getNewOrder:numOfNewOrder!
getMyOrder(user_id:ID!):[Order!]!
getAllMyOrderPending(user_id:ID!): Int!
getLatestOrder:[Order!]!
getAllOrderWithPagination(page:Int,limit:Int,keyword:String,start_date:String,end_date:String):OrderPaginator!
getMyOrderWithPagination(page:Int,limit:Int,user_id:ID!):OrderPaginator!
}


extend type Subscription {
    newOrder: Order!
    orderStateChange(orderId:ID!):NotiticationResponse!
    updateOrderonTheway(orderId:ID!): Order!
}


extend type Mutation{
    createTest:String
    createOrderItem(newOrder:OrderInput!,user_id:ID!):Order!
    # createOrderItem(user_id:String!):String!
    # createOrderItem:String
    delete(id:ID!):OrderMessageResponse!
    updateOrderConfirmed(id:ID!,data:Boolean!):OrderMessageResponse!
    updateOrderPaid(id:ID!,data:Boolean!):OrderMessageResponse! 
    updateOrderDelivered(id:ID!,data:Boolean!):OrderMessageResponse!
}
type orderedProductSpecified{
    food: Int !
    drink: Int! 
    grocery: Int!
}

type NotiticationResponse{
    id:ID
    title:String 
    description:String 
    createOrderAt:Date
    total:Float
}

input ShipAddressInput{
    address: String!
    tel: String!
    email:String
    long:Float 
    lat:Float
}

input OrderItemInput{
    name:String!
    qty: Int!
    salePrice: Int!
    category:String!
    product: String!
    productImage:String!
   
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
    customer:Customer!
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
    tel: String
    email:String
    long :Float!
    lat:Float!
}


type OrderItem{
    name: String!
    qty: Int!
    image:String 
    salePrice: Float!
    category:String!
    product: ID!
    productImage:String!
}

input InputItems{
    name: String!
    qty: String!
    productImage:String 
    salePrice: Float!
    category:String!
    product: ID!
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



