import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import Carousel from "../../components/Carousel";
import type { ImageProps } from "../../utils/types";
import { getAllImages } from "../../utils/getImages";
import Script from "next/script";

const Home: NextPage = ({ currentPhoto }: { currentPhoto: ImageProps }) => {
  const router = useRouter();
  const { photoId } = router.query;
  let index = Number(photoId);
  let pGroup = currentPhoto?.group.charAt(0).toUpperCase() + currentPhoto?.group.slice(1).toLowerCase();

  return (
    <>
      <Head>
        <title>Byron Jaris Photography</title>
        <meta property="og:image" content={currentPhoto?.url} />
        <meta property="og:title" content="Photography Portfolio | Byron Moore" />
        <meta property="og:description" content={`${pGroup} photograph taken by Byron J Moore.`} />

        <meta name="twitter:image" content={currentPhoto?.url} />
      </Head>

      {/*<!-- Google tag (gtag.js) -->*/}
      <Script strategy="afterInteractive" async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}></Script>
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                page_path: window.location.pathname,
              });
            `,
        }}
      ></Script>
      <main className="mx-auto max-w-[1960px] p-4">
        <Carousel currentPhoto={currentPhoto} index={index} />
      </main>
    </>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async (context) => {
  const results: ImageProps[] = await getAllImages();
  const currentPhoto = results.find((img) => img.key === context.params.photoId);

  return {
    props: {
      currentPhoto: {
        ...currentPhoto,
        id: results.indexOf(currentPhoto),
      },
    },
  };
};

export async function getStaticPaths() {
  const results = await getAllImages();

  let fullPaths = [];
  for (let i = 0; i < results.length; i++) {
    fullPaths.push({ params: { photoId: results[i].key.toString() } });
  }

  return {
    paths: fullPaths,
    fallback: false,
  };
}
