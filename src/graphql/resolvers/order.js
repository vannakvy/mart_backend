import { NewOrderRules } from "../../validations";
import { ApolloError } from "apollo-server-express";

import { ORDER_CREATED, UPDATE_ORDER_CONFIRM ,ORDER_STATE_CHANGE} from "../../constant";

import { PubSub, withFilter } from "graphql-subscriptions";
const pubsub = new PubSub();
import  {handlePushTokens}  from "../../notificationPush";

const OrderLabels = {
  docs: "orders",
  limit: "perPage",
  nextPage: "next",
  prevPage: "prev",
  meta: "paginator",
  page: "currentPage",
  pagingCounter: "slNo",
  totalDocs: "totalDocs",
  totalPages: "totalPages",
};

export default {
  Query: {
    //@Desc get all orders without pagination
    //@access private
    allOrders: async (_, {}, { Order }) => {
      const orders = await Order.find().populate("customer");
      // const orders = await Order.countDocuments({'orderItems.name': 'coke'} ).populate("user");
      return orders;
    },
    //@desc get the latest order and limit
    //@Access admin
    getLatestOrder: async (_, {}, { Order }) => {
      const orders = await Order.find({})
        .populate("customer")
        .sort({ createdAt: 1 })
        .limit(5);
      return orders;
    },

    // @Des get the total number of item based on category sold
    //@Access admin

    classifyNumberOfProductSold: async (_, {}, { Order, Product }) => {
      //   var prodId = await Order.distinct("orderItems.product")
      // var a = await   Product.aggregate([{"$match":{"_id":{"$in":prodId}}},{$group:{"_id":"$category",count:{$sum:1}}}])
      //   console.log(prodId)
      // console.log(a)
      const aggregatorOpts = [
        {
          $unwind: "$orderItems",
        },
        {
          $group: {
            _id: "$orderItems.category",
            count: { $sum: 1 },
          },
        },
      ];

      var a = await Order.aggregate(aggregatorOpts).exec();
      if (a.length < 2) {
        return {
          food: 1,
          drink: 1,
          grocery: 1,
        };
      } else {
        return {
          food: a[0].count,
          drink: a[1].count,
          grocery: a[2].count,
        };
      }
    },

    //@Des get new order fof updating the notification
    //access private
    getNewOrder: async (_, {}, { Order }) => {       
      const num = await Order.countDocuments({ orderConfirmed: false });
      return {
        num,
      };
    },
    //@Get one order
    //@access private
    getOrderById: async (_, { id }, { Order }) => {
      const order = await Order.findById(id).populate("customer");
    
      return order;
    },

    //@Desc get my order
    //@access private
    getMyOrder: async (_, { user_id }, { Order, Customer }) => {
      let orders = await Order.find({ customer: user_id }).populate('customer')
      return orders;
    },

    //@Desc Get My orders count that are pending 
    //@access logged in users 
    getAllMyOrderPending:async(_,{user_id},{Order})=>{
      const orderCount = Order.countDocuments({$and:[{isPaid: false},{customer:user_id}]})
      if(!orderCount){
        return 0
      }else{
        return orderCount
      }
    },

    //@Desc Get my order with Paginations
    //@Access Private
    getMyOrderWithPagination: async (
      _,
      { page, limit, user_id },
      { Order }
    ) => {
      const options = {
        page: page || 1,
        limit: limit || 10,
        customLabels: OrderLabels,
        sort: {
          createdAt: -1,
        },
        populate: "customer",
      };

      let query = {};
      if (user_id) {
        query = {
          user: user_id.toString(),
        };
      }

      let orders = await Order.paginate(query, options);
      return orders;
    },
    //@Desc Get all order with pagination
    //@Access private
    getAllOrderWithPagination: async (_, { page, limit,keyword="",start_date,end_date }, { Order }) => {
     


      let query;
      let start = new Date(start_date)
      let end = new Date(end_date)

      if(start_date ==="" && end_date ===""){
        query = {}
      }
      if(start_date === end_date && start_date !=="" && end_date !==""){ 
        query = {createdAt: { $gte: start}}
      }
      if( start_date !== end_date && start_date !==""){
        query = {createdAt:{  $gte: start, $lt: end}}
      }
 
      console.log(query)
      const key = keyword
      const options = {
        page: page || 1,
        limit: limit || 10,
        customLabels: OrderLabels,
        sort: {
          createdAt: -1,
        },
        populate: "customer",
      };
   

     
       
      
      const orders = await Order.paginate(query, options);

      return orders;
    },
  },

  Subscription: {
    newOrder: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator(ORDER_CREATED),
    },

    updateOrderonTheway: {
      //  subscribe: (_, userId, { pubsub }) => pubsub.asyncIterator(UPDATE_ORDER_CONFIRM,{userId:userId}),
      subscribe: withFilter(
        (_, orderId, { pubsub, Order }) => {
       
          // if (!user) throw new AuthenticationError('Unauthenticated')
          return pubsub.asyncIterator(UPDATE_ORDER_CONFIRM);
        },

        //comparing the order id from the subscription with the the order id being updated from the admin page 
        async({ updateOrderonTheway }, {orderId}, { Order }) => {
          // const orderExist = await Order.findById(orderId);
          // console.log(updateOrderonTheway._id, orderId)
          let id = updateOrderonTheway._id.toString()
          if (id === orderId) {
            return true;
          }
          return false;
        }
      ),
    },
    orderStateChange: {
      //  subscribe: (_, userId, { pubsub }) => pubsub.asyncIterator(UPDATE_ORDER_CONFIRM,{userId:userId}),
      subscribe: withFilter(
        (_, orderId, { pubsub, Order }) => {
          // if (!user) throw new AuthenticationError('Unauthenticated')
          return pubsub.asyncIterator(ORDER_STATE_CHANGE);
        },
        async({ orderStateChange }, {orderId}, { Order }) => {
          let id = orderStateChange.id
          if (id === orderId) {
            return true;
          }
          return false;
        }
      ),
    },
  },

  Mutation: {
    // @Desc update the order confirmed
    //@access  private (admin)

    updateOrderConfirmed: async (_, { id, data }, {Customer, Order, pubsub }) => {
      try {
      
     let order =   await Order.findByIdAndUpdate(
          { _id: id },
          { orderConfirmed: !data, orderConfirmedAt: new Date() }
        );
const customer = await Customer.findById(order.customer)
const savedPushTokens = [customer.token];
const title = "Order Confirmed";
const body ={
  id:id,
  customer: customer.name,
  tel: customer.tel,
  date:new Date(),
  message:"Order is now confirm and preparing for shipping"

}
        handlePushTokens(title,body,savedPushTokens);
       
        pubsub.publish(ORDER_STATE_CHANGE, 
          { orderStateChange: {
            id:id,
            title:"order Confirm",
            description:"Your Order is now confirmed ",
            createOrderAt: order.createdAt,
            total:order.totalPrice
          }
         },
        );

        pubsub.publish(UPDATE_ORDER_CONFIRM, 
          { updateOrderonTheway: order },
        );
        // pubsub.publish('commentAdded', { commentAdded: { id: 1, content: 'Hello!' }})
        return {
          success: true,
          message: "Order Confirmed",
        };
      } catch (error) {
        return {
          success: false,
          message: "Order is not confirmed",
        };
      }
    },

    // @Desc update the order confirmed
    //@access  private (admin)

    updateOrderPaid: async (_, { id, data }, { Order,pubsub,Customer}) => {
      try {
        const order = await Order.findByIdAndUpdate(
          { _id: id },
          { isPaid: !data, paidAt: new Date() }
        );
        console.log(order.customer)
        const customer = await Customer.findById(order.customer)
        console.log(customer,"ddd")
        const savedPushTokens = [customer.token];

        const title = "Order Paid Successfully";
        const body ={
          id:id,
          customer: customer.name,
          tel: customer.tel,
          date:new Date(),
          message:"Order is now paid successfully"
        
        }
         handlePushTokens(title,body,savedPushTokens);

        pubsub.publish(UPDATE_ORDER_CONFIRM, 
          { updateOrderonTheway: order },
        );
        return {
          success: true,
          message: "Order Paid dddddd",
        };
      } catch (error) {
        return {
          success: false,
          message: "Order is not Paid ",
        };
      }
    },

    // @Desc update the order confirmed
    //@access  private (admin)

    updateOrderDelivered: async (_, { id, data }, { Order,pubsub ,Customer}) => {
      try {
     const order =   await Order.findByIdAndUpdate(
          { _id: id },
          { isDelivered: !data, deliveredAt: new Date() }
        );

//push notification 
const customer = await Customer.findById(order.customer)
const savedPushTokens = [customer.token];

const title = "Order Delivered";
const body ={
  id:id,
  customer: customer.name,
  tel: customer.tel,
  date:new Date(),
  message:"Order is now successfully delivered"

}
  handlePushTokens(title,body,savedPushTokens);

       pubsub.publish(UPDATE_ORDER_CONFIRM, 
          { updateOrderonTheway: order },
        );
        return {
          success: true,
          message: "Order Delivered",
        };
      } catch (error) {
        return {
          success: false,
          message: "Order is not delivered",
        };
      }
    },

    //@Desc create order
    //@access logined only
    // orderItems,
    // paymentMethod,
    // shippingPrice,
    // totalPrice,
    // shippingAddress,
    // taxPrice,
    createTest: async (_, {}, {}) => {
      return "Testing succesfully";
    },


    createOrderItem: async (
      _,
      { newOrder, user_id },
      { Customer, Order, pubsub }
    ) => {
      try {
        
        const { shippingAddress } = newOrder;
        let customer_id = "";
        let customer = {};
     
        let user = await Customer.findById(user_id);
        if (user) {
          user.address = shippingAddress.address;
          user.tel = shippingAddress.tel;
          user.long = shippingAddress.long;
          user.lat = shippingAddress.lat;
          await user.save();
          customer_id = user.id;
          await user.save();
        }
        if (!user) {
          customer = new Customer({
            address: shippingAddress.address,
            tel: shippingAddress.tel,
            long: shippingAddress.long,
            lat: shippingAddress.lat,
            name: "no name",
          });
          customer.save();
          customer_id = customer.id;
        }

        const order = new Order({
          ...newOrder,
          customer: customer_id,
        });

        pubsub.publish(ORDER_CREATED, {
          newOrder: order,
        });

        let result = await order.save();
        console.log(result)
        return result;
      } catch (error) {
        new ApolloError("Cannot create Order");
      }
    },
  },
};
