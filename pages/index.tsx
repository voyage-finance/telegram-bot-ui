import SafeContext from "@components/layouts/Layout/SafeContext";
import ConnectBtn from "@components/moleculas/WalletNavItem/ConnectBtn";
import Safes from "@components/organisms/Safes";
import { Stack } from "@mantine/core";
import { fetchSigner } from "@wagmi/core";
import Head from "next/head";
import { useEffect } from "react";
import { SafeService } from "services/safeSdk";
import { useSigner } from "wagmi";

export default function Home() {
  // const { data: signer } = useSigner();
  // // useEffect(() => {
  // //   const initialize = async () => {
  // //     SafeService.instance().initialize(signer);
  // //     console.log(
  // //       "getOwners",
  // //       await (await SafeService.instance().sdk()).getOwners()
  // //     );
  // //   };
  // //   if (signer) initialize();
  // // }, [signer]);
  return (
    <>
      <Head>
        <title>Voyage Safe</title>
        <meta name="description" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <SafeContext>
          <Safes />
        </SafeContext>
      </main>
    </>
  );
}
