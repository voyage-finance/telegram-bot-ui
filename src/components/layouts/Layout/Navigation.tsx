import { Box, createStyles, Group, Stack, Header } from "@mantine/core";
import Image from "next/image";
import { useIsMounted } from "@utils/hooks";
import React, { ReactEventHandler } from "react";
import WalletNavItem from "@components/moleculas/ConnectBtn";
import { Divider, Text } from "@components/atoms";
import ConnectBtn from "@components/moleculas/ConnectBtn";

const HEADER_HEIGHT = 48;

const useStyles = createStyles(() => ({
  logo: {
    display: "flex",
    alignItems: "center",
    marginRight: 50,
  },
  wallet: {
    display: "flex",
    flex: "0 0 auto",
    alignItems: "center",
  },
}));

const Logo = React.forwardRef<
  HTMLAnchorElement,
  Partial<{ href: string; onClick: ReactEventHandler }>
>((props, ref) => {
  return (
    <a {...props} ref={ref} style={{ display: "inline-flex" }}>
      <Image
        src="/logo-voyage-light.svg"
        alt="Voyage logo"
        height={25}
        width={80}
        style={{ marginRight: 50, cursor: "pointer" }}
      />
    </a>
  );
});

Logo.displayName = "Logo";

const Navigation: React.FC = () => {
  const { classes } = useStyles();
  const isMounted = useIsMounted();
  return (
    <Stack>
      <Header
        height={HEADER_HEIGHT}
        sx={(theme) => ({
          flex: "1 0 auto",
          backgroundColor: theme.colors.dark[6],
          border: "none",
        })}
      >
        <Group
          sx={{
            height: "100%",
            padding: "0 16px",
          }}
        >
          <a className={classes.logo} href="/">
            <Text weight="bold">Voyage Safe</Text>
          </a>
          <Divider
            sx={{
              marginLeft: "auto",
            }}
            size="sm"
            orientation="vertical"
          />
          <Box className={classes.wallet}>
            <ConnectBtn />
          </Box>
        </Group>
      </Header>
    </Stack>
  );
};

export default Navigation;
