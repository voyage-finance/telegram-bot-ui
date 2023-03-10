import { Button, Text } from "@components/atoms";
import Card from "@components/moleculas/Card";
import { Group, Stack } from "@mantine/core";
import { verifyMessage } from "ethers/lib/utils.js";
import { useRouter } from "next/dist/client/router";
import * as React from "react";
import { useAccount, useNetwork, useSignMessage } from "wagmi";
import WalletConnectionFence from "@components/moleculas/WalletConnectionFence";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { getToken } from "next-auth/jwt";
import { submitUserVerify } from "api";
import { SiweMessage } from "siwe";
import TitleWithLine from "@components/moleculas/TitleWithLine";

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

  const recoveredAddress = React.useRef<string>();

  const [siweMessage, setSiweMessage] = React.useState("");

  const { error: signError, signMessage } = useSignMessage({
    async onSuccess(data, variables) {
      try {
        const address = verifyMessage(variables.message, data);
        recoveredAddress.current = address;
        setLoading(true);
        const response = await submitUserVerify(
          msg_id,
          variables.message.toString(),
          data
        );
        setLoading(false);
        if (response.ok) router.push("/sign/success");
        else {
          const error = await response.json();
          throw new Error(error);
        }
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

  React.useEffect(() => {
    const siweMsg = createSiweMessage(address!, message, chain?.id);
    console.log(siweMsg);
    setSiweMessage(siweMsg);
  }, []);

  return (
    <WalletConnectionFence>
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
