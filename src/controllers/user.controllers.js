import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser = asyncHandler( async(req,res)=>{
  //get user details from backend
  //validation -check not empty | format
  //check if user already exists: username,email
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create user object  - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return responce


 const {fullName,email,username,password}= req.body
 console.log('email:', email);
    
//  if(fullName ===""){
//     throw new ApiError(400,'fullname is required')
//  }

    if(
        [fullName,email,username,password].some((field)=>field?.trim()/*field asel ta tyala trim kar*/ ==='')// ani te empty asel ta tyla true lihi return true
    ){
        throw new ApiError(400,'All fields are required')
    }
    //check if user already exists: username,email

    const existedUser=User.findOne({
        $or:[{username},{email}]
    })
        if(existedUser){
            throw new ApiError(409," User with Email or Username already exists")
        }
// check for images, check for avatar
       const avatarLocalPath= req.files?.avatar[0]?.path/*give access by mulder|[0] first property*/
       const coverImageLocalPath= req.files?.coverImage[0]?.path/*mile na mile ? */

       if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required")
       }
       // upload them to cloudinary, avatar

       const avatar = await uploadOnCloudinary(avatarLocalPath)
       const coverImage = await uploadOnCloudinary(coverImageLocalPath)

       if(!avatar){
        throw new ApiError(400,"Avatar file is required")
       }
    


      const user= await User.create({
        fullName,
        avatar:avatar.url,
        converImage:coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
       })

       const createdUser=await User.findById(user._id).select(
        '-password -refreshToken'
       )

       if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user")
       }

       return res.status(201).json(
        new ApiResponse(200,createdUser,'User registered Successfully')
       )
})


export default registerUser