import { Text } from "@components/atoms";
import { useSafeService } from "@components/layouts/SafeServiceProvider";
import Card from "@components/moleculas/Card";
import TitleWithLine from "@components/moleculas/TitleWithLine";
import { LoadingOverlay, Stack } from "@mantine/core";
import { getEip3770NetworkPrefixFromChainId } from "@safe-global/safe-core-sdk-utils";
import { useRouter } from "next/router";
import * as React from "react";
import { useAccount, useNetwork } from "wagmi";

interface ISafesProps {}

const Safes: React.FunctionComponent<ISafesProps> = (props) => {
  const [safes, setSafes] = React.useState<string[]>([]);
  const { address } = useAccount();
  const router = useRouter();
  const { chain } = useNetwork();
  const { service, isLoading } = useSafeService();

  const fetchSafes = async (address: string) => {
    if (service) {
      const res = await service.getSafesByOwner(address);
      setSafes(res.safes);
    }
  };

  React.useEffect(() => {
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
            router.push(
              `/safes/${getEip3770NetworkPrefixFromChainId(chain!.id)}:${safe}`
            );
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
