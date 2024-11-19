const asyncHandler = (requsetHandler)=>{
    return (req,res,next)=>{
        Promise.resolve(requsetHandler(req,res,next)).catch((error)=> console.error(error))
    }
}
export {asyncHandler}