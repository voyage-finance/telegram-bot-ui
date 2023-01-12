import MetamaskSvg from "@assets/icons/metamask.svg";
import Divider from "@components/atoms/Divider";
import { MenuItem } from "@components/atoms/Menu";
import { Avatar, Group, Menu as MantineMenu, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  ChevronDown,
  Copy,
  History,
  Power,
  Settings,
  Wallet,
} from "tabler-icons-react";
import { useAccount, useDisconnect } from "wagmi";
import ConnectBtn from "./ConnectBtn";

const ConnectWallet: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const getShortenedAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.slice(-4)}`;
  };

  return mounted ? (
    isConnected ? (
      <MantineMenu>
        <MantineMenu.Target>
          <Group
            sx={() => ({
              "&:hover": {
                cursor: "pointer",
              },
            })}
          >
            <Avatar src={MetamaskSvg.src} radius="xl" size={20} />
            <Text size="sm" color={"white"}>
              {getShortenedAddress(address || "")}
            </Text>
            <ChevronDown size={12} color={"white"} />
          </Group>
        </MantineMenu.Target>
        <MantineMenu.Dropdown>
          <MenuItem icon={<Copy />} rightSection={<ArrowUpRight size={14} />}>
            Copy address
          </MenuItem>
          <Divider />
          <MenuItem icon={<Wallet />}>Balance</MenuItem>
          <MenuItem icon={<History />}>History</MenuItem>
          <MenuItem icon={<Settings />}>Settings</MenuItem>
          <Divider />
          <MenuItem
            icon={<Power color="#E84747" />}
            onClick={() => disconnect()}
          >
            <Text inherit color="#E84747">
              Disconnect
            </Text>
          </MenuItem>
        </MantineMenu.Dropdown>
      </MantineMenu>
    ) : (
      <ConnectBtn />
    )
  ) : null;
};

export default ConnectWallet;
