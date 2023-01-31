import Safes from "@components/organisms/Safes";
import Head from "next/head";

export default function Home() {
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
