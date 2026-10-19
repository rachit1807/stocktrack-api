import mongoose from 'mongoose';
export const categories=['Electronics','Workspace','Accessories','Lifestyle'];
const schema=new mongoose.Schema({
 name:{type:String,required:true,trim:true,minlength:2,maxlength:100},
 sku:{type:String,required:true,trim:true,uppercase:true,match:/^[A-Z0-9-]{3,24}$/,unique:true},
 category:{type:String,enum:categories,required:true},
 price:{type:Number,required:true,min:0,max:10000000},
 quantity:{type:Number,required:true,min:0,max:1000000,validate:{validator:Number.isInteger,message:'Quantity must be a whole number'}},
 reorderLevel:{type:Number,default:10,min:0,max:1000000,validate:{validator:Number.isInteger,message:'Reorder level must be a whole number'}},
 supplier:{type:String,trim:true,maxlength:100,default:''},notes:{type:String,trim:true,maxlength:500,default:''}
},{timestamps:true,strict:'throw'});
export default mongoose.model('Product',schema);
