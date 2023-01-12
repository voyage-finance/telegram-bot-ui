import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "@components/layouts/Layout";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WagmiConfig, createClient, configureChains, mainnet } from "wagmi";

const { chains, provider } = configureChains(
  [mainnet],
  [alchemyProvider({ apiKey: "IG5Is2xWE1WkB-h0cN1NX58xw_74WEZj" })]
);

const mm = new MetaMaskConnector({ chains });

const client = createClient({
  autoConnect: true,
  connectors: [new MetaMaskConnector({ chains })],
  provider,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={client}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </WagmiConfig>
  );
}
