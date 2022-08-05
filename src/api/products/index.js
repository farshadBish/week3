import express from "express"
import createHttpError from "http-errors"
import multer from "multer"
import { findProductById, findProductByIdAndDelete, findProductByIdAndUpdate, findProducts, saveNewProduct } from "../../lib/db/products.js"
import { findReviewById, findReviewByIdAndDelete, findReviewByIdAndUpdate, saveNewReview } from "../../lib/db/reviews.js"
import { saveProductsImages, sendEmailToUser } from "../../lib/fs/tools.js"
import productsModel from "./model.js"
import reviewsModel from "../reviews/model.js"

const productsRouter = express.Router()

productsRouter.post("/", async (req, res, next) => {
  try {
    const newProduct = new productsModel(req.body) //for validation 
    const {_id} = await newProduct.save()
    res.status(201).send({ _id })
  } catch (error) {
    next(error)
  }
})

productsRouter.get("/", async (req, res, next) => {
  try {
    const products = await productsModel.find()
    res.send(products)
  } catch (error) {
    next(error)
  }
})

productsRouter.get("/:productId", async (req, res, next) => {
  try {
    const product = await productsModel.findById(req.params.productId)
    if (product) {
      res.send(product)
    } else {
      next(createHttpError(404, `Product with id ${req.params.productId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

productsRouter.put("/:productId", async (req, res, next) => {
  try {
    const product = await productsModel.findByIdAndUpdate(req.params.productId , req.body , {new:true , runValidators: true})
    if (product) {
      res.send(product)
    } else {
      next(createHttpError(404, `Product with id ${req.params.productId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

productsRouter.delete("/:productId", async (req, res, next) => {
  try {
   const product = await productsModel.findByIdAndDelete(req.params.productId)
   if(product){
     res.status(204).send(console.log("Product got deleted succesfully!"))

   } else {
    next(createHttpError(404, `Product with id ${req.params.productId} not found!`))
   }
  } catch (error) {
    next(error)
  }
})

// productsRouter.patch("/:productId/image", multer().single("productPicture"), async (req, res, next) => {
//   try {
//     // create a unique name for that picture (name will be something like 3kgarsl60hymte.gif)

//     const fileName = req.params.productId + extname(req.file.originalname)

//     // save the file into public folder

//     // update the product record with the image url
//     const product = await findProductByIdAndUpdate(req.params.productId, { imageUrl: "/img/products/" + fileName })
//     if (product) {
//       await saveProductsImages(fileName, req.file.buffer)
//       // send back a response
//       res.send(product)
//     } else {
//       next(createHttpError(404, `Product with id ${req.params.productId} not found!`))
//     }
//   } catch (error) {
//     next(error)
//   }
// })

productsRouter.post("/:productId/reviews", async (req, res, next) => {
  try {
    const newReview = new reviewsModel(req.body)
    const updatedProduct = await productsModel.findByIdAndUpdate( req.params.productId , {$push : { reviews : newReview } } , { new:true , runValidators:true })
    if (updatedProduct) {
      res.send(updatedProduct)
    } else {
      next(createHttpError(404, `Product with id ${req.params.productId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

productsRouter.get("/:productId/reviews", async (req, res, next) => {
  try {
    const product = await productsModel.findById(req.params.productId)
    if(product){
      res.send(product.reviews)
    } else {
      next(createHttpError(404, `Product with id ${req.params.productId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

productsRouter.get("/:productId/reviews/:reviewId", async (req, res, next) => {
  try {
    const review = await productsModel.findById(req.params.productId)
    if (review) {
      const postedReview = review.reviews.find(aReview => req.params.reviewId === aReview._id.toString())
      if(postedReview){
        res.send(postedReview)
      } else {
        next(createHttpError(404, `Review with id ${req.params.reviewId} not found!`))
      }
    } else {
      next(createHttpError(404, `Product with id ${req.params.reviewId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

productsRouter.put("/:productId/reviews/:reviewId", async (req, res, next) => {
  try {
    const product = await productsModel.findById(req.params.productId)
    if(product){
      const index = product.reviews.findIndex(aReview => aReview._id.toString() === req.params.reviewId)
      if(index !== -1){
        product.reviews[index] = {...product.reviews[index].toObject(),...req.body}
        await product.save()
        res.send(product)
      } else{
        next(createHttpError(404, `Review with id ${req.params.reviewId} not found!`))
      }
    } else {
      next(createHttpError(404, `Product with id ${req.params.reviewId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

productsRouter.delete("/:productId/reviews/:reviewId", async (req, res, next) => {
  try {
    const product = await productsModel.findByIdAndUpdate(
      req.params.productId,
      {$pull : {reviews : { _id: req.params.reviewId } }},
      { new:true , runValidators: true }
    )
    if(product){
      res.send(product)
    } else{
      next(createHttpError(404, `Product with id ${req.params.reviewId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})
productsRouter.post("/register",async (req,res,next) =>{
  try {
    
    const { email } =  req.body

    await sendEmailToUser(email)
    
    res.send({ message: "User email sent!"})

  } catch (error) {
    next(error)
  }
})

export default productsRouter
