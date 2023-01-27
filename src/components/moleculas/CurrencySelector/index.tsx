import { Group, Menu, Stack } from "@mantine/core";
import * as React from "react";
import { ChevronDown } from "tabler-icons-react";
import { formatAmount } from "@utils/bn";
import { Text } from "@components/atoms";

export enum TOKEN {
  WETH,
  ETH,
}

const CurrencySelector: React.FunctionComponent<{
  value?: TOKEN;
  onChange?: (value: TOKEN) => void;
}> = ({ value, onChange }) => {
  return (
    <Menu
      shadow="md"
      position="bottom"
      styles={
        {
          // dropdown: {
          //   width: 306,
          //   height: 352,
          //   borderRadius: 10,
          //   background: "#242940",
          //   border: "1px solid rgba(255, 255, 255, 0.1)",
          //   padding: 10,
          //   overflowY: "scroll",
          //   position: "relative",
          // },
          // item: {
          //   borderRadius: 10,
          //   padding: "6px 8px",
          //   ":hover": {
          //     background: "rgba(27, 29, 44, 0.6)",
          //   },
          // },
          // itemLabel: {
          //   display: "flex",
          //   alignItems: "center",
          // },
        }
      }
    >
      <Menu.Target>
        <Group
          py={6}
          px={8}
          spacing={0}
          sx={{
            borderRadius: 10,
            background: "rgba(27, 29, 44, 0.6)",
            ":hover": { cursor: "pointer" },
          }}
        >
          {/* {value != undefined &&
            (value == TOKEN.ETH ? <EthSvg /> : <WethSvg />)} */}
          <Stack spacing={0} ml={8}>
            <Text weight="bold">
              {value != undefined
                ? value == TOKEN.ETH
                  ? "Ethereum"
                  : "Wrapped Ethereum"
                : "Select Token"}
            </Text>
            <Text type="secondary" size="sm">
              {value != undefined ? `Balance: ` : "MATIC"}
            </Text>
          </Stack>
          <ChevronDown style={{ marginTop: 1, marginLeft: "auto" }} size={18} />
        </Group>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          onClick={() => onChange?.(TOKEN.ETH)}
          rightSection={undefined}
        >
          <Text weight="bold">WIP</Text>
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default CurrencySelector;
