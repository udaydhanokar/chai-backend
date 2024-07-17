import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'  //nodejs file




cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret:process.env.CLOUDINARY_API_SECRET // Click 'View Credentials' below to copy your API secret
});





    // Configuration
    cloudinary.config({ 
        cloud_name: 'dhizzcvba', 
        api_key: '356155323162194', 
        api_secret: '<your_api_secret>' // Click 'View Credentials' below to copy your API secret
    });

    // Upload an image
    const uploadOnCloudinary = async (localFilePath/*parameter*/)=>{
        try{
            if(!localFilePath) return null
            //upload the file on cloudinary
          const responce= await cloudinary.uploader
            .upload(localFilePath,{
                    resource_type:'auto'
                }
            )
             //file has been uploaded successfully
             console.log('file is upload on cloudinary',responce.url);
             return response;
        }catch(error){
            fs.unlinkSync(localFilePath)//remove the locally saved tempporary file as the upload operation got failed
            return null;
        }
    }

    export {uploadOnCloudinary}


    

    