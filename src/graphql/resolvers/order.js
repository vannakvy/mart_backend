import { NewOrderRules } from "../../validations";
import { ApolloError } from "apollo-server-express";

const OrderLabels = {
  docs: "orders",
  limit: "perPage",
  nextPage: "next",
  prevPage: "prev",
  meta: "paginator",
  page: "currentPage",
  pagingCounter: "slNo",
  totalDocs: "totalPosts",
  totalPages: "totalPages",
};

export default {
  Query: {

    //@Desc get all orders without pagination
    //@access private 
    allOrders: async (_,{},{Order})=>{
      const orders = await Order.find().populate("user");
      return orders;
    },

    //@Get one order 
    //@access private 
    getOrderById: async(_, {id},{Order})=>{
      const order = await Order.findById(id).populate("user");
      return order 
    },

    //@Desc get my order
    //@access private 
    getMyOrder: async (_,{user_id},{Order})=>{
      let orders = await Order.find({user:user_id});
      return orders;
    },
    getMyOrderWithPagination: async(_,{page,limit,user_id},{Order})=>{
      const options = {
        page: page || 1,
        limit: limit || 10,
        customLabels: OrderLabels,
        sort: {
          createdAt: -1,
        },
        populate: "user",
      };

      let query = {};
      if (user_id) {
        query = {
          user: user_id.toString(),
        };
      }

      let orders = await Order.paginate(query, options);
      console.log(orders)
      return orders;
    }
    
  },
  Mutation: {
    //@Desc create order 
    //@access logined only

    createOrderItem: async (_, { newOrder,user_id }, {User, Order }) => {
      const {
        orderItems,
        paymentMethod,
        shippingPrice,
        totalPrice,
        shippingAddress,
        taxPrice,
      } = newOrder;
      await NewOrderRules.validate(
        {user_id,
          orderItems,
          paymentMethod,
          shippingPrice,
          totalPrice,
          shippingAddress,
          taxPrice,
        },
        {
          abortEarly: false,
        }
      );

      let user = await User.findById(user_id)
      const order = new Order({
        ...newOrder,
        user:user.id
      });

      let result = order.save()
      return result; 
    },
  },
};


