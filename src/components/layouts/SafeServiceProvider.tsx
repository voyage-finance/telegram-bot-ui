import WalletConnectionFence from "@components/moleculas/WalletConnectionFence";
import EthersAdapter from "@safe-global/safe-ethers-lib";
import SafeServiceClient from "@safe-global/safe-service-client";
import { ChainID } from "@types";
import { CHAIN_ID_NETWORK } from "@utils/config";
import { ethers } from "ethers";
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from "react";
import { useNetwork, useSigner } from "wagmi";

const SafeServiceContext = createContext<{
  service?: SafeServiceClient;
  isLoading: boolean;
  txServiceUrl: string;
}>({
  service: undefined,
  isLoading: false,
  txServiceUrl: "",
});

export const SafeServiceProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { chain } = useNetwork();
  const { data: signer } = useSigner();
  const [safeService, setSafeService] = useState<SafeServiceClient>();
  const [isLoading, setIsLoading] = React.useState(true);
  const [txServiceUrl, setTxServiceUrl] = React.useState("");

  React.useEffect(() => {
    const initialize = async () => {
      if (signer && chain && (await signer.getChainId()) == chain.id) {
        setIsLoading(true);
        const ethAdapter = new EthersAdapter({
          ethers,
          signerOrProvider: signer,
        });

        const network = CHAIN_ID_NETWORK[chain.id as ChainID];
        const txServiceUrl = `https://safe-transaction-${network}.safe.global`;
        setTxServiceUrl(txServiceUrl);
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
  }, [signer]);

  return (
    <SafeServiceContext.Provider
      value={{
        service: safeService,
        isLoading,
        txServiceUrl,
      }}
    >
      <WalletConnectionFence>{children}</WalletConnectionFence>
    </SafeServiceContext.Provider>
  );
};

export const useSafeService = () => useContext(SafeServiceContext);
