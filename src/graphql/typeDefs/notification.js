import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    allNotifications: [Notification!]!
    getNotificationById(id: ID!): Notification!
    getNotificationWithPagination(
      page: Int
      limit: Int
    ): NotificationPaginator!
  }
  extend type Mutation {
    createNotification(newNotification: NotificationInput!): Notification! 
    deleteNotification(id: ID!): NotificationMessageResponse! 
    updateNotification(updatedNotification: NotificationInput, id: ID!): NotificationMessageResponse!
  }
  

  type Notification {
    id: ID!
    eventType:String!
    user: User
    allClient: Boolean!
    message:String!

  }

  input NotificationInput {
    eventType:String!
    user: ID!
    allClient: Boolean!
    message:String!
  }
  type NotificationMessageResponse {
    message: String!
    success: Boolean
  }
  type NotificationPaginator {
    Notifications: [Notification!]!
    paginator: Paginator!
  }
`;
