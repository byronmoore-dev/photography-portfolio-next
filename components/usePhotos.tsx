import React, { createContext, useContext, useState } from "react";
import { ImageProps, ImageContextValue } from "../utils/types";

export const imagesContext = createContext<ImageContextValue | undefined>(undefined);

export function useImageStorage(): ImageContextValue {
  const [photos, setPhotos] = useState<ImageProps[] | undefined>(undefined);
  const [filteredPhotos, setFilteredPhotos] = useState<ImageProps[] | undefined>(undefined);
  const [currentPhotos, setCurrentPhotos] = useState<ImageProps | undefined>(undefined);

  return { photos, setPhotos, filteredPhotos, setFilteredPhotos, currentPhotos, setCurrentPhotos };
}

export const ImageProvider = ({ children }: { children: React.ReactNode }) => {
  const images = useImageStorage();
  return <imagesContext.Provider value={images}>{children}</imagesContext.Provider>;
};

export function useImages(): ImageContextValue {
  const context = useContext(imagesContext);
  if (!context) {
    throw new Error("useImages must be used within an ImageProvider");
  }
  return context;
}
