import { Text } from "@components/atoms";
import { BoxProps, Center, Stack } from "@mantine/core";
import { useIsMounted } from "@utils/hooks";
import { useAccount } from "wagmi";
import ConnectBtn from "../WalletNavItem/ConnectBtn";

const WalletConnectionFence: React.FC<BoxProps> = ({ children, ...props }) => {
  const isMounted = useIsMounted();
  const data = useAccount();
  if (data.isConnected && isMounted) return <>{children}</>;
  else
    return (
      <Center {...props}>
        <Stack align="center">
          <Text>Connect your wallet to continue.</Text>
          <ConnectBtn />
        </Stack>
      </Center>
    );
};

export default WalletConnectionFence;
