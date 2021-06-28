import { ApolloError } from "apollo-server-express";
import { NewCustomerRules } from "../../validations";
import user from "../typeDefs/user";

const CustomerLabels = {
  docs: "customers",
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
    getCustomerWithPagination: async (_, { page, limit,keyword="" }, { Customer }) => {
      const options = {
        page: page || 1,
        limit: limit || 10,
        customLabels: CustomerLabels,
        sort: {
          createdAt: -1,
        },
      };

      let query = {
        $or: [ {email : { $regex: keyword, $options: 'i' }}, { name: { $regex: keyword, $options: 'i' }, }]
    }
      let customers = await Customer.paginate(query, options);
  console.log(customers)
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
    // createCustomer: async (_, { uid, token, tel }, { Customer }) => {
    //   try {
    //     let oldCustomer = await Customer.findOne({uid:uid})
    //     if(oldCustomer){
    //       return oldCustomer;
    //     }
    //     let customerToken = new Customer({
    //       tel: tel,
    //       uid: uid,
    //       token: token,
    //     });

    //     let res = await customerToken.save();
    //     if (res) {
    //       return res
    //     } else {
    //       throw new ApolloError("Cannot create new apollo error")
    //     }
    //   } catch (error) {
    //     throw new ApolloError("Cannot create New Customer")
    //   }
    // },

    createCustomer: async (_, { newCustomer }, { Customer }) => {
 console.log("create customer")
      let oldCustomer = await Customer.findOne({uid:newCustomer.uid})
      if(oldCustomer){
        return oldCustomer;
      }
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
    
    createTests:async(_,{},{})=>{
      console.log("click")
      return "Created"
    },

storeCustomerToken:async(_,{uid,token,tel},{Customer})=>{
   try{
let customerToken = new Customer({
  tel: tel,  
  uid: uid,
  token:token
})

let res = await customerToken.save()
if(res){
  return {
    success: true,
    message:"Token recieved successfully"
  }
}else{
  return {
    success: false,
    message:"customer token created unsuccesfully"
  }
}
   }catch(error){
    return {
      success: false,
      message:"Token recieved successfully"
    }
   }
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

        console.log(updatedCustomer)
        // await NewCustomerRules.validate(
        //   {
        //     name,
        //     tel,
        //     long,
        //     lat,
        //     address,
        //     customerImage,
        //     uid
        //   },
        //   {
        //     abortEarly: false,
        //   }
        // );
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

        return customer
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
