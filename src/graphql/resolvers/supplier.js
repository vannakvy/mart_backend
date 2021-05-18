import { ApolloError } from "apollo-server-express";
import { NewSupplierRules } from "../../validations";
import user from "../typeDefs/user";

const SupplierLabels = {
  docs: "suppliers",
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
    //   @DESC get all the suppliers
    //   @access private
    allSuppliers: async (_, {}, { Supplier }) => {
      let suppliers = await Supplier.find();
      return suppliers;
    },
    getSupplierById: async (_, { id }, { Supplier }) => {
      let supplier = Supplier.findById(id);
      return supplier;
    },

    // @DESC get the suppliers by Pagination Variable
    // @access Private
    getSupplierWithPagination: async (_, { page, limit }, { Supplier }) => {
      const options = {
        page: page || 1,
        limit: limit || 10,
        customLabels: SupplierLabels,
        sort: {
          createdAt: -1,
        },
      };

      let query = {};

      let suppliers = await Supplier.paginate(query, options);

      return suppliers;
    },
  },

  Mutation: {
    //   @DESC to Create new Supplier
    //  @Params newSupplier{
    //         lastName!,
    //         firstName!,
    //         tel
    //     }
    //  @Access Private

    createSupplier: async (_, { newSupplier }, { Supplier }) => {
      const {        
        firstName,
        lastName,
        tel,
        houseNumber,
        village,
        commune,
        district,
        province,
        email,
        gender,
        imageUrl
       } = newSupplier;
     
      // validate the incoming new supplier arguments
      await NewSupplierRules.validate(
        {
          firstName,
          lastName,
          tel,
          houseNumber,
          village,
          commune,
          district,
          province,
          email,

        },
        {
          abortEarly: false,
        }
      );
      // once the validations are passed Create New Supplier
      const supplier = new Supplier({
        ...newSupplier,
      });
      // save the supplier

      let result = await supplier.save();
      result = {
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
    updateSupplier: async (_, { updatedSupplier, id }, { Supplier }) => {
      try {
        let {
          firstName,
          email,
          lastName,
          tel,
          houseNumber,
          village,
          commune,
          district,
          province,
          imageUrl,
          gender
        } = updatedSupplier;
        await NewSupplierRules.validate(
          {
            firstName,
            lastName,
            tel,
            houseNumber,
            village,
            commune,
            district,
            province,
            email
          },
          {
            abortEarly: false,
          }
        );
        let supplier = await Supplier.findOneAndUpdate(
          {
            _id: id,
            author: user.id,
          },
          updatedSupplier,
          {
            new: true,
          }
        );
        if (!supplier) {
          throw new Error("Unauthorized Access");
        }
        // populate the Author Fields

        return supplier;
      } catch (error) {
        throw new ApolloError(error.message);
      }
    },
    //    @DESC to Delete an Existing Supplier by ID
    //    @Params id!
    //    @Access Private

    deleteSupplier: async (_, { id }, { Supplier }) => {
      try {
        let supplier = await Supplier.findOneAndDelete({
          _id: id,
        });
        if (!supplier) {
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
