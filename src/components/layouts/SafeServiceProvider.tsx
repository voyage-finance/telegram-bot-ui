import SafeServiceClient from "@safe-global/safe-service-client";
import { ChainID } from "@types";
import { CHAIN_ID_NETWORK } from "@utils/config";
import { useRouter } from "next/router";
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from "react";
import { SafeService } from "services/safeSdk";
import { useNetwork, useSigner } from "wagmi";

const SafeServiceContext = createContext<{
  service?: SafeServiceClient;
  isLoading: boolean;
}>({
  service: undefined,
  isLoading: false,
});

export const SafeServiceProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { chain } = useNetwork();
  const { data: signer } = useSigner({
    chainId: chain?.id,
  });
  const [safeService, setSafeService] = useState<SafeServiceClient>();
  const [isLoading, setIsLoading] = React.useState(true);

  const router = useRouter();
  const { safeAddress } = router.query;

  React.useEffect(() => {
    const initialize = async () => {
      if (signer && chain && (await signer.getChainId()) == chain.id) {
        setIsLoading(true);
        const [, safeServiceRes] = await SafeService.instance().initialize(
          CHAIN_ID_NETWORK[chain.id as ChainID],
          signer,
          safeAddress as string
        );
        console.log("safeServiceRes", safeServiceRes);

        setSafeService(safeServiceRes);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    };
    initialize();
  }, [signer, chain]);

  return (
    <SafeServiceContext.Provider value={{ service: safeService, isLoading }}>
      {children}
    </SafeServiceContext.Provider>
  );
};

export const useSafeService = () => useContext(SafeServiceContext);
