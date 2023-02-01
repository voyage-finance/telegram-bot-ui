import { Text } from "@components/atoms";
import c, { CHAIN_ID_NETWORK } from "@utils/config";
import { Box, Button, Center, Group, Header } from "@mantine/core";
import { AlertTriangle } from "tabler-icons-react";
import { PropsWithChildren } from "react";
import { ChainID } from "@types";
import { useSwitchNetwork } from "wagmi";
import { useIsMounted } from "@utils/hooks";

const WrongNetworkFence: React.FC<
  PropsWithChildren<{
    currentChainId: ChainID;
    urlChainId: ChainID;
  }>
> = ({ currentChainId, urlChainId, children }) => {
  const { switchNetwork } = useSwitchNetwork();
  const isMounted = useIsMounted();
  return isMounted ? (
    <>
      {currentChainId != urlChainId ? (
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
              <Text size="lg">
                Please switch to {CHAIN_ID_NETWORK[urlChainId]}
              </Text>
              <Button
                sx={(theme) => ({
                  background: "white",
                  color: "#000",
                  mixBlendMode: "screen",
                  height: 24,
                  "&:hover": {
                    backgroundColor: theme.fn.rgba("#fff", 0.8),
                  },
                })}
                px={8}
                onClick={() => switchNetwork?.(urlChainId)}
              >
                Switch network
              </Button>
            </Group>
          </Center>
        </Box>
      ) : (
        children
      )}
    </>
  ) : (
    <></>
  );
};

export default WrongNetworkFence;
