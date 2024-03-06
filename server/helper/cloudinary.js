import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_API_KEY, 
  api_secret: process.env.CLOUD_API_SECRET, 
});


  export default function cloudinaryUploadImage(images) {

    return new Promise((resolve, reject) => {
      const uploadPromises = [];
  
      for (const image of images) {
        uploadPromises.push(
          new Promise((resolve, reject) => {
            cloudinary.uploader.upload(image, (error, result) => {
              if (result && result.secure_url) {
                resolve(result.secure_url);
              } else {
                reject(error);
              }
            });
          })
        );
      }
  
      // Upload all images in parallel
      Promise.all(uploadPromises).then(resolve).catch(reject);
    });
  }
  