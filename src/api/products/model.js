import mongoose from "mongoose";

const { Schema , model } = mongoose;

const productsSchema = new Schema(
    {
        name: {type: String , required: true},  //REQUIRED
        description: {type:String , required : true , min:10}, //REQUIRED
        brand: {type:String , required: true}, //REQUIRED
        imageUrl: {type:String , required: true}, //REQUIRED
        price: {type:Number , required: true}, //REQUIRED
        category: {type:String},
        reviews: [{comment:String, rate: Number}]
    },
    {
        timestamps: true
    }
)

export default model("Product",productsSchema)