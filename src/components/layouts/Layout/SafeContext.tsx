import WalletConnectionFence from "@components/moleculas/WalletConnectionFence";
import { LoadingOverlay } from "@mantine/core";
import { useRouter } from "next/router";
import * as React from "react";
import { SafeService } from "services/safeSdk";
import { useSigner } from "wagmi";

const SafeContext: React.FunctionComponent<React.PropsWithChildren> = (
  props
) => {
  const { data: signer } = useSigner();
  const router = useRouter();
  const { safeAddress } = router.query;
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const initialize = async () => {
      if (signer) {
        setIsLoading(true);
        await SafeService.instance().initialize(signer, safeAddress as string);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    };
    initialize();
  }, [signer]);

  return (
    <>
      {isLoading ? (
        <LoadingOverlay visible={isLoading} />
      ) : signer ? (
        props.children
      ) : (
        <WalletConnectionFence />
      )}
    </>
  );
};

export default SafeContext;
