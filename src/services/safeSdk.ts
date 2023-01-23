import {
  SafeAccountConfig,
  SafeDeploymentConfig,
  SafeFactory,
} from "@safe-global/safe-core-sdk";
import Safe from "@safe-global/safe-core-sdk";
import EthersAdapter from "@safe-global/safe-ethers-lib";
import { alchemyApiKey, chainId } from "@utils/config";
import { ethers } from "ethers";

export class SafeService {
  private static _instance: SafeService | undefined;
  private static safeSdk: Safe | undefined;

  private constructor() {
    // Private constructor ensures singleton instance
  }

  async initialize(signer: any) {
    console.log("signer", signer);

    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: signer,
    });

    SafeService.safeSdk = await Safe.create({
      ethAdapter,
      safeAddress: "0x775ad9c18e0d8de7dfcffc8540a0203f61b39a7e",
    });
    return SafeService.safeSdk;
  }

  async sdk() {
    if (!SafeService.safeSdk) {
      throw new Error("SDK requested before initialization");
    }

    return SafeService.safeSdk;
  }

  static instance(): SafeService {
    if (!this._instance) {
      return new SafeService();
    }

    return this._instance;
  }
}
