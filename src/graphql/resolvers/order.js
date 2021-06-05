import { NewOrderRules } from "../../validations";
import { ApolloError } from "apollo-server-express";
import { getArgumentValues } from "graphql/execution/values";
import { ORDER_CREATED } from "../../constant";
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
      // const orders = await Order.countDocuments({'orderItems.name': 'coke'} ).populate("user");
      return orders;
    },

    //@desc get the latest order and limit
    //@Access admin
    getLatestOrder: async (_, {}, { Order }) => {
      const orders = await Order.find()
        .populate("user")
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
     
      return {
        food:a[0].count,
        drink:a[1].count,
        grocery:a[2].count
      };
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

  Subscription: {
    newOrder: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator(ORDER_CREATED),
    },
  },
  Mutation: {
    // @Desc update the order confirmed
    //@access  private (admin)

    updateOrderConfirmed: async (_, { id, data }, { Order }) => {
      try {
        await Order.findByIdAndUpdate(
          { _id: id },
          { orderConfirmed: !data, orderConfirmedAt: new Date() }
        );
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

    updateOrderPaid: async (_, { id, data }, { Order }) => {
      try {
        const order = await Order.findByIdAndUpdate(
          { _id: id },
          { isPaid: !data, paidAt: new Date() }
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

    updateOrderDelivered: async (_, { id, data }, { Order }) => {
      try {
        await Order.findByIdAndUpdate(
          { _id: id },
          { isDelivered: !data, deliveredAt: new Date() }
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

    createOrderItem: async (
      _,
      { newOrder, user_id },
      { User, Order, pubsub }
    ) => {
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
      pubsub.publish(ORDER_CREATED, {
        newOrder: order,
      });
      let result = order.save();
      return result;
    },
  },
};
