import Safes from "@components/organisms/Safes";
import Head from "next/head";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    console.log("backend url", (process.env as any).API_URL);
  }, []);
  return (
    <>
      <Head>
        <title>Voyage Safe</title>
        <meta name="description" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Safes />
      </main>
    </>
  );
}
