import { ChainID, Network } from "@types";

export const CHAIN_ID_NETWORK: Record<ChainID, Network> = {
  [ChainID.Mainnet]: Network.Mainnet,
  [ChainID.Goerli]: Network.Goerli,
  [ChainID.Hardhat]: Network.Hardhat,
};

export const alchemyApiKey = "IG5Is2xWE1WkB-h0cN1NX58xw_74WEZj";

export const chainId: ChainID = 137;

export const network: Network = CHAIN_ID_NETWORK[chainId];

export const explorerUrl: string = "explorerUrl";

export const extensionId = process.env.NEXT_PUBLIC_EXTENSION_ID || "";

const config = {
  chainId,
  network,
  explorerUrl,
  extensionId,
};

export default config;
