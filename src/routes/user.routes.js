import {Router} from 'express'
import  {registerUser, loginUser, logoutUser,refreshAccessToken,changeCurrentPassword, getCurrentUser, updateAccoutDetails ,updateUserAvatar, updateUserCoverImage, getUserChannelProfile, getWatchHistory} from '../controllers/user.controllers.js'
import { upload } from '../middlewares/mulder.middlewares.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'
const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount : 1
        }

    ]),
    registerUser
)


    router.route("/login").post(loginUser)

//secured routes
    router.route ("/logout").post(verifyJWT, logoutUser)
    router.route ("/refresh-token").post(refreshAccessToken)
    router.route("/change-password").post(verifyJWT,changeCurrentPassword)
    router.route("/curret-user").get(verifyJWT,getCurrentUser),
    router.route("/update-account").patch(verifyJWT,updateAccoutDetails)//ethe galti na pn post noko thu nahi ta sagde update haoil
    router.route("/avatar").patch(verifyJWT,upload.single('avatar'),updateUserAvatar)
    router.route("/coverImage").patch(verifyJWT,upload.single('coverImage'),updateUserCoverImage)
    router.route('/c/:username').get(verifyJWT,getUserChannelProfile)
    router.route("/history").get(verifyJWT,getWatchHistory)
export default router
