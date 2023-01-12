import Text from "@components/atoms/Text";
import c from "@utils/config";
import { Button, Center, Group, Header } from "@mantine/core";
import { useIsWrongNetwork } from "@hooks";
import { AlertTriangle } from "tabler-icons-react";

const HEADER_HEIGHT = 48;

const WrongNetworkBanner: React.FC = () => {
  const [, switchNetwork] = useIsWrongNetwork();
  return (
    <Header
      height={HEADER_HEIGHT}
      sx={(theme) => ({
        background: theme.fn.linearGradient(
          90,
          theme.other.gradients.brand.from,
          theme.other.gradients.brand.to
        ),
        border: "none",
      })}
    >
      <Center sx={{ height: "100%" }}>
        <Group>
          <AlertTriangle size={24} color="white" />
          <Text size="lg">Please switch to {c.network}</Text>
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
            onClick={() => switchNetwork()}
          >
            Switch network
          </Button>
        </Group>
      </Center>
    </Header>
  );
};

export default WrongNetworkBanner;
