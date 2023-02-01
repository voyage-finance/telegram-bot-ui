import { ChainID } from "@types";
import { networks } from "consts/networks";

export const getChainIdFromShortName = (shortName: string) => {
  return networks.find((n) => n.shortName == shortName)?.chainId as ChainID;
};
