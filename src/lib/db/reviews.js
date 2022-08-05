import createHttpError from "http-errors"
import uniqid from "uniqid"
import { getProducts, writeProducts } from "../fs/tools.js"
import { findProductById } from "./products.js"

export const saveNewReview = async (productId, newReviewData) => {
  const products = await getProducts()
  const index = products.findIndex(product => product.id === productId)
  if (index !== -1) {
    products[index].reviews.push({ ...newReviewData, id: uniqid(), createdAt: new Date() })
    await writeProducts(products)

    return products[index]
  } else {
    // if index is -1 the product is not found
    return null
  }
}

export const findReviewById = async (productId, reviewId) => {
  const { reviews } = await findProductById(productId)

  const foundReview = reviews.find(review => review.id === reviewId)

  return foundReview
}

export const findReviewByIdAndUpdate = async (productId, reviewId, updates) => {
  const products = await getProducts()
  const index = products.findIndex(product => product.id === productId)
  if (index !== -1) {
    const reviewIndex = products[index].reviews.findIndex(review => review.id === reviewId)
    if (reviewIndex !== -1) {
      products[index].reviews[reviewIndex] = {
        ...products[index].reviews[reviewIndex],
        ...updates,
        updatedAt: new Date(),
      }

      await writeProducts(products)
      return products[index].reviews[reviewIndex]
    } else {
      throw new createHttpError(404, `Review with id ${reviewId} not found!`)
    }
  } else {
    throw new createHttpError(404, `Product with id ${productId} not found!`)
  }
}

export const findReviewByIdAndDelete = async (productId, reviewId) => {
  const products = await getProducts()
  const index = products.findIndex(product => product.id === productId)
  if (index !== -1) {
    const reviewIndex = products[index].reviews.findIndex(review => review.id === reviewId)
    if (reviewIndex !== -1) {
      products[index].reviews = products[index].reviews.filter(review => review.id !== reviewId)
      await writeProducts(products)
    } else {
      throw new createHttpError(404, `Review with id ${reviewId} not found!`)
    }
  } else {
    throw new createHttpError(404, `Product with id ${productId} not found!`)
  }
}
