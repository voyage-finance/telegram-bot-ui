export enum Environment {
  Development = "development",
  Staging = "staging",
  Production = "production",
}

export enum Network {
  Mainnet = "mainnet",
  Goerli = "goerli",
  Hardhat = "hardhat",
}

export enum ChainID {
  Mainnet = 1,
  Goerli = 5,
  Hardhat = 31337,
}

export enum MessageAction {
  AUTH_SUCCESS = "auth_success",
  GET_FINGERPRINT = "get_fingerprint",
}

export interface RuntimeMessage {
  action: MessageAction;
  params?: any;
}
