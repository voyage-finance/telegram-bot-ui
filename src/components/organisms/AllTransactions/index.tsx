import Card from "@components/moleculas/Card";
import { LoadingOverlay, Stack } from "@mantine/core";
import {
  AllTransactionsListResponse,
  AllTransactionsOptions,
  SafeMultisigTransactionListResponse,
} from "@safe-global/safe-service-client";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import * as React from "react";
import { SafeService } from "services/safeSdk";
import { useSigner } from "wagmi";

interface IAllTransactionsProps {}

const allTxsOptions: AllTransactionsOptions = {
  executed: true,
  queued: false,
  trusted: true,
};

const AllTransactions: React.FunctionComponent<IAllTransactionsProps> = () => {
  const { data: signer } = useSigner();
  const router = useRouter();
  const { safeAddress } = router.query;
  const [pendingTxsResponse, setPendingTxResponse] =
    React.useState<AllTransactionsListResponse>();
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      const safeAddressChecksummed = ethers.utils.getAddress(
        safeAddress as string
      );
      await SafeService.instance().initialize(signer, safeAddressChecksummed);
      const service = await SafeService.instance().service();
      const response: AllTransactionsListResponse =
        await service.getAllTransactions(safeAddressChecksummed, allTxsOptions);
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
              <p>to:{res.to}</p>
              <p>executionDate:{res.executionDate}</p>
              <p>txType:{res.txType}</p>
            </Card>
          );
        })}
    </Stack>
  );
};

export default AllTransactions;
