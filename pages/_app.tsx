import type { AppProps } from "next/app";
import "../styles/index.css";
import { ImageProvider } from "../components/usePhotos";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ImageProvider>
      <Component {...pageProps} />
    </ImageProvider>
  );
}
