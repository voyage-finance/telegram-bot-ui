import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "@components/layouts/Layout";
import { configureChains, createClient, mainnet, WagmiConfig } from "wagmi";
import { polygon } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { SessionProvider } from "next-auth/react";
import {
  darkTheme,
  getDefaultWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { SafeServiceProvider } from "@components/layouts/SafeServiceProvider";
import { SafeSdkProvider } from "@components/layouts/SafeSdkProvider";

const { chains, provider } = configureChains(
  [polygon, mainnet],
  [
    alchemyProvider({ apiKey: "IG5Is2xWE1WkB-h0cN1NX58xw_74WEZj" }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "Voyage Safe App",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <SessionProvider refetchInterval={0} session={pageProps.session}>
        <RainbowKitProvider
          chains={chains}
          showRecentTransactions={true}
          theme={darkTheme({
            accentColor: "#FF9034",
            accentColorForeground: "white",
            borderRadius: "small",
            fontStack: "system",
            overlayBlur: "small",
          })}
        >
          <SafeServiceProvider>
            <SafeSdkProvider>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </SafeSdkProvider>
          </SafeServiceProvider>
        </RainbowKitProvider>
      </SessionProvider>
    </WagmiConfig>
  );
}
