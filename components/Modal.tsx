import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import useKeypress from "react-use-keypress";
import type { ImageProps } from "../utils/types";
import SharedModal from "./SharedModal";
import { useImages } from "./useCarousel";

export default function Modal({ onClose }: { onClose?: () => void }) {
  const { photos, currentPhotos, setCurrentPhotos } = useImages();

  let overlayRef = useRef();
  const router = useRouter();

  const { photoId } = router.query;
  let index = getCurID(photos, photoId);

  const [direction, setDirection] = useState(0);
  const [curIndex, setCurIndex] = useState(index);

  function handleClose() {
    router.push("/", undefined, { shallow: true });
    onClose();
  }

  function changePhotoId(newVal: number) {
    if (newVal > index) {
      setDirection(1);
    } else {
      setDirection(-1);
    }
    setCurIndex(newVal);
    let newKey = getCurKey(photos, curIndex);
    router.push(
      {
        query: { photoId: newKey },
      },
      `/p/${newKey}`,
      { shallow: true }
    );
  }

  useKeypress("ArrowRight", () => {
    if (curIndex + 1 < photos.length) {
      changePhotoId(curIndex + 1);
    }
  });

  useKeypress("ArrowLeft", () => {
    if (curIndex > 0) {
      changePhotoId(curIndex - 1);
    }
  });

  return (
    <Dialog static open={true} onClose={handleClose} initialFocus={overlayRef} className="fixed inset-0 z-10 flex items-center justify-center">
      <Dialog.Overlay
        ref={overlayRef}
        as={motion.div}
        key="backdrop"
        className="fixed inset-0 z-30 bg-black/70 backdrop-blur-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
      <SharedModal index={curIndex} direction={direction} images={photos} changePhotoId={changePhotoId} closeModal={handleClose} navigation={true} />
    </Dialog>
  );
}

const getCurID = (imgs: any, id: any) => {
  let index = imgs.find((img) => img.key === id)?.id;
  return index;
};

const getCurKey = (imgs: any, i: any) => {
  let key = imgs.find((img) => img.id === i)?.key;
  return key;
};
