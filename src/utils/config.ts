import { ChainID, Network } from "@types";
import { isValidEip3770NetworkPrefix } from "@safe-global/safe-core-sdk-utils";
export const CHAIN_ID_NETWORK: Record<ChainID, Network> = {
  [ChainID.Mainnet]: Network.Mainnet,
  [ChainID.Polygon]: Network.Polygon,
};

export const alchemyApiKey = "IG5Is2xWE1WkB-h0cN1NX58xw_74WEZj";

// export const chainId: ChainID = 137;

// export const network: Network = CHAIN_ID_NETWORK[chainId];

export const explorerUrl: string = "explorerUrl";

export const extensionId = process.env.NEXT_PUBLIC_EXTENSION_ID || "";

const config = {
  explorerUrl,
  extensionId,
};

export default config;
