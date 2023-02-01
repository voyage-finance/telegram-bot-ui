import {
  OperationType,
  SafeTransactionDataPartial,
} from "@safe-global/safe-core-sdk-types";
import { erc20ABI, prepareSendTransaction } from "@wagmi/core";
import { ethers } from "ethers";

export const buildTransaction: (v: {
  amount: string;
  receiverAddress: string;
  nonce: number;
  tokenAddress?: string;
}) => Promise<SafeTransactionDataPartial> = async ({
  amount,
  receiverAddress,
  tokenAddress,
  nonce,
}) => {
  if (tokenAddress) {
    console.log(
      "sending",
      receiverAddress,
      ethers.utils.parseUnits(amount, 18).toString()
    );

    const tokenContract = new ethers.Contract(tokenAddress, erc20ABI);

    const preparedTx = await tokenContract.populateTransaction.transfer(
      receiverAddress,
      ethers.utils.parseUnits(amount, 18).toString()
    );

    const res: SafeTransactionDataPartial = {
      to: tokenAddress,
      value: "0",
      data: preparedTx.data || "0x",
      operation: OperationType.Call,
      nonce,
    };
    return res;
  } else {
    return {
      to: receiverAddress,
      value: ethers.utils.parseUnits(amount, 18).toString(),
      data: "0x",
      operation: OperationType.Call,
      nonce,
    };
  }
};
