import { Avatar, Box, Group, Menu, Stack } from "@mantine/core";
import * as React from "react";
import { ChevronDown } from "tabler-icons-react";
import { Text } from "@components/atoms";
import { useSafeService } from "@components/layouts/SafeServiceProvider";
import { SafeBalanceResponse } from "@safe-global/safe-service-client";
import { ethers, utils } from "ethers";
import { useNetwork } from "wagmi";
import TokenPlacehoderSvg from "@assets/icons/token-placeholder.svg";
import CheckOrangeSvg from "@assets/icons/check-orange.svg";
import ImageWithFallback from "@components/atoms/ImageWithFallback";

const CurrencySelector: React.FunctionComponent<{
  walletAddress?: string;
  value?: SafeBalanceResponse;
  onChange?: (value: SafeBalanceResponse) => void;
  preselectedCurrency?: string;
}> = ({ walletAddress, value, onChange, preselectedCurrency }) => {
  const { chain } = useNetwork();
  const [tokens, setTokens] = React.useState<SafeBalanceResponse[]>([]);
  const { service } = useSafeService();

  const fetchTokens = async () => {
    if (service && walletAddress && chain) {
      const checksummedAddress = ethers.utils.getAddress(walletAddress);
      const tokens = (
        await service?.getBalances(checksummedAddress as string)
      ).map((response) =>
        response.token
          ? response
          : {
              ...response,
              token: {
                ...chain!.nativeCurrency,
                logoUri: `https://safe-transaction-assets.safe.global/chains/${
                  chain!.id
                }/currency_logo.png`,
              },
            }
      );
      setTokens(tokens);
      const preselectedToken = tokens.find((t) => t.token.name);
      if (preselectedToken) {
        onChange?.(preselectedToken);
      }
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
            src={value?.token?.logoUri || TokenPlacehoderSvg.src}
            fallbackSrc={TokenPlacehoderSvg.src}
            alt="logo"
            width={24}
            height={24}
          />
          <Stack spacing={0} ml={8}>
            <Text weight="bold">{value?.token?.name || "Select Token"}</Text>
            <Text type="secondary" size="sm">
              Balance:{" "}
              <strong style={{ color: "white" }}>
                {value &&
                  parseFloat(
                    Number(ethers.utils.formatEther(value.balance)).toFixed(5)
                  )}
              </strong>{" "}
              {value?.token.symbol}
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
            key={token.tokenAddress}
            onClick={() => onChange?.(token)}
            rightSection={undefined}
            sx={{
              width: "100%",
            }}
          >
            <Group py={8} px={16} spacing={0}>
              <ImageWithFallback
                src={token.token?.logoUri}
                fallbackSrc={TokenPlacehoderSvg.src}
                alt="logo"
                width={24}
                height={24}
              />
              <Stack spacing={0} ml={8}>
                <Text weight="bold">{token.token?.name}</Text>
                <Text type="secondary" size="sm">
                  Balance:{" "}
                  <strong style={{ color: "white" }}>
                    {parseFloat(
                      Number(ethers.utils.formatEther(token.balance)).toFixed(5)
                    )}
                  </strong>{" "}
                  {token.token.symbol}
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

export default CurrencySelector;
