import { Avatar, Box, Group, Menu, Stack } from "@mantine/core";
import * as React from "react";
import { ChevronDown } from "tabler-icons-react";
import { Text } from "@components/atoms";
import { useSafeService } from "@components/layouts/SafeServiceProvider";
import { SafeCollectibleResponse } from "@safe-global/safe-service-client";
import { ethers, utils } from "ethers";
import { useNetwork } from "wagmi";
import PepePlacehoder from "@assets/images/pepe-placeholder.png";
import CheckOrangeSvg from "@assets/icons/check-orange.svg";
import ImageWithFallback from "@components/atoms/ImageWithFallback";

const NFTSelector: React.FunctionComponent<{
  walletAddress?: string;
  value?: SafeCollectibleResponse;
  onChange?: (value: SafeCollectibleResponse) => void;
}> = ({ walletAddress, value, onChange }) => {
  const { chain } = useNetwork();
  const [tokens, setTokens] = React.useState<SafeCollectibleResponse[]>([]);
  const { service } = useSafeService();

  const fetchTokens = async () => {
    if (service && walletAddress && chain) {
      console.log(await service?.getCollectibles(walletAddress as string));
      setTokens(await service?.getCollectibles(walletAddress as string));
    } else {
      console.log("one of [service && walletAddress && chain] is undefined");
    }
  };

  React.useEffect(() => {
    fetchTokens();
  }, [service, chain]);

  return (
    <Menu
      shadow="md"
      position="bottom"
      width={450}
      styles={{
        item: {
          ":hover": {
            background: "rgba(27, 29, 44, 0.6)",
          },
        },
      }}
    >
      <Menu.Target>
        <Group
          py={8}
          px={16}
          spacing={0}
          sx={{
            borderRadius: 10,
            background: "rgba(27, 29, 44, 0.6)",
            ":hover": { cursor: "pointer" },
          }}
        >
          <ImageWithFallback
            src={value?.imageUri || PepePlacehoder.src}
            fallbackSrc={PepePlacehoder.src}
            alt="logo"
            width={38}
            height={38}
            style={{
              borderRadius: 10,
            }}
          />
          <Stack spacing={0} ml={8}>
            <Text weight="bold">{value?.name || "Select NFT"}</Text>
            <Text type="secondary" size="sm">
              {value?.tokenName}
            </Text>
          </Stack>
          <ChevronDown
            style={{
              marginTop: 1,
              marginLeft: "auto",
              color: "rgba(255, 255, 255, 0.35)",
            }}
            size={28}
          />
        </Group>
      </Menu.Target>
      <Menu.Dropdown sx={{ background: "#242940" }}>
        {tokens.map((token) => (
          <Menu.Item
            key={token.id}
            onClick={() => onChange?.(token)}
            rightSection={undefined}
            sx={{
              width: "100%",
            }}
          >
            <Group py={8} px={8} spacing={0}>
              <ImageWithFallback
                src={token.imageUri}
                fallbackSrc={PepePlacehoder.src}
                alt="logo"
                width={38}
                height={38}
                style={{
                  borderRadius: 10,
                }}
              />
              <Stack spacing={0} ml={8}>
                <Text weight="bold">{token.name}</Text>
                <Text type="secondary" size="sm">
                  {token.tokenName}
                </Text>
              </Stack>
              {value == token && (
                <Box w={24} h={24} ml="auto">
                  <img src={CheckOrangeSvg.src} />
                </Box>
              )}
            </Group>
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};

export default NFTSelector;
