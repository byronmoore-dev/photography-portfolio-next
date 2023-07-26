import { S3Client, GetObjectCommand, GetObjectCommandOutput } from "@aws-sdk/client-s3";
import { Readable } from "stream";
import { ImageProps } from "./types";

// Initialize the Amazon S3 client
const s3Client = new S3Client({
  region: process.env.NEXT_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_AWS_ACCESS_KEY,
    secretAccessKey: process.env.NEXT_AWS_SECRET_ACCESS_KEY,
  },
});
const bucketName = process.env.NEXT_AWS_BUCKET_NAME;

export async function getAllImages(): Promise<ImageProps[]> {
  const getCommand = new GetObjectCommand({
    Bucket: bucketName,
    Key: "json/images.json",
  });

  const response: GetObjectCommandOutput = await s3Client.send(getCommand);

  if (typeof (response.Body as Readable).on === "function") {
    return new Promise((resolve, reject) => {
      let chunks: any[] = [];

      (response.Body as Readable)
        .on("data", (chunk) => chunks.push(chunk))
        .on("end", () => {
          const result: string = Buffer.concat(chunks).toString("utf-8");
          resolve(JSON.parse(result));
        })
        .on("error", reject);
    });
  } else {
    throw new Error("Cannot read the stream");
  }
}
