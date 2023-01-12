import MetamaskSvg from "@assets/icons/metamask.svg";
import { Modal, Text } from "@components/atoms";
import { Avatar, Button, Group, Stack } from "@mantine/core";
import { useConnect } from "wagmi";

const PRIVACY_POLICY_URL = "https://www.voyage.finance/privacy-policy";

const ConnectWalletModal: React.FC<{
  opened: boolean;
  onClose: () => void;
}> = ({ opened, onClose }) => {
  const {
    connect,
    connectors: [mm],
  } = useConnect();

  return (
    <Modal opened={opened} onClose={onClose} title="Select a Wallet">
      <Stack align="stretch">
        <Text>
          By connecting a wallet, I agree to Voyage Finance’s Terms of Use and{" "}
          <Text component="a" href={PRIVACY_POLICY_URL} underline weight="bold">
            Privacy Policy
          </Text>
          .
        </Text>
        <Button
          disabled={!mm.ready}
          onClick={() => {
            connect({ connector: mm });
            onClose();
          }}
          style={{ margin: "auto" }}
          fullWidth
          sx={(theme) => ({
            background: theme.fn.rgba("#fff", 0.1),
            height: 65,
            "&:hover": {
              background: "rgba(27, 29, 44, 0.6)",
            },
            "&:disabled": {
              color: "white !important",
            },
          })}
          styles={{
            inner: {
              justifyContent: "flex-start",
              padding: "20px 30px",
            },
          }}
          radius={10}
        >
          <Group>
            <Avatar src={MetamaskSvg.src} radius="xl" size={25} />
            <Text weight={400}>Metamask</Text>
          </Group>
        </Button>
        {!mm.ready && (
          <Text size="sm" align="center" type="danger">
            Error: Metamask extension not found. Download Metamask to use
            Voyage.
          </Text>
        )}
      </Stack>
    </Modal>
  );
};

export default ConnectWalletModal;
