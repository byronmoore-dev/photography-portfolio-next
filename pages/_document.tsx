import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta name="description" content="Photography taken by Byron J Moore." />
          <meta property="og:site_name" content="photography.byronjaris.com" />
          <meta property="og:description" content="Photography taken by Byron J Moore." />
          <meta property="og:title" content="Photography by Byron M." />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Photography taken by Byron M" />
          <meta name="twitter:description" content="Photographs by Byron" />
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
