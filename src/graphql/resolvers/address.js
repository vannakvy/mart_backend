import { NewAddressRules } from "../../validations/address";
import { ApolloError } from "apollo-server-express";

const AddressLabels = {
  docs: "addresses",
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
    // @DESC get all the address
    //@access Authenticated

    allAddress: async (_, {}, { Address }) => {
      let addresses = await Address.find();
      return addresses;
    },

    // @DESC get a sigle address by Id
    //@access Public

    getAddressById: async (_, { id }, { Address }) => {
      let address = Address.findById(id);
      return address;
    },

    // @DESC get address by pagination variables
    // @Access authenticated

    getAddressWithPagination: async (_, { page, limit }, { Address }) => {
      const options = {
        page: page || 1,
        limit: limit || 10,
        customLabels: AddressLabels,
        sort: {
          createdAt: -1,
        },
      };
      let addresses = await Address.paginate({}, options);
      return addresses;
    },
  },

  Mutation: {
    // @DESC Create new Address
    // @Params newAddress{
    //     houseNumner,
    //     village,
    //     commune
    //     district
    //     province
    // }
    // @access Authenticated

    createAddress: async (_, { newAddress }, { Address,user }) => {

      const { houseNumber, village, commune, district, province } = newAddress;
      //validate the address using the address rule in the validation
  
      await NewAddressRules.validate(
        {
          houseNumber,
          village,
          district,
          province,
          commune,
        },
        {
          abortEarly: false,
        }
      );

      // console.log(...newAddress)

      // once the validation passed start creating the new Address
      const address = new Address({
        ...newAddress,
      });
      const result = await address.save();
      return result;
    },

    // @DESC update an existing address by id
    // @params updateAddress{
    //     fouseNumber
    //     village
    //     commune
    //     district
    //     province
    // }

    updateAddress: async (_, { updatedAddress, id }, { Address }) => {
      try {
        let { houseNumber, village, district, province, commune } = updatedAddress;
        await NewAddressRules.validate(
          {
            houseNumber,
            village,
            district,
            province,
            commune,
          },
          {
            abortEarly: false,
          }
        );
        let address = await Address.findByIdAndUpdate(
          {
            _id: id,
          },
          updatedAddress,
          {
            new: true,
          }
        );
       
        if (!address) {
          throw new Error("UnAuthorized Access");
        }
        return address
      } catch (error) {
        throw new ApolloError(error.message);
      }
    },

    //    @DESC to Delete an Existing Address by ID
    //    @Params id!
    //    @Access Private
    deleteAddress: async (_, { id }, { Address }) => {
      try {
        let address = await Address.findByIdAndDelete({
          _id: id,
        });
        console.log(address)
        if (!address) {
          throw new Errow(" Unauthorized Access");
        }
        return {
          success: true,
          message: "Post Deleted Successfully.",
        };
      } catch (error) {
        throw new ApolloError(error.message);
      }
    },
  },
};
