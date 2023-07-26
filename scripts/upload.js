const { S3Client, PutObjectCommand, HeadObjectCommand, DeleteObjectCommand, ListObjectsV2Command } = require("@aws-sdk/client-s3");
const { readFileSync, readdirSync } = require("fs");
require("dotenv").config();
const imageSize = require("image-size");
const sharp = require("sharp");
const stream = require("stream");

const s3Client = new S3Client({
  region: process.env.NEXT_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_AWS_WRITE_ACCESS_KEY,
    secretAccessKey: process.env.NEXT_AWS_WRITE_SECRET_ACCESS_KEY,
  },
});
const bucketName = process.env.NEXT_AWS_BUCKET_NAME;
const doHardReset = true;
const doUpdate = false;

// Delete all image assets from /images
async function deleteAllImagesFromFolder() {
  try {
    const prefix = "images/";
    const listObjectsCommand = new ListObjectsV2Command({ Bucket: bucketName, Prefix: prefix });
    const { Contents } = await s3Client.send(listObjectsCommand);
    if (!Contents) {
      console.log("Nothing to delete...");
      console.log("...");
      return;
    }

    const deleteCommands = Contents.map((object) => {
      return new DeleteObjectCommand({ Bucket: bucketName, Key: object.Key });
    });

    await Promise.all(deleteCommands.map((command) => s3Client.send(command)));

    console.log("All objects deleted successfully.");
  } catch (error) {
    console.error("Error occurred while deleting objects:", error);
  }
}

// Function to check if a file exists in S3 bucket
async function isFileExist(key, group) {
  try {
    const command = new HeadObjectCommand({ Bucket: bucketName, Key: "images/" + key, region: "us-east-2" });
    const res = await s3Client.send(command);

    // metadata needs updated
    if (res.Metadata.group === group) return false;

    return true;
  } catch (error) {
    if (error.name === "NoSuchKey") {
      return false;
    }
  }
}

// Blur the image
async function blurImage(imagePath) {
  const blurSigma = 110; // Adjust this value as per your requirement
  const outputOptions = { quality: 20 }; // Adjust the quality (0-100) as needed

  const blurredImage = await sharp(imagePath).resize(15, 15).blur(blurSigma).jpeg(outputOptions).toBuffer();
  //new Uint8Array(
  return blurredImage;
}

// Upload blurred base image
async function uploadBlurImage(key, fileContent, metadata) {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: dataURL,
    ContentEncoding: "base64", // Set the content encoding to "base64"
    ContentType: "image/jpeg", // Set the content type to "image/jpeg" or the appropriate type
    Metadata: {
      group: metadata.group,
      height: metadata.height.toString(),
      width: metadata.width.toString(),
    },
  });
  await s3Client.send(command);
}

// Function to convert a buffer to a base64 data URL
function bufferToDataURL(buffer) {
  return `data:image/jpeg;base64,${buffer.toString("base64")}`;
}

// Upload an image
async function uploadImage(key, filePathOrBuffer, metadata) {
  let fileContent;

  if (filePathOrBuffer instanceof Uint8Array) {
    fileContent = filePathOrBuffer;
  } else if (typeof filePathOrBuffer === "string") {
    fileContent = readFileSync(filePathOrBuffer);
  } else {
    throw new Error("Invalid filePathOrBuffer argument. It must be either a string or Uint8Array");
  }

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: fileContent,
    ContentDisposition: "inline",
    ContentType: "image/jpg",
    Metadata: {
      group: metadata.group,
      height: metadata.height.toString(),
      width: metadata.width.toString(),
    },
  });
  await s3Client.send(command);
}

// Upload the json
async function uploadJSON(array) {
  const jsonContent = JSON.stringify(array); // Convert array to JSON string

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: "json/images.json",
    Body: jsonContent,
    ContentType: "application/json", // Specify content type as JSON
  });

  await s3Client.send(command);
  console.log("JSON uploaded successfully.");
}

// Upload all images
async function uploadImagesFromFolder(folderPath) {
  try {
    const files = readdirSync(folderPath);
    let json = [];

    for (const file of files) {
      const filePath = `${folderPath}/${file}`;
      const key = file;
      const dimensions = imageSize(filePath);
      const group = file.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z]/g, "");
      const blurredImageBuffer = await blurImage(filePath);
      const blurredImageURI = bufferToDataURL(blurredImageBuffer);

      const metadata = {
        group: group,
        ar: dimensions.width > dimensions.height ? "3/2" : "2/3",
        width: dimensions.width.toString(),
        height: dimensions.height.toString(),
      };

      json.push({
        key: file,
        url: `https://s3.us-east-2.amazonaws.com/byronmoore.dev-photo-portfolio/images/${file}`,
        blurredUrl: blurredImageURI,
        ...metadata,
      });

      const fileExists = await isFileExist(key, group);

      if (!fileExists) {
        // Upload normal image
        await uploadImage("images/" + key, filePath, metadata);

        console.log(`${file} uploaded successfully.`);
      } else {
        console.log(`${file} already exists in the bucket.`);
      }
    }

    // Upload JSON
    await uploadJSON(json);
  } catch (error) {
    console.error("Error occurred while uploading images:", error);
  }
}

const main = () => {
  const folderPath = "C:/Users/byron/Documents/dev/photography-portfolio-next/Images";

  if (doHardReset) {
    deleteAllImagesFromFolder();
  }

  uploadImagesFromFolder(folderPath);
};

main();
