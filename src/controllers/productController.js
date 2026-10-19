import mongoose from 'mongoose';
import Product from '../models/Product.js';
const allowed=['name','sku','category','price','quantity','reorderLevel','supplier','notes'];
function body(req){
 if(!req.body||Array.isArray(req.body)||typeof req.body!=='object')throw Object.assign(new Error('Provide a JSON object'),{status:400});
 if(Object.keys(req.body).some(k=>!allowed.includes(k)))throw Object.assign(new Error('Unknown product fields'),{status:400});
 return req.body;
}
export function validateId(req,res,next){if(!mongoose.isObjectIdOrHexString(req.params.id))return res.status(400).json({message:'Invalid product ID'});next();}
export async function list(req,res){res.json({data:await Product.find().sort({createdAt:-1}).lean()});}
export async function read(req,res){const p=await Product.findById(req.params.id);if(!p)return res.status(404).json({message:'Product not found'});res.json({data:p});}
export async function create(req,res){res.status(201).json({data:await Product.create(body(req))});}
export async function update(req,res){const values=body(req);if(!Object.keys(values).length)return res.status(400).json({message:'Provide at least one field'});const p=await Product.findByIdAndUpdate(req.params.id,{$set:values},{new:true,runValidators:true});if(!p)return res.status(404).json({message:'Product not found'});res.json({data:p});}
export async function remove(req,res){const p=await Product.findByIdAndDelete(req.params.id);if(!p)return res.status(404).json({message:'Product not found'});res.status(204).end();}
