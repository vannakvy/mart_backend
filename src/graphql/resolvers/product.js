import { NewProductRules } from "../../validations";
import { ApolloError } from "apollo-server-express";

const ProductLabels = {
  docs: "products",
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
    //@Desc get all the products
    // @Access private

    allProducts: async (_, {type}, { Product }) => {
      let products;
     if(type!==""){
      products = await Product.find({'category':type})
     }else{
      products = await Product.find();
     }
      return products;
    },
// @Desc get ttotal number of product 
//@access private


    totalProduct: async (_, {}, { Product }) => {
    let  total = await Product.countDocuments({});
      return total;
    },

    //@Desc get one product by Id
    //Access public

    getProductById: async (_, { id }, { Product }) => {
      let product = await Product.findById(id).populate("review.user");
      return product;
    },
    //Desc get the product with the pagination
    //Access public
    getProductsWithPagination: async (_, { page, limit }, { Product }) => {
      const options = {
        page: page || 1,
        limit: limit || 10,
        customLabels: ProductLabels,
        sort: {
          createdAt: -1,
        },
      };
      let products = await Product.paginate({}, options);
      return products;
    },

    //Desc get the product with the pagination and by category
    //Access public

    getProductsWithPaginationCategory: async (
      _,
      { page, limit, category },
      { Product }
    ) => {
      const options = {
        page: page || 1,
        limit: limit || 10,
        customLabels: ProductLabels,
        sort: {
          createdAt: -1,
        },
      };
      let products = await Product.paginate({ category: category }, options);
      return products;
    },

    //Desc get the top reviewed products
    //Access public

    getTopProducts: async (_, {}, { Product }) => {
      const products = Product.find({}).sort({ rating: -1 }).limit(5);
      return products;
    },
  },
  Mutation: {
    //   @DESC to Create new Product
    //  @Params newProduct{
    //         productName!,
    //         category!,
    //         productImage!
    // description!
    //     }
    //  @Access Private

    createProduct: async (_, { newProduct }, { Product }) => {
      const { productName, category, productImage, description } = newProduct;
      // validate the incoming new product argument
      await NewProductRules.validate(
        {
          productName,
          productImage,
          category,
          description,
        },
        {
          abortEarly: false,
        }
      );
      const product = new Product({
        ...newProduct,
      });

      let result = await product.save();
      if (result) {
        return {
          success: true,
          message: "Product Created Successfully !",
        };
      }
    },
    //Desc Delete Product
    //Access Private

    deleteProduct: async (_, { id }, { Product }) => {
      try {
        const product = await Product.findOneAndDelete({ _id: id });
        if (!product) {
          throw new Error("Unautherized Access");
        }
        return {
          success: true,
          message: "Product Deleted successfully",
        };
      } catch (error) {
        throw new ApolloError(error.message);
      }
    },
//Desc Updating the product image 
//@acess private 

updateproductImage:async (_, {id,file},{Product})=>{
  try {
    await Product.update({ _id: id }, { $set: { productImage: file } });
    return {
      message: "Updated the product Image succesfully",
      success: true,
    };
  } catch (error) {
    return {
      message: "Cannot update the Image ",
      success: false,
    };
  }
},
    //Desc updating the product
    // access private only the admin can delete this

    updateProduct: async (_, { updatedProduct, id }, { Product }) => {
      try {
        const { productName, productImage, category, description } =
          updatedProduct;
        //validate the incoming updated data
        await NewProductRules.validate(
          {
            productName,
            productImage,
            category,
            description,
          },
          {
            abortEarly: false,
          }
        );

        let product = await Product.findOneAndUpdate(
          { _id: id },
          updatedProduct
        );

        if (!product) {
          throw new ApolloError("There is not this kind of product");
        }
        return {
          message: "Updated Product successfully!",
          success: true,
        };
      } catch (error) {
        throw new ApolloError(error.message);
      }
    },

    //@Desc create review of a specific product
    // Access Private (only logined user )

    reviewProduct: async (_, { newReview, id, user_id }, { Product, User }) => {
      const { rating, comment } = newReview;
      const product = await Product.findById(id);
      const currentUser = await User.findById(user_id);

      if (product) {
        const alreadyReviewed = product.review.find(
          (r) => r.user.toString() === currentUser._id.toString()
        );
        if (alreadyReviewed) {
          return {
            message: "You have alread review this product",
            success: false,
          };
        }

        const review = {
          name: currentUser.username,
          rating: Number(rating),
          comment,
          user: currentUser._id,
        };
        product.review.push(review);
        product.numOfReview = product.review.length;
        product.rating =
          product.review.reduce((acc, item) => item.rating + acc, 0) /
          product.review.length;
        await product.save();
        return {
          message: "Review created",
          success: true,
        };
      }
    },

    //Desc Delete Comment and review
    //@access Private
    deleteReview: async (_, { id, user_id }, { Product }) => {
      try {
        //check if the comment exist or not
        const res = await Product.findOne({ "review._id": id });
        const hasThisReview = res.review.find(
          (r) => r.user.toString() === user_id.toString()
        );

        if (!hasThisReview) {
          return {
            success: false,
            message: "Cannot Delete this comment!",
          };
        }
        // //
        await res.review.id(hasThisReview._id).remove();
        await res.save()
        return {
          success: true,
          message: "Delete Comment Successfully",
        };

      } catch (error) {
        return {
          success: false,
          message: "Cannot Delete this comment!",
        };
      
      }
    },
    //Desc Update product price by id
    //access private
    updateProductPrice: async (_, { price, id }, { Product }) => {
      try {
        await Product.update({ _id: id }, { $set: { price: price } });

        return {
          message: "Updated the product price succesfully",
          success: true,
        };
      } catch (error) {
        return {
          message: "Cannot update the price ",
          success: false,
        };
      }
    },

    updateProductCountInstock: async (_, { id, countInStock }, { Product }) => {
      try {
        await Product.update(
          { _id: id },
          { $set: { countInStock: countInStock } }
        );

        return {
          message: "Updated the product countInStock succesfully",
          success: true,
        };
      } catch (error) {
        return {
          message: "Cannot update the countInStock ",
          success: false,
        };
      }
    },
  },
};
