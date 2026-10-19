export function errorHandler(err,req,res,next){
 if(err.name==='ValidationError')return res.status(400).json({message:'Please check your product details',errors:Object.fromEntries(Object.entries(err.errors).map(([k,v])=>[k,v.message]))});
 if(err.code===11000)return res.status(409).json({message:'That SKU already exists. Use a unique SKU.'});
 if(['CastError','StrictModeError'].includes(err.name))return res.status(400).json({message:'Invalid field value'});
 const status=err.status||500;if(status>=500)console.error('Request failed:',err.name);
 res.status(status).json({message:status>=500?'Something went wrong. Please try again.':err.message});
}
