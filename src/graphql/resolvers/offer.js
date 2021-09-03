import { NewProductRules } from "../../validations";
import { ApolloError } from "apollo-server-express";
import  {handlePushTokens}  from "../../notificationPush";

const OfferLabels = {
  docs: "offers",
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
    //@Desc get all the offers
    // @Access private

    allOffers: async (_, { type, keyword }, { Offer }) => {
      let offers = Offer.find({});
      return offers;
    },
    //@Desc Get latest order
    //Access admin
    getLatestOffer: async (_, {}, { Offer }) => {
      const offer = await Offer.find({}).sort({ start_date: -1 }).limit(5);

      return offer;
    },
    //@Desc get one offer by id
    //Access public

    getOfferById: async (_, { id }, { Offer }) => {
      let offers = await Offer.findById(id);
      return offers;
    },
    //Desc get the offer with the pagination
    //Access public
    getOffersWithPagination: async (
      _,
      { page, limit, keyword = "" },
      { Offer }
    ) => {
      console.log("running");
      const options = {
        page: page || 1,
        limit: limit || 10,
        customLabels: OfferLabels,
        sort: {
          createdAt: -1,
        },
        populate: "product",
      };

      //   let query = {
      //     $or: [ {productName : { $regex: keyword, $options: 'i' }}, { category: { $regex: keyword, $options: 'i' } }]
      // }
      let offers = await Offer.paginate({}, options);
      return offers;
    },
  },
  Mutation: {
    //   @DESC to Create new offer
    //  @Params newOffer{
    // title :String!
    // start_date :Date!
    // end_date :Date!
    // discount: Float
    // product: ID!
    // description :String
    //     }
    //  @Access Private

    createOffer: async (_, { newOffer }, { Offer, Customer }) => {
      try {
        const product = new Offer({
          ...newOffer,
        });
        const customers = await Customer.find({}).select("token -_id");
        let savedPushTokens = customers.map((tok) => tok.token);

        let result = await product.save();
        if (result) {
          const title = "Offer";
          const body = {
            date: new Date(),
            message: "Buy Now to get the best offer",
          };
          handlePushTokens(title, body, savedPushTokens);
          return {
            success: true,
            message: "Offer Created Successfully !",
          };
        } else {
          return {
            success: false,
            message: "Offer Created Not success !",
          };
        }
      } catch (error) {
        console.log(error.message);
        return {
          success: false,
          message: `Offer Created Not success  ! ${error.message}`,
        };
      }
    },
    //Desc Delete Offer
    //Access Private

    deleteOffer: async (_, { id }, { Offer }) => {
      try {
        const offer = await Offer.findOneAndDelete({ _id: id });
        if (!offer) {
          return {
            success: false,
            message: "Offer Deleted Not success",
          };
        }
        return {
          success: true,
          message: "Offer Deleted successfully",
        };
      } catch (error) {
        return {
          success: false,
          message: "Offer Deleted not success",
        };
      }
    },

    //Desc updating the product
    // access private only the admin can delete this

    updateOffer: async (_, { updatedOffer, id }, { Offer }) => {
      try {
        let offer = await Offer.updateOne({ _id: id }, updatedOffer);

        if (!offer) {
          return {
            success: false,
            message: "There is no this record to update ",
          };
        }
        return {
          message: "Updated Offer successfully!",
          success: true,
        };
      } catch (error) {
        return {
          success: false,
          message: "Cannot update this record please contact admin ",
        };
      }
    },
  },
};
