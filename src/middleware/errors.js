const middleware = (error ,req,res,next)=>{
    let errorObj;
    if(typeof error.getErrorJson === 'function'){
        errorObj=error.getErrorJson()
    }else{
        errorObj={
            status:500,
            name:"UnknownError",
            message:"Unknown Error"
        }
    }
    res.status(errorObj.status).json(errorObj);
}
module.exports=middleware;