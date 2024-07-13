const asyncHandler = (requesHandler) => {
    (req,res,next)=>{
        Promise.resolve(requesHandler(req,res,next)).catch((err)=>next(err))
    }
}
    
export {asyncHandler}




// const asyncHandler = ()=>{}
// const asyncHandler = (func)=>{()=>{}}
// const asyncHandler = (func)=> ()=>{}
// const asyncHandler = (func)=>async ()=>{}

    // const asyncHandler = (fu)=> async (req,res,next)=>{
    //     try{
    //         await fn(req,res,next)
    //     } catch(error){
    //         res.status(error.code || 500).json({
    //             success:false,
    //             message: error.message
    //         })
    //     }
    // }