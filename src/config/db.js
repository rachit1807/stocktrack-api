import mongoose from 'mongoose';
export async function connectDatabase(uri){
 if(!uri)throw new Error('Set MONGODB_URI or use npm run dev for a temporary local demo.');
 mongoose.connection.on('connected',()=>console.info('MongoDB connected'));
 mongoose.connection.on('disconnected',()=>console.info('MongoDB disconnected'));
 mongoose.connection.on('error',()=>console.error('MongoDB connection error'));
 await mongoose.connect(uri,{serverSelectionTimeoutMS:10000});
}
