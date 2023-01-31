import { Button, Text } from "@components/atoms";
import Card from "@components/moleculas/Card";
import { Avatar, Box, Group, Stack } from "@mantine/core";
import { verifyMessage } from "ethers/lib/utils.js";
import { useRouter } from "next/dist/client/router";
import * as React from "react";
import { useAccount, useNetwork, useSignMessage } from "wagmi";
import WalletConnectionFence from "@components/moleculas/WalletConnectionFence";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { getToken } from "next-auth/jwt";
import { SiweMessage } from "siwe";
import TitleWithLine from "@components/moleculas/TitleWithLine";
import CheckOrangeIcon from "@assets/icons/check-circle-orange.svg";
import ArrowUpRightIcon from "@assets/icons/arrow-up-right-icon.svg";
import styles from "./index.module.scss";
import { SafeService } from "services/safeSdk";
import { useSafeService } from "@components/layouts/SafeServiceProvider";
import { getShortenedAddress } from "@utils/index";
import { CHAIN_ID_NETWORK } from "@utils/config";
import { ChainID } from "@types";

interface ISignPageProps {}

function hexToBytes(hex: string) {
  for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
  return bytes;
}

function createSiweMessage(
  address: string,
  statement: string,
  chainId?: number
) {
  const siweMessage = new SiweMessage({
    domain: window.location.hostname,
    address,
    statement,
    uri: window.location.origin,
    version: "1",
    chainId,
  });
  return siweMessage.prepareMessage();
}

const SignPage: React.FunctionComponent<ISignPageProps> = (props) => {
  const router = useRouter();
  const { address } = useAccount();
  const { message, name, msg_id } = router.query as any;
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const { chain } = useNetwork();
  const [step, setStep] = React.useState(2);
  const [safes, setSafes] = React.useState<string[]>([]);
  const [selectedSafe, setSelectedSafe] = React.useState<string>();
  const recoveredAddress = React.useRef<string>();

  const [siweMessage, setSiweMessage] = React.useState("");

  const {
    data: signedData,
    error: signError,
    isLoading,
    signMessage,
  } = useSignMessage({
    async onSuccess(data, variables) {
      try {
        setLoading(true);
        const address = verifyMessage(variables.message, data);
        recoveredAddress.current = address;
        setStep(2);
        setLoading(false);
      } catch (e: any) {
        setLoading(false);
        setError(e.message);
      }
    },
  });

  const onSign = () => {
    // const bytesValue: Uint8Array = hexToBytes(
    //   createSiweMessage(address!, message) as string
    // ) as any;

    signMessage({ message: siweMessage });
  };

  const fetchSafes = async (address: string) => {
    if (SafeService.instance().isServiceReady()) {
      const res = await SafeService.instance()
        .service()
        .getSafesByOwner(address);
      setSafes(res.safes);
    }
  };
  const { service, isLoading: isSafeLoading } = useSafeService();

  React.useEffect(() => {
    const siweMsg = createSiweMessage(address!, message, chain?.id);
    console.log(siweMsg);
    setSiweMessage(siweMsg);
  }, []);

  React.useEffect(() => {
    console.log("service", service);
    console.log("isSafeLoading", isSafeLoading);
    if (!service) {
      setSafes([]);
    }
    if (address) fetchSafes(address);
  }, [service, isSafeLoading]);

  return (
    <WalletConnectionFence>
      {step == 1 ? (
        <Stack
          mt={56}
          sx={{
            marginInline: "auto",
          }}
          align="start"
        >
          <TitleWithLine w="100%">Signature Request</TitleWithLine>
          <Text type="secondary">Message</Text>
          <Card w={350} py={70} px={22}>
            <Text sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
              {siweMessage}
            </Text>
          </Card>
          <Group w="100%">
            <Button onClick={() => undefined} kind="secondary" sx={{ flex: 1 }}>
              Reject
            </Button>
            <Button onClick={onSign} loading={loading} sx={{ flex: 1 }}>
              Sign Message
            </Button>
          </Group>
          {signError && <Text type="danger">{signError.message}</Text>}
          {error && <Text type="danger">{error}</Text>}
        </Stack>
      ) : (
        <Stack
          mt={56}
          sx={{
            marginInline: "auto",
          }}
          align="start"
          w={310}
        >
          <TitleWithLine w="100%">Safe Selection</TitleWithLine>
          <Text type="secondary">
            Chain: {chain && CHAIN_ID_NETWORK[chain.id as ChainID]}
          </Text>

          {safes.map((safe) => (
            <Group
              className={styles.safeOption}
              key={safe}
              onClick={() => setSelectedSafe(safe)}
              align="center"
            >
              {safe == selectedSafe ? (
                <Avatar src={CheckOrangeIcon.src} size={20} />
              ) : (
                <Box
                  sx={{
                    border: "2px solid rgba(255, 255, 255, 0.35)",
                    borderRadius: "50%",
                    width: 20,
                    height: 20,
                  }}
                />
              )}
              <Text>{getShortenedAddress(safe)}</Text>
              <Avatar
                src={ArrowUpRightIcon.src}
                size={20}
                ml="auto"
                sx={{
                  ":hover": {
                    color: "white",
                  },
                }}
                onClick={() =>
                  window.open(
                    `https://polygonscan.com/address/${safe}`,
                    "_blank"
                  )
                }
              />
            </Group>
          ))}

          <Button onClick={() => undefined} loading={loading} fullWidth>
            confirm
          </Button>
          {signError && <Text type="danger">{signError.message}</Text>}
          {error && <Text type="danger">{error}</Text>}
        </Stack>
      )}
    </WalletConnectionFence>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const token = await getToken({ req: context.req });

  const address = token?.sub ?? null;

  console.log("session", session);
  console.log("token", token);

  return {
    props: {
      address,
      session,
    },
  };
};

export default SignPage;
