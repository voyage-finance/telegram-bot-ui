import WalletConnectionFence from "@components/moleculas/WalletConnectionFence";
import WrongNetworkFence from "@components/organisms/WrongNetworkFence";
import Safe from "@safe-global/safe-core-sdk";
import { parseEip3770Address } from "@safe-global/safe-core-sdk-utils";
import EthersAdapter from "@safe-global/safe-ethers-lib";
import SafeServiceClient from "@safe-global/safe-service-client";
import { ChainID } from "@types";
import { CHAIN_ID_NETWORK } from "@utils/config";
import { getChainIdFromShortName } from "@utils/network";
import { ethers, utils } from "ethers";
import { useRouter } from "next/router";
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from "react";
import { useNetwork, useSigner } from "wagmi";

const SafeServiceContext = createContext<{
  service?: SafeServiceClient;
  sdk?: Safe;
  safeAddress: string;
  isLoading: boolean;
  urlChainId: number;
}>({
  service: undefined,
  sdk: undefined,
  isLoading: false,
  safeAddress: "",
  urlChainId: 1,
});

export const SafeServiceProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { chain } = useNetwork();
  const { data: signer } = useSigner({
    chainId: chain?.id,
  });
  const [safeService, setSafeService] = useState<SafeServiceClient>();
  const [safeSdk, setSafeSdk] = useState<Safe>();
  const [isLoading, setIsLoading] = React.useState(true);

  const router = useRouter();

  let { eip3770Address } = router.query;
  eip3770Address = eip3770Address || "matic:0x";
  const { prefix, address: safeAddress } = parseEip3770Address(
    eip3770Address as string
  );
  const urlChainId = getChainIdFromShortName(prefix) || ChainID.Mainnet;

  React.useEffect(() => {
    const initialize = async () => {
      if (signer && chain && (await signer.getChainId()) == urlChainId) {
        setIsLoading(true);
        const ethAdapter = new EthersAdapter({
          ethers,
          signerOrProvider: signer,
        });

        console.log("safeAddress", safeAddress);

        if (safeAddress) {
          try {
            const sdkObject = await Safe.create({
              ethAdapter,
              safeAddress: ethers.utils.getAddress(safeAddress as string),
            });
            setSafeSdk(sdkObject);
          } catch (e) {
            console.error(e);
          }
        }

        const network = CHAIN_ID_NETWORK[chain.id as ChainID];
        const txServiceUrl = `https://safe-transaction-${network}.safe.global`;
        setSafeService(
          new SafeServiceClient({
            txServiceUrl,
            ethAdapter,
          })
        );
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    };
    initialize();
  }, [signer, chain]);

  return (
    <SafeServiceContext.Provider
      value={{
        service: safeService,
        sdk: safeSdk,
        isLoading,
        safeAddress,
        urlChainId,
      }}
    >
      <WalletConnectionFence>
        <WrongNetworkFence
          currentChainId={chain?.id || ChainID.Mainnet}
          urlChainId={urlChainId}
        >
          {children}
        </WrongNetworkFence>
      </WalletConnectionFence>
    </SafeServiceContext.Provider>
  );
};

export const useSafeService = () => useContext(SafeServiceContext);
