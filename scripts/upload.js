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

async function deleteAllObjectsFromBucket() {
  try {
    const listObjectsCommand = new ListObjectsV2Command({ Bucket: bucketName });
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
    const command = new HeadObjectCommand({ Bucket: bucketName, Key: key, region: "us-east-2" });
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

async function resizeAndBlurImage(imagePath) {
  const blurSigma = 100; // Adjust this value as per your requirement
  const outputOptions = { quality: 50 }; // Adjust the quality (0-100) as needed

  const blurredImage = await sharp(imagePath).blur(blurSigma).jpeg(outputOptions).toBuffer();

  return new Uint8Array(blurredImage);
}

async function uploadFile(key, filePathOrBuffer, metadata) {
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

async function uploadImagesFromFolder(folderPath) {
  try {
    const files = readdirSync(folderPath);

    for (const file of files) {
      const filePath = `${folderPath}/${file}`;
      const key = file;
      const dimensions = imageSize(filePath);
      const group = file.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z]/g, "");

      const metadata = {
        group: group,
        width: dimensions.width.toString(),
        height: dimensions.height.toString(),
      };

      const fileExists = await isFileExist(key, group);
      if (!fileExists) {
        // Upload normal image
        console.log(`Uploading ${file}...`);
        await uploadFile(key, filePath, metadata);

        // Upload blurred image
        const blurredImageBuffer = await resizeAndBlurImage(filePath);
        const blurredKey = `blur_${key}`;
        await uploadFile(blurredKey, blurredImageBuffer, metadata);
        console.log(`${file} and ${blurredKey} uploaded successfully.`);
      } else {
        console.log(`${file} already exists in the bucket.`);
      }
    }
  } catch (error) {
    console.error("Error occurred while uploading images:", error);
  }
}

// Replace the folder path with the actual path of the folder containing images
const folderPath = "C:/Users/byron/Documents/dev/nextjs-image-gallery/Images";

if (doHardReset) {
  deleteAllObjectsFromBucket();
}
uploadImagesFromFolder(folderPath);
