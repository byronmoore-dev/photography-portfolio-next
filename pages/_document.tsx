import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta name="description" content="Photography Portfolio by Byron J Moore." />

          <meta property="og:title" content="Photography Portfolio | Byron Moore" />
          <meta property="og:description" content="Photograph taken by Byron J Moore." />
          <meta property="og:image" content="https://s3.us-east-2.amazonaws.com/byronmoore.dev-photo-portfolio/images/natural-3.jpg" />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Photography taken by Byron M" />
          <meta name="twitter:description" content="Photographs by Byron" />
          <meta name="twitter:image" content="https://s3.us-east-2.amazonaws.com/byronmoore.dev-photo-portfolio/images/natural-3.jpg" />

          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
          <meta name="theme-color" content="#ffffff" />
        </Head>
        <body className="bg-neutral-900 antialiased">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
