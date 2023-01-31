import { Text } from "@components/atoms";
import {
  SafeServiceProvider,
  useSafeService,
} from "@components/layouts/SafeServiceProvider";
import Card from "@components/moleculas/Card";
import TitleWithLine from "@components/moleculas/TitleWithLine";
import { LoadingOverlay, Stack } from "@mantine/core";
import { useRouter } from "next/router";
import * as React from "react";
import { SafeService } from "services/safeSdk";
import { useAccount, useNetwork } from "wagmi";

interface ISafesProps {}

const Safes: React.FunctionComponent<ISafesProps> = (props) => {
  const [safes, setSafes] = React.useState<string[]>([]);
  const { address } = useAccount();
  const { chain } = useNetwork();
  const router = useRouter();

  const fetchSafes = async (address: string) => {
    if (SafeService.instance().isServiceReady()) {
      const res = await SafeService.instance()
        .service()
        .getSafesByOwner(address);
      setSafes(res.safes);
    }
  };

  // React.useEffect(() => {
  //   console.log("address", address);
  //   console.log(
  //     "SafeService.instance().isServiceReady()",
  //     SafeService.instance().isServiceReady()
  //   );
  //   if (address) fetchSafes(address);
  // }, [SafeService.instance().isServiceReady()]);

  const { service, isLoading } = useSafeService();

  React.useEffect(() => {
    console.log("service", service);
    console.log("isLoading", isLoading);
    if (!service) {
      setSafes([]);
    }
    if (address) fetchSafes(address);
  }, [service, isLoading]);

  return (
    <Stack w={500} mx="auto" my="auto">
      <LoadingOverlay visible={isLoading} />
      <TitleWithLine>Safes</TitleWithLine>
      {safes.map((safe) => (
        <div
          key={safe}
          onClick={() => {
            router.push(`/safes/${safe}`);
          }}
        >
          <Card
            p={12}
            sx={{
              ":hover": {
                cursor: "pointer",
              },
            }}
          >
            <Text>{safe}</Text>
          </Card>
        </div>
      ))}
      {safes.length == 0 && <Text>No safes on this network</Text>}
    </Stack>
  );
};

export default Safes;
