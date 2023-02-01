import { Text } from "@components/atoms";
import { Box, BoxProps, Center, Group, Stack } from "@mantine/core";
import { useIsMounted } from "@utils/hooks";
import { useAccount } from "wagmi";
import ConnectBtn from "../ConnectBtn";
import { AlertTriangle } from "tabler-icons-react";

const WalletConnectionFence: React.FC<BoxProps> = ({ children, ...props }) => {
  const isMounted = useIsMounted();
  const data = useAccount();
  if (data.isConnected && isMounted) return <>{children}</>;
  else
    return (
      <Box
        sx={{
          width: "100wh",
          height: "100vh",
          background: "linear-gradient(180deg, #333c62 0%, #25283d 100%)",
        }}
      >
        <Center h={"100%"}>
          <Group>
            <AlertTriangle size={24} color="white" />
            <Text>Connect your wallet to continue.</Text>
            <ConnectBtn />
          </Group>
        </Center>
      </Box>
    );
};

export default WalletConnectionFence;
