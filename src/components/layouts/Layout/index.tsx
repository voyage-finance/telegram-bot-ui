import { AppShell, MantineProvider } from "@mantine/core";
import React from "react";
import Navigation from "./Navigation";
import { useRouter } from "next/router";

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const isOnboardingFlow = router.pathname === "/onboard";

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: "dark",
        colors: {
          dark: [
            "#2B2F53",
            "#282C4B",
            "#252843",
            "#22253C",
            "#202236",
            "#1D2031",
            "#1B1D2C",
            "#181A28",
            "#151724",
            "#131421",
          ],
          brand: [
            "#FFFBF8",
            "#FFE2C9",
            "#FFCA9E",
            "#FFB578",
            "#FFA254",
            "#FF9034",
            "#FF811D",
            "#FF7000",
            "#EC6500",
            "#D45B00",
          ],
          "accent-green": [
            "#7EFFEA",
            "#5AFFE4",
            "#3AFFDF",
            "#1FFFD9",
            "#0AFDD1",
            "#08E7BE",
            "#0CCDAA",
            "#06BD9C",
            "#02AE8F",
            "#00A183",
          ],
          "accent-pink": [
            "#FFE0EC",
            "#FFB4D0",
            "#FF8BB6",
            "#FF669F",
            "#FF498B",
            "#FA307A",
            "#F41B6A",
            "#EE065A",
            "#DC0050",
            "#CA0047",
          ],
          "accent-blue": [
            "#FEFEFF",
            "#CEE5FF",
            "#A3CEFF",
            "#7CBAFF",
            "#59A7FF",
            "#3D96FF",
            "#1884FF",
            "#0075FF",
            "#0069EC",
            "#005FD5",
          ],
          gray: ["#6F7073", "#A4A5A8"],
        },
        primaryColor: "brand",
        fontFamily: "Titillium Web, sans-serif",
        fontSizes: {
          sm: 11,
          md: 14,
          lg: 16,
        },
        headings: { fontFamily: "Titillium Web, sans-serif" },
        other: {
          gradients: {
            brand: { from: "#ffa620", to: "#ef5b25", deg: 90 },
          },
        },
      }}
    >
      <AppShell
        header={<Navigation />}
        styles={(theme) => ({
          root: {
            display: "flex",
            flexDirection: "column",
            minHeight: "100%",
            width: "100%",
          },
          body: {
            display: "flex",
            flexDirection: "column",
            flex: "1 0",
            width: "100%",
            overflowY: "auto",
            background: isOnboardingFlow
              ? `url('./onboarding-bg.png')`
              : theme.fn.linearGradient(180, "#333c62", "#25283d"),
            backgroundSize: "cover",
          },
          main: {
            display: "flex",
            flexDirection: "column",
            width: "100%",
            ...(isOnboardingFlow
              ? {
                  justifyContent: "center",
                  alignItems: "center",
                }
              : {}),
          },
        })}
      >
        {children}
      </AppShell>
    </MantineProvider>
  );
};

export default Layout;
