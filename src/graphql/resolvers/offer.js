import { NewProductRules } from "../../validations";
import { ApolloError } from "apollo-server-express";

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

    allOffers: async (_, {type,keyword}, { Offer }) => {
    let offers = Offer.find()
        return offers 
    },

    //@Desc get one offer by id 
    //Access public

    getOfferById: async (_, { id }, { Offer }) => {
      let offers = await Offer.findById(id);
      return offers;
    },
    //Desc get the offer with the pagination
    //Access public
    getOffersWithPagination: async (_, { page, limit,keyword="" }, { Offer }) => {
      const options = {
        page: page || 1,
        limit: limit || 10,
        customLabels: OfferLabels,
        sort: {
          createdAt: -1,
        },
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

    createOffer: async (_, { newOffer }, { Offer }) => {

        try {
            const product = new Offer({
                ...newOffer,
              });
        
              let result = await product.save();
              if (result) {
                return {
                  success: true,
                  message: "Offer Created Successfully !",
                };
              }else{
                return {
                    success: false,
                    message: "Offer Created Not success !",
                  };
              }
        } catch (error) {
            return {
                success: false,
                message: "Offer Created Not success !",
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

    updateOffer: async (_, { updatedOffer, id }, { Product }) => {
      try {
     
      

        let offer = await Product.updateOne(
          { _id: id },
          updatedOffer
        );

        if (!offer) {                                  
            return {
                success: false,               
                message: "There is no this record to update ",
              };
        }                                                                                                                                                 
        return {
          message: "Updated Product successfully!", 
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
