module.exports = {
  images: {
    domains: ["*.s3.amazonaws.com", "s3.us-east-2.amazonaws.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3.us-east-2.amazonaws.com",
      },
    ],
  },
  publicRuntimeConfig: {
    AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
  },
};
