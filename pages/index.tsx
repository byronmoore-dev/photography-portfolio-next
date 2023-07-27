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
import Script from "next/script";

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

  console.log("ID: " + process.env.NEXT_PUBLIC_GA_ID);

  return (
    <>
      <Head>
        <title>Byron Jaris Photography</title>
        <meta property="og:image" content="https://s3.us-east-2.amazonaws.com/byronmoore.dev-photo-portfolio/natural-3.jpg" />
        <meta name="twitter:image" content="https://s3.us-east-2.amazonaws.com/byronmoore.dev-photo-portfolio/natural-3.jpg" />
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
      />

      <main className="mx-auto max-w-[1960px] p-4">
        {photoId && (
          <Modal
            onClose={() => {
              setLastViewedPhoto(photoId);
            }}
          />
        )}
        <motion.div className="columns-1 gap-4 sm:columns-2 xl:columns-3 2xl:columns-4">
          <div className="after:content group relative mb-5 flex h-[550px] flex-col items-center justify-end overflow-hidden rounded-lg bg-neutral-800 bg-white/10 px-6 text-center text-white shadow-highlight after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight lg:pt-0">
            <div className="absolute inset-0 z-0 flex items-center justify-center opacity-70">
              <Image
                src={"https://s3.us-east-2.amazonaws.com/byronmoore.dev-photo-portfolio/misc/byron-photo.jpg"}
                alt="Byron M, the man, the myth, the mid photographer."
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAAeAAD/4QNxaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA3LjItYzAwMCA3OS41NjZlYmM1YjQsIDIwMjIvMDUvMDktMDg6MjU6NTUgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9IjExMzkxQUZCNjk3OEY2RTY4QTk5OTM5QkMxNjk5Q0Q2IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjcwMzdDMTJDMkMyODExRUVCNjRERDJCQTc5QUEzMUUwIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjcwMzdDMTJCMkMyODExRUVCNjRERDJCQTc5QUEzMUUwIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCAyMDIyIFdpbmRvd3MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpmNDc1NGY4Yi1jYzQyLTEzNDktODkwNy1jZWU3OGI2OWVmYmEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6ZjQ3NTRmOGItY2M0Mi0xMzQ5LTg5MDctY2VlNzhiNjllZmJhIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/+0ASFBob3Rvc2hvcCAzLjAAOEJJTQQEAAAAAAAPHAFaAAMbJUccAgAAAgACADhCSU0EJQAAAAAAEPzhH4nIt8l4LzRiNAdYd+v/7gAOQWRvYmUAZMAAAAAB/9sAhAAQCwsLDAsQDAwQFw8NDxcbFBAQFBsfFxcXFxcfHhcaGhoaFx4eIyUnJSMeLy8zMy8vQEBAQEBAQEBAQEBAQEBAAREPDxETERUSEhUUERQRFBoUFhYUGiYaGhwaGiYwIx4eHh4jMCsuJycnLis1NTAwNTVAQD9AQEBAQEBAQEBAQED/wAARCAAZABkDASIAAhEBAxEB/8QAcgAAAgIDAAAAAAAAAAAAAAAAAwQABQECBgEAAwEAAAAAAAAAAAAAAAAAAAIDARAAAQMCAwQLAAAAAAAAAAAAAQACAxExEgQFUYEyEyFBYZGhsfEiUhQ0EQEAAQQDAAAAAAAAAAAAAAAAEQEhMUGhAhL/2gAMAwEAAhEDEQA/AHWytcKtII7FvjAuVWRSsjbRtem6T1DUHQg1BOLhHVVN6LDoMYtVTEqLT9Winb7gWujpiFxuVj9/LfPwKJEOffnX0JLqDYEnPK2WN+K44CSb+ixPYIMlt6j1y2hzI8tkBc01e6ocfIKcyTae9DyX595RFTZrcP/Z"
                priority
                width={500}
                height={500}
                className="mb-auto mt-0 duration-500 ease-in-out group-hover:scale-110"
              />
              <span className="absolute bottom-0 left-0 right-0 h-3/4 w-full bg-gradient-to-b from-neutral-900/0 via-neutral-900 to-neutral-900" />
            </div>
            <h1 className="z-10 mt-8 text-lg font-bold uppercase tracking-widest">Byron Jaris</h1>
            <p className="z-10 mb-3 max-w-[40ch] text-sm font-medium text-white/30 sm:max-w-[32ch]">Creator. Developer. Photographer.</p>
            <p className="z-10 max-w-[40ch] text-sm leading-5 text-white/75 sm:max-w-[32ch]">
              The realest of the real. The man, the myth, the mid photographer. He who shall not be named, the mfer...
            </p>

            <div className="z-10 mb-4 mt-8 flex cursor-pointer gap-2">
              <button
                onClick={() => setFilter("ALL")}
                className={`rounded-lg bg-neutral-900 px-3 py-1 text-[10px] font-semibold uppercase text-white duration-200  ${
                  filter === "ALL" ? "cursor-default bg-purple-900/40" : "cursor-pointer hover:scale-[102%] active:brightness-75"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("URBAN")}
                className={`rounded-lg bg-neutral-900 px-3 py-1 text-[10px] font-semibold uppercase text-white duration-200  ${
                  filter === "URBAN" ? "cursor-default bg-purple-900/40" : "cursor-pointer hover:scale-[102%] active:brightness-75"
                }`}
              >
                Urban
              </button>
              <button
                onClick={() => setFilter("NATURAL")}
                className={`rounded-lg bg-neutral-900 px-3 py-1 text-[10px] font-semibold uppercase text-white duration-200  ${
                  filter === "NATURAL" ? "cursor-default bg-purple-900/40" : "cursor-pointer hover:scale-[102%] active:brightness-75"
                }`}
              >
                Natural
              </button>
            </div>
          </div>

          {filteredPhotos.map(({ id, key, url, blurredUrl }) => (
            <motion.div layout className="overflow-hidden rounded-lg" key={id} transition={{ duration: 0.3 }}>
              <motion.div
                whileHover={{ scale: 1.015 }} // Apply the scale animation on hover
              >
                <Link
                  href={`/?photoId=${key}`}
                  as={`/p/${key}`}
                  ref={id === Number(lastViewedPhoto) ? lastViewedPhotoRef : null}
                  shallow
                  className="after:content group relative mb-5 block w-full cursor-zoom-in after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight"
                >
                  <Image
                    alt=""
                    className="min-h-[100px] min-w-[200px] transform rounded-lg brightness-90 transition duration-200 ease-in-out will-change-auto hover:brightness-75 group-hover:scale-110"
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
            </motion.div>
          ))}
        </motion.div>
      </main>
      <footer className="flex items-center justify-center py-8">
        <p className="text-center text-sm font-medium text-white/80">Copyright 2023</p>
      </footer>
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
