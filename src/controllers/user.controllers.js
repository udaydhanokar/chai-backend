
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from 'jsonwebtoken'


const generateAccessAndRefreshTokens= async(userId)=>{
    try {
        console.log("hi")
      const user=  await User.findById(userId)
      const refreshToken=user.generateRefreshToken()
      const accessToken=user.generateAccessToken()

      user.refreshToken=refreshToken  //user ke andar add karva divar refresh token ko
      const x=await user.save({validateBeforeSave:false})
        // console.log(x)
        return{accessToken,refreshToken}

    

    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating refresh and access token")
    }
}

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

    const existedUser=await User.findOne({
        $or:[{username},{email}]
    })
        if(existedUser){
            throw new ApiError(409," User with Email or Username already exists")
        }
// check for images, check for avatar
        console.log(req.files,"hi")
       const avatarLocalPath= req.files?.avatar[0]?.path/*give access by mulder|[0] first property*/
       //const coverImageLocalPath= req.files?.coverImage[0]?.path/*mile na mile ? */
        let coverImageLocalPath;
        if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
            coverImageLocalPath = req.files.coverImage[0].path
        }
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

    const loginUser = asyncHandler(async(req,res)=>{
         //verification ki email|username ani password match kara lagel
        // error dedeo agar match nahi karte honge to
        // agar match karte ho to unhe entry de do kiwa adar ke page pe le chalo


    // req body -> data
    // username or email 
    // find the user
    // password check
    // access and refresh token generate
    // send cookie 

           const {email,password,username} =req.body
            console.log(email)

                if (!username && !email) {
                    throw new ApiError(400, "username or email is required")
                }

        // alternative      
        //    if(!(email || username)){
        //     throw new ApiError(400,"username or email is required")
        //    }

         const user=  await User.findOne({
            $or: [{username},{email}]
            })
        
        if(!user){
            throw new ApiError(404,"User does not exits"
            )
        }
console.log(password)



        const isPasswordValid=await user.isPasswordCorrect(password)
        console.log(isPasswordValid)

        if(!isPasswordValid){
            throw new ApiError (401,"Invalid user credentials")
        }

        const {accessToken,refreshToken}=await  generateAccessAndRefreshTokens(user._id)


        const loggedInUser = await User.findById(user.id).select("-password -refreshToken")

        //before cookie
        const options = {
            httpOnly:true,
            secure:true
        }

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200, 
                    {
                        user: loggedInUser, accessToken, refreshToken
                    },
                    "Access token refreshed "
                )
            )

      
    })


//----------------------
    const logoutUser = asyncHandler(async(req,res)=>{
        //clear cookie
        //clear refreshtoken
      //  User.findById user nahi geta yet kara yarcha sarckha req.body nahi ahe
       
       await User.findByIdAndUpdate(
            req.user._id,
            {
                $set:{
                    refreshToken:undefined
                }
            },
            {
                new:true
            }

        )
        const options = {
            httpOnly:true,
            secure:true
        }
        return res
        .status(200)
        .clearCookie("accessToken",options)
        .clearCookie("refreshToken",options)
        .json(new ApiResponse(200,{},"User logged Out"))

        })

        
        const refreshAccessToken = asyncHandler(async(req,res)=>{
            //cookies se refreshtoken access karna
            const incomingRefreshToken =req.cookies.refreshToken || req.body.refreshToken

            if(!incomingRefreshToken){
                throw new ApiError(401,"unauthorized request")
            }
try {
    
               const  decodedToken = jwt.verify(
                incomingRefreshToken,REFRESH_TOKEN_SECRET
               )
    
               const user=await User.findById(decodedToken?._id)
    
               if(!user){
                    throw new ApiError(401,"Invalid refresh token")
               }
    
               if(incomingRefreshToken !== user?.refreshToken){
                    throw new ApiError(401,"Refresh token is expired or used")
               }
    
               const options ={
                httpOnly:true,
                secure:true
               }
              const {accessToken,newrefreshToken}=await generateAccessAndRefreshTokens(user._id)
    
              return res
              .status(200)
              .cookie("accessToken",accessToken,options)
              .cookie("refreshToken",newrefreshToken,options)
              .json(
                new ApiResponse(
                    200,
                    {accessToken,refreshToken,newrefreshToken},
                    "Access token refreshed"
                )
              )
    
} catch (error) {
        throw new ApiError(401,error?.message || "invalid refresh token" )
}

        })


        

  
// export default registerUser
export {
    loginUser,
    logoutUser,
    registerUser,
    refreshAccessToken
}