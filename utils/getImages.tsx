import AWS from "aws-sdk";
import { ImageProps } from "./types";

AWS.config.update({
  accessKeyId: process.env.NEXT_AWS_ACCESS_KEY,
  secretAccessKey: process.env.NEXT_AWS_SECRET_ACCESS_KEY,
  region: process.env.NEXT_AWS_REGION,
});
const s3 = new AWS.S3();

export async function getAllImages(): Promise<ImageProps[]> {
  const results = [];
  try {
    let awsRes = await s3.listObjectsV2({ Bucket: process.env.NEXT_AWS_BUCKET_NAME }).promise();
    const objects = awsRes.Contents.filter((img) => !img.Key.includes("blur"));

    objects.sort((a, b) => {
      const aNum = parseInt(a.Key.split("-")[1]);
      const bNum = parseInt(b.Key.split("-")[1]);
      return aNum - bNum;
    });

    for (const object of objects) {
      const url = `https://s3.${process.env.NEXT_AWS_REGION}.amazonaws.com/${process.env.NEXT_AWS_BUCKET_NAME}/${object.Key}`;
      const blurDataUrl = `https://s3.${process.env.NEXT_AWS_REGION}.amazonaws.com/${process.env.NEXT_AWS_BUCKET_NAME}/blur_${object.Key}`;
      results.push(await getImageInfo(url, blurDataUrl, object.Key));
    }
  } catch (error) {
    console.error("Error fetching URLs from S3:", error);
  }

  return results;
}

export async function getImageInfo(url: string, blurDataUrl: string, key: string) {
  const getObjectParams = {
    Bucket: process.env.NEXT_AWS_BUCKET_NAME,
    Key: key,
  };

  try {
    const data = await s3.getObject(getObjectParams).promise();

    const mimeType = data.ContentType;
    const group = data.Metadata?.group;
    const width = data.Metadata?.width;
    const height = data.Metadata?.height;

    return { key, url, blurDataUrl, mimeType, width, height, group };
  } catch (err) {
    console.error("Error retrieving object:", err);
    return null;
  }
}
