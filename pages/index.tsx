import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Bridge from "../components/Icons/Bridge";
import Logo from "../components/Icons/Logo";
import Modal from "../components/Modal";
import type { ImageProps } from "../utils/types";
import { useLastViewedPhoto } from "../utils/useLastViewedPhoto";
import AWS from "aws-sdk";
import { useImages } from "../components/usePhotos";
import { getAllImages } from "../utils/getImages";
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
      <main className="mx-auto max-w-[1960px] p-4">
        {photoId && (
          <Modal
            onClose={() => {
              setLastViewedPhoto(photoId);
            }}
          />
        )}
        <div className="z-10 mb-4 flex cursor-pointer gap-2">
          <button
            onClick={() => setFilter("ALL")}
            className={`rounded-lg bg-purple-900 px-5 py-3 text-sm font-semibold uppercase text-white duration-200  ${
              filter === "ALL" ? "cursor-default bg-purple-900/40" : "cursor-pointer hover:scale-[104%] active:brightness-75"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("URBAN")}
            className={`rounded-lg bg-purple-900 px-5 py-3 text-sm font-semibold uppercase text-white duration-200  ${
              filter === "URBAN" ? "cursor-default bg-purple-900/40" : "cursor-pointer hover:scale-[104%] active:brightness-75"
            }`}
          >
            Urban
          </button>
          <button
            onClick={() => setFilter("NATURAL")}
            className={`rounded-lg bg-purple-900 px-5 py-3 text-sm font-semibold uppercase text-white duration-200  ${
              filter === "NATURAL" ? "cursor-default bg-purple-900/40" : "cursor-pointer hover:scale-[104%] active:brightness-75"
            }`}
          >
            Natural
          </button>
        </div>
        <motion.div className="columns-1 gap-4 sm:columns-2 xl:columns-3 2xl:columns-4">
          <div className="after:content relative mb-5 flex h-[629px] flex-col items-center justify-end overflow-hidden rounded-lg bg-neutral-800 bg-white/10 px-6 pb-12 text-center text-white shadow-highlight after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight lg:pt-0">
            <div className="absolute inset-0 z-0 flex items-center justify-center opacity-70">
              <Image
                src={"https://s3.us-east-2.amazonaws.com/byronmoore.dev-photo-portfolio/misc/byron-photo.jpg"}
                alt="Byron M, the man, the myth, the mid photographer."
                width={500}
                height={500}
                className="mb-auto mt-0"
              />
              <span className="absolute bottom-0 left-0 right-0 h-[400px] bg-gradient-to-b from-neutral-900/0 via-neutral-900/90 to-neutral-900"></span>
            </div>
            <h1 className="z-10 mt-8 text-base font-bold uppercase tracking-widest">Byron Jaris</h1>
            <p className="z-10 mb-3 max-w-[40ch] text-sm font-semibold text-white/40 sm:max-w-[32ch]">Creator. Designer. Developer.</p>
            <p className="z-10 max-w-[40ch] text-sm leading-5 text-white/75 sm:max-w-[32ch]">
              The realest of the real. The man, the myth, the mid photographer. He who shall not be named, the mfer.
            </p>
          </div>

          {filteredPhotos.map(({ id, key, url, blurredUrl }) => (
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
                  blurDataURL={blurredUrl}
                  width={720}
                  height={480}
                  priority={id > 5 ? true : false}
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
      blurredUrl: result.blurredUrl,
      group: result.group,
      ar: result.ar,
      height: result.height,
      width: result.width,
    });
    i++;
  }
  return {
    props: {
      staticImages: reducedResults,
    },
  };
}
