import { v2 as cloudinary } from "cloudinary";
import env from "./env";

console.log("Cloudinary cloud name:", env.cloudinary.cloudName);
console.log(
  "Cloudinary API key exists:",
  !!env.cloudinary.apiKey
);
console.log(
  "Cloudinary API secret exists:",
  !!env.cloudinary.apiSecret
);

cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
});

cloudinary.api.ping((error, result) => {
  if (error) {
    console.error(
      "❌ Cloudinary connection failed:",
      error
    );
    return;
  }

  console.log(
    "✅ Cloudinary connection successful:",
    result
  );
});

export default cloudinary;