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

  return (
    <>
      <Head>
        <title>Byron Jaris Photography</title>
        <meta property="og:image" content={currentPhoto?.url} />
        <meta name="twitter:image" content={currentPhoto?.url} />
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
