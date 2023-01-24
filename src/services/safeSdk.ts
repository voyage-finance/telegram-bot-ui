import Safe from "@safe-global/safe-core-sdk";
import EthersAdapter from "@safe-global/safe-ethers-lib";
import { ethers } from "ethers";
import SafeServiceClient from "@safe-global/safe-service-client";

export class SafeService {
  private static _instance: SafeService | undefined;
  private static safeSdk: Safe | undefined;
  private static service: SafeServiceClient;
  private constructor() {
    // Private constructor ensures singleton instance
  }

  async initialize(signer: any, safeAddress: string) {
    console.log("signer", signer);

    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: signer,
    });

    SafeService.safeSdk = await Safe.create({
      ethAdapter,
      safeAddress,
    });

    SafeService.service = new SafeServiceClient({
      txServiceUrl: "https://safe-transaction-mainnet.safe.global",
      ethAdapter,
    });

    return SafeService.safeSdk;
  }

  async sdk() {
    if (!SafeService.safeSdk) {
      throw new Error("SDK requested before initialization");
    }

    return SafeService.safeSdk;
  }

  async service() {
    if (!SafeService.service) {
      throw new Error("SDK requested before initialization");
    }

    return SafeService.service;
  }

  static instance(): SafeService {
    if (!this._instance) {
      return new SafeService();
    }

    return this._instance;
  }
}
