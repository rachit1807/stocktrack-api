import mongoose from 'mongoose';
import {connectDatabase} from '../config/db.js';
import Product from '../models/Product.js';
import {sampleData} from './sampleData.js';
try{await connectDatabase(process.env.MONGODB_URI);for(const p of sampleData)await Product.updateOne({sku:p.sku},{$setOnInsert:p},{upsert:true,runValidators:true});console.info('Sample data added; existing products preserved.');}catch{console.error('Seeding failed. Check connection and sample data.');process.exitCode=1;}finally{await mongoose.disconnect();}
