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

interface ISignPageProps {}

function hexToBytes(hex: string) {
  for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
  return bytes;
}

const SignPage: React.FunctionComponent<ISignPageProps> = (props) => {
  const router = useRouter();

  const { message, name } = router.query as any;
  const [copied, setCopied] = React.useState(false);

  const recoveredAddress = React.useRef<string>();
  const {
    data: signedData,
    error,
    isLoading,
    signMessage,
  } = useSignMessage({
    onSuccess(data, variables) {
      // Verify signature when sign message succeeds
      const address = verifyMessage(variables.message, data);
      recoveredAddress.current = address;
    },
  });

  const onCopy = () => {
    copy(`/submitowner ${name} ${message} ${signedData}`);
    setCopied(true);
  };

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
        {signedData ? (
          <>
            <Card sx={{ padding: 14, maxWidth: 600 }}>
              <Text
                sx={{ wordBreak: "break-all" }}
              >{`/submitowner ${name} ${message} ${signedData}`}</Text>
            </Card>
            <CopyTooltip copied={copied}>
              <Group
                sx={{
                  cursor: "pointer",
                  padding: 4,
                  paddingInline: 12,
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: 4,
                }}
                onMouseLeave={() => setCopied(false)}
                onClick={onCopy}
                {...props}
              >
                <Copy style={{ color: "white" }} /> <Text> Copy</Text>
              </Group>
            </CopyTooltip>
          </>
        ) : (
          <>
            <Card sx={{ padding: 14, maxWidth: 600 }}>
              <Text sx={{ wordBreak: "break-all" }}>{message}</Text>
            </Card>
            <Button onClick={onSign}>Sign Message</Button>
          </>
        )}
        {error && <Text type="danger">{error.message}</Text>}
      </Stack>
    </WalletConnectionFence>
  );
};

export default SignPage;
