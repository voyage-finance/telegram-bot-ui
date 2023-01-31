export enum Environment {
  Development = "development",
  Staging = "staging",
  Production = "production",
}

export enum Network {
  Mainnet = "mainnet",
  Polygon = "polygon",
}

export enum ChainID {
  Mainnet = 1,
  Polygon = 137,
}

export enum MessageAction {
  AUTH_SUCCESS = "auth_success",
  GET_FINGERPRINT = "get_fingerprint",
}

export interface RuntimeMessage {
  action: MessageAction;
  params?: any;
}
