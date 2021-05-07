import {ApolloError} from 'apollo-server-express'
import { NewSupplierRules } from '../../validations';
import user from '../typeDefs/user';


const SupplierLabels = {
    docs: "posts",
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
      Query:{
        //   @DESC get all the suppliers 
        //   @access private 
        allSuppliers: async(_,{},{Supplier})=>{
            let suppliers = await Supplier.find().populate('address');
            return suppliers
        },
        getPostById: async(_,{id},{Supplier})=>{
            let supplier = Supplier.findById(id).populate('address');
            return supplier
        },

        // @DESC get the suppliers by Pagination Variable 
        // @access Private 
        getSupplierWithPagination:async(_,{page,limit,address_id},{Supplier})=>{
            const options ={
                page:page||1,
                limit:limit||10,
                customLabels:SupplierLabels,
                sort:{
                    createdAt:-1,
                },
                populate:"address"
            };

            let query ={};
            if(address_id){
                query={
                    address:address_id
                }
            }
            let suppliers = await Supplier.paginate(query,options);
            return suppliers;
        }
    },

    //   @DESC get my my Supplier with pagination  
    //   @access Public 
    // getMyPostsWithPagination: async (_, { page, limit }, { Post, user }) => {
    //     const options = {
    //       page: page || 1,
    //       limit: limit || 10,
    //       customLabels: PostLabels,
    //       sort: {
    //         createdAt: -1,
    //       },
    //       populate: "author",
    //     };
  
    //     let posts = await Post.paginate(
    //       {
    //         author: user.id,
    //       },
    //       options
    //     );
  
    //     return posts;
    //   },

  Mutation:{
            //   @DESC to Create new Supplier
        //  @Params newSupplier{ 
        //         lastName!, 
        //         firstName!, 
        //         tel 
        //     }
        //  @Access Private

        createSupplier:async(_,{newSupplier},{Supplier,user})=>{
            const {firstName,lastName,tel} = newSupplier;
            // validate the incoming new supplier arguments 
            console.log(newSupplier)
            await NewSupplierRules.validate({
                firstName,
                lastName,
                tel
            },{
                abortEarly:false
            });
            // once the validations are passed Create New Supplier

            const supplier = new Supplier({
                ...newSupplier,
                address: address.id
            });
            // save the supplier 
            let result = await supplier.save();
            result={
                ...result.toObject(),
                id: result._id.toString(),
            };
            return result; 
        },
            //  @DESC to Update an Existing Supplier by ID
    //      @Params updatedSupplier { 
    //             firstName!, 
    //             lastName!, 
    //             let 
    //         }
    //  @Access Private
    updateSupplier: async(_,{updatedSupplier,id},{Supplier})=>{
        try{
            let {firstName, lastName,tel} = updatedSupplier;
            await NewSupplierRules.validate({
                firstname,
                 lastName,
                tel
            },{
                abortEarly:false,
            });
let supplier = await Supplier.findOneAndUpdate({
    _id:id,author:user.id,
},updatedSupplier,{
    new: true
});
if(!supplier){
    throw new Error("Unauthorized Access");
}
// populate the Author Fields 
await supplier.populate("address").excecPopulate();
return supplier;
    }catch(error){
        throw new ApolloError(error.message)
    }
    },
    //    @DESC to Delete an Existing Supplier by ID
    //    @Params id!
    //    @Access Private

    deleteSupplier: async(_,{id},{Supplier,address})=>{
        try {
            let supplier = await Supplier.findOneAndDelete({
                _id:id,
                address:address.id
            });
            if(!supplier){
                throw new Error("UnAthorized Access");
            }
            return {
                success: true,
                message:"Post Deleted Successfully",
            }
        } catch (error) {
            throw new ApolloError(error.message)
        }
    }
  
  }
  }
