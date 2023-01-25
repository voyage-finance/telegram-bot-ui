import Card from "@components/moleculas/Card";
import { LoadingOverlay, Stack } from "@mantine/core";
import { SafeMultisigTransactionListResponse } from "@safe-global/safe-service-client";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import * as React from "react";
import { SafeService } from "services/safeSdk";
import { useSigner } from "wagmi";

interface IPendingTransactionsProps {}

const PendingTransactions: React.FunctionComponent<
  IPendingTransactionsProps
> = () => {
  const { data: signer } = useSigner();
  const router = useRouter();
  const { safeAddress } = router.query;
  const [pendingTxsResponse, setPendingTxResponse] =
    React.useState<SafeMultisigTransactionListResponse>();
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      const safeAddressChecksummed = ethers.utils.getAddress(
        safeAddress as string
      );
      await SafeService.instance().initialize(signer, safeAddressChecksummed);
      const service = await SafeService.instance().service();
      const response: SafeMultisigTransactionListResponse =
        await service.getPendingTransactions(safeAddressChecksummed);
      console.log("response", response);

      setPendingTxResponse(response);
      setIsLoading(false);
    };
    if (signer && safeAddress) initialize();
  }, [signer, safeAddress]);
  return (
    <Stack sx={{ position: "relative", minHeight: 100 }}>
      <LoadingOverlay visible={isLoading} />

      {pendingTxsResponse &&
        pendingTxsResponse.results.map((res, index) => {
          return (
            <Card key={index} style={{ color: "white" }} p={12}>
              <p>transactionHash:{res.transactionHash}</p>
              <p>safeTxHash:{res.safeTxHash}</p>
              <p>value:{ethers.utils.formatUnits(res.value, 18)}</p>
              <p>to:{res.to}</p>
            </Card>
          );
        })}
    </Stack>
  );
};

export default PendingTransactions;
