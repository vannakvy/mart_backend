import { ApolloError } from "apollo-server-express";
import { NewCustomerRules } from "../../validations";
import user from "../typeDefs/user";

const CustomerLabels = {
  docs: "Customers",
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
    //   @DESC get all the Customers
    //   @access private
    allCustomers: async (_, {}, { Customer }) => {
      let customers = await Customer.find();
      return customers;
    },

    totalCustomer: async (_, {}, { Customer }) => {
      let  total = await Customer.countDocuments({});
        return total;
      },


    getCustomerById: async (_, { id }, { Customer }) => {
      let customer = Customer.findById(id);
      return customer;
    },

    // @DESC get the Customers by Pagination Variable
    // @access Private
    getCustomerWithPagination: async (_, { page, limit }, { Customer }) => {
      const options = {
        page: page || 1,
        limit: limit || 10,
        customLabels: CustomerLabels,
        sort: {
          createdAt: -1,
        },
      };
      let query = {};
      let customers = await Customer.paginate(query, options);

      return customers;
    },
  },

  Mutation: {
    //   @DESC to Create new Customer
    //  @Params newCustomer{
    //         lastName!,
    //         firstName!,
    //         tel
    //     }
    //  @Access Private

    createCustomer: async (_, { newCustomer }, { Customer }) => {
      const {        
        name,
        tel,
        long,
        lat,
        address,
        customerImage
       } = newCustomer;

      // validate the incoming new Customer arguments
      await NewCustomerRules.validate(
        {
            name,
            tel,
            long,
            lat,
            address,
            customerImage
        },
        {
          abortEarly: false,
        }
      );
    //   once the validations are passed Create New Customer
      const customer = new Customer({
        ...newCustomer,
      });
      // save the Customer

      let result = await customer.save();
      result = {
        ...result.toObject(),
        id: result._id.toString(),
      };
      return result;
    },

    //  @DESC to Update an Existing Customer by ID
    //      @Params updatedCustomer {
    //             firstName!,
    //             lastName!,
    //             let
    //         }
    //  @Access Private
    updateCustomer: async (_, { updatedCustomer, id }, { Customer }) => {
      try {
        let {
            name,
            tel,
            long,
            lat,
            address,
            customerImage

        } = updatedCustomer;
        await NewCustomerRules.validate(
          {
            name,
            tel,
            long,
            lat,
            address,
            customerImage
          },
          {
            abortEarly: false,
          }
        );
        let customer = await Customer.findOneAndUpdate(
          {
            _id: id,
            author: user.id,
          },
          updatedCustomer,
          {
            new: true,
          }
        );
        if (!customer) {
          throw new Error("Unauthorized Access");
        }
        // populate the Author Fields

        return {
          success: true,
          message: "Customer Updated Successfully !"
        };
      } catch (error) {
        throw new ApolloError(error.message);
      }
    },
    //    @DESC to Delete an Existing Customer by ID
    //    @Params id!
    //    @Access Private

    deleteCustomer: async (_, { id }, { Customer }) => {
      try {
        let customer = await Customer.findOneAndDelete({
          _id: id,
        });
        if (!customer) {
          throw new Error("UnAthorized Access");
        }
        return {
          success: true,
          message: "Customer Deleted Successfully",
        };
      } catch (error) {
        throw new ApolloError(error.message);
      }
    }
  }

}
