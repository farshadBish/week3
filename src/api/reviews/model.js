import mongoose from "mongoose";

const {Schema , model} = mongoose;

const reviewsSchema = new Schema(
    {
        comment: {type:String , required: true}, //REQUIRED
        rate: {type:Number , required: true , max:5}, //REQUIRED, max 5
    },
    {
        timestamps : true
    }
)
export default model("review",reviewsSchema)