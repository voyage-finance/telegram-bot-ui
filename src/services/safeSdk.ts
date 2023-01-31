import Safe from "@safe-global/safe-core-sdk";
import EthersAdapter from "@safe-global/safe-ethers-lib";
import { ethers } from "ethers";
import SafeServiceClient from "@safe-global/safe-service-client";
import { Network } from "@types";
import { Signer } from "@wagmi/core";

export class SafeService {
  private static _instance: SafeService | undefined;
  private static safeSdk: Safe | undefined;
  private static service: SafeServiceClient | undefined;
  private static signer: Signer | undefined;
  private constructor() {
    // Private constructor ensures singleton instance
  }

  async initialize(network: Network, signer: any, safeAddress?: string) {
    SafeService.safeSdk = undefined;
    SafeService.service = undefined;

    SafeService.signer = signer;

    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: signer,
    });

    if (safeAddress)
      SafeService.safeSdk = await Safe.create({
        ethAdapter,
        safeAddress,
      });

    const txServiceUrl = `https://safe-transaction-${network}.safe.global`;
    console.log(`Initializing safe service with link ${txServiceUrl}`);

    SafeService.service = new SafeServiceClient({
      txServiceUrl,
      ethAdapter,
    });

    return [SafeService.safeSdk, SafeService.service] as const;
  }

  sdk() {
    if (!SafeService.safeSdk) {
      throw new Error("SDK requested before initialization");
    }

    return SafeService.safeSdk;
  }

  signer() {
    if (!SafeService.signer) {
      throw new Error("signer requested before initialization");
    }

    return SafeService.signer;
  }

  service() {
    if (!SafeService.service) {
      throw new Error("service requested before initialization");
    }

    return SafeService.service;
  }

  isServiceReady(): boolean {
    return SafeService.service != undefined;
  }

  isSdkReady() {
    return SafeService.safeSdk != undefined;
  }

  static instance(): SafeService {
    if (!this._instance) {
      return new SafeService();
    }

    return this._instance;
  }
}
