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

const SafeSdkContext = createContext<{
  service?: SafeServiceClient;
  sdk?: Safe;
  safeAddress?: string;
  isLoading: boolean;
  urlChainId?: number;
  chainPrefix?: string;
}>({
  sdk: undefined,
  isLoading: false,
  safeAddress: "",
  urlChainId: 1,
  chainPrefix: "",
});

export const SafeSdkProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { chain } = useNetwork();
  const { data: signer } = useSigner({
    chainId: chain?.id,
  });
  const [safeSdk, setSafeSdk] = useState<Safe>();
  const [isLoading, setIsLoading] = React.useState(true);

  const router = useRouter();

  const { eip3770Address } = router.query;
  const { prefix, address: safeAddress } = eip3770Address
    ? parseEip3770Address(eip3770Address as string)
    : { prefix: undefined, address: undefined };
  const urlChainId = prefix
    ? getChainIdFromShortName(prefix) || ChainID.Mainnet
    : undefined;

  React.useEffect(() => {
    const initialize = async () => {
      if (
        eip3770Address &&
        signer &&
        chain &&
        (await signer.getChainId()) == urlChainId
      ) {
        setIsLoading(true);
        const ethAdapter = new EthersAdapter({
          ethers,
          signerOrProvider: signer,
        });

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

        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    };
    initialize();
  }, [signer, chain]);

  return (
    <SafeSdkContext.Provider
      value={{
        sdk: safeSdk,
        isLoading,
        safeAddress,
        urlChainId,
        chainPrefix: prefix,
      }}
    >
      <WalletConnectionFence>
        {urlChainId ? (
          <WrongNetworkFence
            currentChainId={chain?.id || ChainID.Mainnet}
            urlChainId={urlChainId}
          >
            {children}
          </WrongNetworkFence>
        ) : (
          children
        )}
      </WalletConnectionFence>
    </SafeSdkContext.Provider>
  );
};

export const useSafeSdk = () => useContext(SafeSdkContext);
