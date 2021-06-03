import { ApolloError } from "apollo-server-express";
import { NewNotificationRules } from "../../validations";
import user from "../typeDefs/user";

const NotificationLabels = {
  docs: "Notifications",
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
    //   @DESC get all the Notifications
    //   @access private
    allNotifications: async (_, {}, { Notification }) => {
      let notifications = await Notification.find({}).populate('user');
      return notifications;
    },
    getNotificationById: async (_, { id }, { Notification }) => {
      let notification = await Notification.findById(id).populate('user');
      return notification;
    },

    // @DESC get the Notifications by Pagination Variable
    // @access Private
    getNotificationWithPagination: async (_, { page, limit }, { Notification }) => {
      const options = {
        page: page || 1,
        limit: limit || 10,
        customLabels: NotificationLabels,
        sort: {
          createdAt: -1,
        },
      };

      let query = {};

      let notifications = await Notification.paginate(query, options);

      return notifications;
    },
  },

  Mutation: {
    //   @DESC to Create new Notification
    //  @Params newNotification{
    //         lastName!,
    //         firstName!,
    //         tel
    //     }
    //  @Access Private
    createNotification: async (_, { newNotification }, { Notification }) => {
      const {        
        eventType,
        allClent,
        user,
        message
       } = newNotification;
     
      // validate the incoming new Notification arguments
      await NewNotificationRules.validate(
        {
            eventType,
            allClent,
            user,
            message

        },
        {
          abortEarly: false,
        }
      );
      // once the validations are passed Create New Notification
      const notification = new Notification({
        ...newNotification,
      });
      // save the Notification

      let result = await notification.save();
      result = {
        ...result.toObject(),
        id: result._id.toString(),
      };
      return result;
    },
    //  @DESC to Update an Existing Notification by ID
    //      @Params updatedNotification {
    //             firstName!,
    //             lastName!,
    //             let
    //         }
    //  @Access Private
    updateNotification: async (_, { updatedNotification, id }, { Notification }) => {
      try {
        let {
            eventType,
            allClent,
            user,
            message
        } = updatedNotification;
        await NewNotificationRules.validate(
          {
            eventType,
            allClent,
            user,
            message
          },
          {
            abortEarly: false,
          }
        );
        let notification = await Notification.findOneAndUpdate(
          {
            _id: id,
            author: user.id,
          },
          updatedNotification,
          {
            new: true,
          }
        );
        if (!notification) {
          throw new Error("Unauthorized Access");
        }
        // populate the Author Fields

        return {
          success: true,
          message: "Notification Updated Successfully !"
        };
      } catch (error) {
        throw new ApolloError(error.message);
      }
    },
    //    @DESC to Delete an Existing Notification by ID
    //    @Params id!
    //    @Access Private

    deleteNotification: async (_, { id }, { Notification }) => {
      try {
        let notification = await Notification.findOneAndDelete({
          _id: id,
        });
        if (!notification) {
          throw new Error("UnAthorized Access");
        }
        return {
          success: true,
          message: "Post Deleted Successfully",
        };
      } catch (error) {
        throw new ApolloError(error.message);
      }
    },
  },
};
