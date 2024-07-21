import {asyncHandler} from "../utils/asyncHandler.js"
import { User } from "../models/user.models.js"

import { ApiError } from "../utils/ApiError.js"
import jwt from 'jsonwebtoken'


export const verifyJWT = asyncHandler(async(req, _,next)=>{
 try {
   const token=  req.cookies?.accessToken  || req.header("Authorization")?.replace("Bearer ","")
 
   if(!token){
     throw new ApiError(401,"Unauthorized request")
   }
 
  const decodedToken= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
 
  const user=await User.findById(decodedToken?._id).select("-password -refreshToken")
 
  if(!user){
   //next video discuss about frontend
   throw new ApiError (401,"invalid Access Token")
  }
 
  req.user = user;//add user
  next()
 } catch (error) {
  throw new ApiError(401,error?.message || "invalid access token")
 }
})