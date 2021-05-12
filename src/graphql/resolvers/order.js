import { NewOrderRules } from "../../validations";
import { ApolloError } from "apollo-server-express";
import { getArgumentValues } from "graphql/execution/values";
import {ORDER_CREATED} from '../../constant'
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
    allOrders: async (_, {}, { Order }) => {
      const orders = await Order.find().populate("user");
      return orders;
    },

    //@Get one order
    //@access private
    getOrderById: async (_, { id }, { Order }) => {
      const order = await Order.findById(id).populate("user");
      return order;
    },

    //@Desc get my order
    //@access private
    getMyOrder: async (_, { user_id }, { Order }) => {
      let orders = await Order.find({ user: user_id });
      return orders;
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
        populate: "user",
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
    getAllOrderWithPagination: async (_, { page, limit }, { Order }) => {
      const options = {
        page: page || 1,
        limit: limit || 10,
        customLabels: OrderLabels,
        sort: {
          createdAt: -1,
        },
        populate: "user",
      };

      const orders = await Order.paginate({}, options);
      return orders;
    },
  },
  Subscription:{
    newOrder:{
      subscribe:(_,__,{pubsub})=> pubsub.asyncIterator(ORDER_CREATED)
    }
  },
  Mutation: {
    // @Desc update the order confirmed
    //@access  private (admin)

    updateOrderConfirmed: async (_, { id }, { Order }) => {
      try {
        const a = await Order.findByIdAndUpdate({_id:id},{"orderConfirmed":true});
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

    updateOrderPaid: async (_, { id }, { Order }) => {
      try {
       await Order.findByIdAndUpdate({_id:id},{"isPaid":true});
        return {
          success: true,
          message: "Order Paid",
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

    updateOrderDelivered: async (_, { id }, { Order }) => {
      try {
       await Order.findByIdAndUpdate({_id:id},{"isDelivered":true});
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

    createOrderItem: async (_, { newOrder, user_id }, { User, Order,pubsub }) => {
      const {
        orderItems,
        paymentMethod,
        shippingPrice,
        totalPrice,
        shippingAddress,
        taxPrice,
      } = newOrder;
      await NewOrderRules.validate(
        {
          user_id,
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

      let user = await User.findById(user_id);
      const order = new Order({
        ...newOrder,
        user: user.id,
      });
      pubsub.publish(ORDER_CREATED,{
        newOrder:order
      })
      let result = order.save();
      return result;
    },
  },
};
