//Runs when no route matched
export const notFound = (req,res,next)=>{
    res.status(404);
    next(new Error(`Not found - ${req.originalUrl}`));
};

//every error ends up here
export const errorHandler = (err,req,res,next)=>{
    //broken json in the request 400 
if(err.type==="entity.parse.failed"){
    return res.status(400).json({message:"Invalid JSON in request body"});
}
if(err.code===11000){
    return res.status(409).json({message:"This already exists"});
}
//mongoose schema validation failed->400 with msg  
if(err.name === "ValidationError"){
    const messages=Object.values(err.errors).map((e)=>e.message);
    return res.status(400).json({ message:messages.join(", ")});
}
    const statusCode=res.statusCode === 200 ? 500 :res.statusCode;

    res.status(statusCode).json({
        message:err.message,
    });
};

