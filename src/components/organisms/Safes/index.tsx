import { Text } from "@components/atoms";
import SafeContext from "@components/layouts/Layout/SafeContext";
import Card from "@components/moleculas/Card";
import TitleWithLine from "@components/moleculas/TitleWithLine";
import { Stack } from "@mantine/core";
import { useRouter } from "next/router";
import * as React from "react";
import { SafeService } from "services/safeSdk";
import { useAccount } from "wagmi";

interface ISafesProps {}

const Safes: React.FunctionComponent<ISafesProps> = (props) => {
  const [safes, setSafes] = React.useState<string[]>([]);
  const { address } = useAccount();
  const router = useRouter();

  const fetchSafes = async (address: string) => {
    if (SafeService.instance().isServiceReady()) {
      const res = await SafeService.instance()
        .service()
        .getSafesByOwner(address);
      setSafes(res.safes);
    }
  };

  React.useEffect(() => {
    if (address) fetchSafes(address);
  }, [address]);

  return (
    <Stack w={500} mx="auto" my="auto">
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
    </Stack>
  );
};

export default Safes;
