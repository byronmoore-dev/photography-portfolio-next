/* eslint-disable no-unused-vars */
export interface ImageProps {
  id?: number;
  key: string;
  url: string;
  blurredUrl: string;
  group: string;
  ar: string;
  height: string;
  width: string;
}

export interface SharedModalProps {
  index: number;
  images?: ImageProps[];
  currentPhoto?: ImageProps;
  changePhotoId: (newVal: number) => void;
  closeModal: () => void;
  navigation: boolean;
  direction?: number;
}

export interface ImageContextValue {
  photos: ImageProps[] | undefined;
  setPhotos: React.Dispatch<React.SetStateAction<ImageProps[] | undefined>>;
  filteredPhotos: ImageProps[] | undefined;
  setFilteredPhotos: React.Dispatch<React.SetStateAction<ImageProps[] | undefined>>;
  currentPhotos: ImageProps | undefined;
  setCurrentPhotos: React.Dispatch<React.SetStateAction<ImageProps | undefined>>;
}
