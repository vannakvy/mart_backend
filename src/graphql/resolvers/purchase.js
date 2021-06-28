import { ApolloError } from "apollo-server-express";

// I am not validate this purchase
// import { NewPurchaseRules } from "../../validations";
import user from "../typeDefs/user";

const PurchaseLabels = {
  docs: "purchases",
  limit: "perPage",
  nextPage: "next",
  prevPage: "prev",
  meta: "paginator",
  page: "currentPage",
  pagingCounter: "slNo",
  totalDocs: "totalPurchase",
  totalPages: "totalPages",
};
export default {
  Query: {
    //   @DESC get all the Purchases
    //   @access private
    allPurchases: async (_, {}, { Purchase }) => {
      let purchases = await Purchase.find()
        .populate("product")
        .populate("supplier");
      return purchases;
    },

    budgets: async (_, {}, { Purchase }) => {
      let total = await   Purchase.aggregate([ { $group: { _id: "   ", TotalSum: { $sum: "$price" } } } ]);
      return {
        id: total[0]._id,
        sum: total[0].TotalSum
      };
    },


    getPurchaseById: async (_, { id }, { Purchase }) => {
      let purchase = Purchase.findById(id)
        .populate("product")
        .populate("supplier");
      return purchase;
    },

    // @DESC get the Purchases by Pagination Variable
    // @access Private
    getPurchaseWithPagination: async (_, { page, limit,keyword }, { Purchase }) => {
      const options = {
        page: page || 1,
        limit: limit || 10,
        customLabels: PurchaseLabels,
        sort: {
          createdAt: -1,
        },
        populate: ["product", "supplier"],
      };

    // let query={'product.productName':{ $regex: key, $options: 'i' }}
   let query = { 'product.productName': { $regex:keyword, $options: 'si' }}
      let purchases = await Purchase.paginate(query, options);
      return purchases;
    },
  },

  Mutation: {
    //   @DESC to Create new Purchase
    //  @Params newPurchase{
    //         productid!,
    //         supplier id!,
    //         price
    // qty
    //     }
    //  @Access Private

    createPurchase: async (_, { newPurchase }, { Purchase, Product }) => {
      const { product, supplier, price, qty } = newPurchase;
      const purchase = new Purchase({
        product,
        supplier,
        price,
        qty,
      });
      // save the Purchase

      if (product) {
        await Product.findByIdAndUpdate(
          product,
          {
            $inc: {
              countInStock: qty,
            },
          },
          { new: true }
        );
      } else {
        return {
          success: false,
          message: "Cannot create due to the product availability",
        };
      }

      let result = await purchase.save();

      if (!result) {
        return {
          message: "Puchase created successfully",
          success: true,
        };
      }
      return {
        message: "Puchase created successfully",
        success: true,
      };
    },
    //  @DESC to Update an Existing Purchase by ID
    //      @Params updatedPurchase {
    //             firstName!,
    //             lastName!,
    //             let
    //         }
    //  @Access Private
    updatePurchase: async (_, { updatedPurchase, id }, { Purchase,Product }) => {
      try {

        // await Product.findByIdAndUpdate(product, {
        //   $inc: {
        //     countInStock: qty,
        //   },
        // },{new:true});
const oldPurchase = await Product.findById(updatedPurchase.product)
const purchase = await Purchase.findById(id);

if(oldPurchase && purchase){
  const newQty =  parseInt(updatedPurchase.qty) -parseInt(purchase.qty)
          await Product.findByIdAndUpdate(updatedPurchase.product, {
          $inc: {
            countInStock: newQty,
          },
        },{new:true});
}else{
  return {
    success: false,
    message:"Cannot update"
  }
}

// if(oldPurchase){
//    if(oldPurchase.countInStock > updatedPurchase.qty){
//       // await Product.findByIdAndUpdate(updatedPurchase.product, {
//       //     $inc: {
//       //       countInStock: -updatedPurchase.qty,
//       //     },
//         // },{new:true});
//    }
// }

        let p = await Purchase.findOneAndUpdate(
          {
            _id: id,
            author: user.id,
          },
          updatedPurchase,
          {
            new: true,
          }
        );
        if (!p) {
          throw new Error("There is no this purchase");
        }
        // populate the Author Fields
        return {
          success: true,
          message: "Purchase Updated Successfully !",
        };
      } catch (error) {
        throw new ApolloError(error.message);
      }
    },
    //    @DESC to Delete an Existing Purchase by ID
    //    @Params id!
    //    @Access Private

    deletePurchase: async (_, { id }, { Purchase,Product }) => {
      try {

        
        const purchase = await Purchase.findById(id);
        const product = await Product.findById(purchase.product)

if(product && purchase){

  if(product.countInStock < purchase.qty){
      return {
        message:"Cannot not delete the values in stock is less than the value you want to delete ",
        success: false
      }
  }else{
    await Product.findByIdAndUpdate(purchase.product, {
      $inc: {
        countInStock: parseInt(-purchase.qty),
      },
    },{new:true});
    await Purchase.findOneAndDelete({
      _id: id,
    });
  
    return {
      success: true,
      message: "Post Deleted Successfully",
    };
  }



      }
     
      } catch (error) {
        throw new ApolloError(error.message);
      }
    },
  },
};
