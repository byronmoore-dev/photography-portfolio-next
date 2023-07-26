import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Bridge from "./components/Icons/Bridge";
import Logo from "./components/Icons/Logo";
import Modal from "./components/Modal";
import type { ImageProps } from "./utils/types";
import { useLastViewedPhoto } from "./utils/useLastViewedPhoto";
import AWS from "aws-sdk";
import { useImages } from "./components/usePhotos";
import { getAllImages } from "./utils/getImages";
import { motion } from "framer-motion";

AWS.config.update({
  accessKeyId: process.env.NEXT_AWS_ACCESS_KEY,
  secretAccessKey: process.env.NEXT_AWS_SECRET_ACCESS_KEY,
  region: process.env.NEXT_AWS_REGION, // Replace with your actual region
});
const s3 = new AWS.S3();

const Home: NextPage = ({ staticImages }: { staticImages: ImageProps[] }) => {
  const router = useRouter();
  const { photos, setPhotos, filteredPhotos, setFilteredPhotos } = useImages();
  const { photoId } = router.query;
  const [lastViewedPhoto, setLastViewedPhoto] = useLastViewedPhoto();

  const lastViewedPhotoRef = useRef<HTMLAnchorElement>(null);
  const [filter, setFilter] = useState<"ALL" | "URBAN" | "NATURAL">("ALL");

  useEffect(() => {
    // This effect keeps track of the last viewed photo in the modal to keep the index page in sync when the user navigates back
    if (lastViewedPhoto && !photoId && !lastViewedPhotoRef) {
      lastViewedPhotoRef.current.scrollIntoView({ block: "center" });
      setLastViewedPhoto(null);
    }
  }, [photoId, lastViewedPhoto, setLastViewedPhoto]);

  useEffect(() => {
    setPhotos(staticImages);
    setFilteredPhotos(staticImages);
  }, []);

  useEffect(() => {
    if (filter === "ALL") {
      setFilteredPhotos(staticImages);
    } else {
      setFilteredPhotos(photos.filter((photo) => photo.group === filter.toLowerCase()));
    }
  }, [filter]);

  if (!photos || !filteredPhotos) return null;

  return (
    <>
      <Head>
        <title>Byron Jaris Photography</title>
        <meta property="og:image" content="https://s3.us-east-2.amazonaws.com/byronmoore.dev-photography-portfolio/natural-3.jpg" />
        <meta name="twitter:image" content="https://s3.us-east-2.amazonaws.com/byronmoore.dev-photography-portfolio/natural-3.jpg" />
      </Head>
      <main className="mx-auto max-w-[1960px] bg-neutral-900 p-4">
        {photoId && (
          <Modal
            onClose={() => {
              setLastViewedPhoto(photoId);
            }}
          />
        )}

        <motion.div transition={{ duration: 0.3 }} className="columns-1 gap-4 sm:columns-2 xl:columns-3 2xl:columns-4">
          <div className="after:content relative mb-5 flex h-[629px] flex-col items-center justify-end gap-4 overflow-hidden rounded-lg bg-neutral-800 bg-white/10 px-6 pb-16 pt-64 text-center text-white shadow-highlight after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight lg:pt-0">
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <span className="flex max-h-full max-w-full items-center justify-center">
                <Bridge />
              </span>
              <span className="absolute bottom-0 left-0 right-0 h-[400px] bg-gradient-to-b from-black/0 via-black to-black"></span>
            </div>
            <Logo />
            <h1 className="mb-4 mt-8 text-base font-bold uppercase tracking-widest">LFG</h1>
            <p className="max-w-[40ch] text-white/75 sm:max-w-[32ch]">Byron M Ps</p>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("ALL")}
                className="cursor-pointer rounded-3xl bg-purple-700 px-3 py-1 text-xs font-semibold uppercase text-white hover:bg-purple-400 active:bg-purple-800"
              >
                All
              </button>
              <button
                onClick={() => setFilter("URBAN")}
                className="rounded-3xl bg-purple-700 px-3 py-1 text-xs font-semibold uppercase text-white active:bg-purple-800"
              >
                Urban
              </button>
              <button
                onClick={() => setFilter("NATURAL")}
                className="rounded-3xl bg-purple-700 px-3 py-1 text-xs font-semibold uppercase text-white active:bg-purple-800"
              >
                Natural
              </button>
            </div>
          </div>
          {filteredPhotos.map(({ id, key, url, blurDataUrl }) => (
            <motion.div key={id} layout transition={{ duration: 0.3 }}>
              <Link
                key={id}
                href={`/?photoId=${key}`}
                as={`/p/${key}`}
                ref={id === Number(lastViewedPhoto) ? lastViewedPhotoRef : null}
                shallow
                className="after:content group relative mb-5 block w-full cursor-zoom-in after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight"
              >
                <Image
                  alt=""
                  className="min-h-[100px] min-w-[200px] transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110"
                  style={{ transform: "translate3d(0, 0, 0)" }}
                  src={"" + url}
                  placeholder="blur"
                  blurDataURL={blurDataUrl}
                  width={720}
                  height={480}
                  sizes="(max-width: 640px) 100vw,
                  (max-width: 1280px) 50vw,
                  (max-width: 1536px) 33vw,
                  25vw"
                />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </main>
      <footer className="p-6 text-center text-white/80 sm:p-12">Thank you to Byron</footer>
    </>
  );
};

export default Home;

export async function getStaticProps() {
  const results: ImageProps[] = await getAllImages();
  let reducedResults: ImageProps[] = [];

  let i = 0;
  for (let result of results) {
    reducedResults.push({
      id: i,
      key: result.key,
      url: result.url,
      height: result.height,
      width: result.width,
      group: result.group,
      blurDataUrl: result.url,
      format: "",
    });
    i++;
  }

  return {
    props: {
      staticImages: reducedResults,
    },
  };
}
