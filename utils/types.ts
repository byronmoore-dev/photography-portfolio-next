/* eslint-disable no-unused-vars */
export interface ImageProps {
  id: number;
  key: string;
  url: string;
  height: string;
  width: string;
  group: string;
  format: string;
  blurDataUrl?: string;
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
  currentPhotos: ImageProps | undefined;
  setCurrentPhotos: React.Dispatch<React.SetStateAction<ImageProps | undefined>>;
}
