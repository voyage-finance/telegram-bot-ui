import WalletConnectionFence from "@components/moleculas/WalletConnectionFence";
import { LoadingOverlay } from "@mantine/core";
import { ChainID } from "@types";
import { CHAIN_ID_NETWORK } from "@utils/config";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import * as React from "react";
import { SafeService } from "services/safeSdk";
import { useNetwork, useProvider, useSigner } from "wagmi";

const SafeContext: React.FunctionComponent<React.PropsWithChildren> = (
  props
) => {
  const { chain } = useNetwork();
  const { data: signer } = useSigner({
    chainId: chain?.id,
  });

  const router = useRouter();
  const { safeAddress } = router.query;
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const initialize = async () => {
      if (signer && chain && (await signer.getChainId()) == chain.id) {
        console.log("chain", chain);
        setIsLoading(true);
        await SafeService.instance().initialize(
          CHAIN_ID_NETWORK[chain.id as ChainID],
          signer,
          safeAddress as string
        );
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    };
    initialize();
  }, [signer, chain]);

  React.useEffect(() => {
    const provider = new ethers.providers.Web3Provider(
      window.ethereum as any,
      "any"
    );
    provider.on("network", (newNetwork, oldNetwork) => {
      console.log("network changed", newNetwork, oldNetwork);

      if (oldNetwork) {
        window.location.reload();
      }
    });
  }, []);

  return (
    <>
      {isLoading ? (
        <LoadingOverlay visible={isLoading} />
      ) : signer && SafeService.instance().isServiceReady() ? (
        props.children
      ) : (
        <WalletConnectionFence />
      )}
    </>
  );
};

export default SafeContext;
