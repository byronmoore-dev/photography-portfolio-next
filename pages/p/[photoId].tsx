import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import Carousel from "../../components/Carousel";
import type { ImageProps } from "../../utils/types";
import { getAllImages } from "../../utils/getImages";

const Home: NextPage = ({ currentPhoto }: { currentPhoto: ImageProps }) => {
  const router = useRouter();
  const { photoId } = router.query;
  let index = Number(photoId);

  const currentPhotoUrl = currentPhoto?.url;

  return (
    <>
      <Head>
        <title>Byron Jaris Photography</title>
        <meta property="og:image" content={currentPhotoUrl} />
        <meta name="twitter:image" content={currentPhotoUrl} />
      </Head>
      <main className="mx-auto max-w-[1960px] p-4">
        <Carousel currentPhoto={currentPhoto} index={index} />
      </main>
    </>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async (context) => {
  const results: ImageProps[] = await getAllImages();
  
  let reducedResults: ImageProps[] = [];
  let i = 0;
  for (let result of results) {
    reducedResults.push({
      id: i,
      key: result.key,
      url: result.url,
      blurredUrl: result.url,
      group: result.group,
      ar: result.ar,
      height: result.height,
      width: result.width,
    });
    i++;
  }

  const currentPhoto = reducedResults.find((img) => img.key === context.params.photoId);

  return {
    props: {
      currentPhoto: currentPhoto,
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
