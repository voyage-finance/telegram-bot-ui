import { Button, Text } from "@components/atoms";
import Card from "@components/moleculas/Card";
import { Avatar, Box, Group, Stack } from "@mantine/core";
import { verifyMessage } from "ethers/lib/utils.js";
import { useRouter } from "next/dist/client/router";
import * as React from "react";
import { useSignMessage } from "wagmi";
import copy from "copy-to-clipboard";
import CopyTooltip from "@components/atoms/CopyTooltip";
import { Copy } from "tabler-icons-react";
import WalletConnectionFence from "@components/moleculas/WalletConnectionFence";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { getToken } from "next-auth/jwt";
import { submitUserVerify } from "api";

interface ISignPageProps {}

function hexToBytes(hex: string) {
  for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
  return bytes;
}

const SignPage: React.FunctionComponent<ISignPageProps> = (props) => {
  const router = useRouter();

  const { message, name, msg_id } = router.query as any;
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const recoveredAddress = React.useRef<string>();
  const {
    data: signedData,
    error: signError,
    isLoading,
    signMessage,
  } = useSignMessage({
    async onSuccess(data, variables) {
      try {
        const address = verifyMessage(variables.message, data);
        recoveredAddress.current = address;
        setLoading(true);
        const response = await submitUserVerify(msg_id, message, data);
        setLoading(false);
        if (response.ok) router.push("/sign-success");
        else
          throw new Error(`Error: ${response.status} ${response.statusText}`);
      } catch (e: any) {
        setLoading(false);
        setError(e.message);
      }
    },
  });

  const onSign = () => {
    const bytesValue: Uint8Array = hexToBytes(
      (message as string).slice(2)
    ) as any;

    signMessage({ message: bytesValue });
  };

  return (
    <WalletConnectionFence>
      <Stack
        mt={56}
        sx={{
          marginInline: "auto",
        }}
        align="center"
      >
        <Card sx={{ padding: 14, maxWidth: 600 }}>
          <Text sx={{ wordBreak: "break-all" }}>{message}</Text>
        </Card>
        <Button onClick={onSign} loading={loading}>
          Sign Message
        </Button>
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
