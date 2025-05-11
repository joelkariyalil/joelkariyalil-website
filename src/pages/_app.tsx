import type { AppProps } from 'next/app';
import '../styles/globals.css';
import BackgroundCanvas from '@/components/BackgroundCanvas';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <BackgroundCanvas />
      <Component {...pageProps} />
    </>
  );
}
