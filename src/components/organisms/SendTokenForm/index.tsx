import { Button, Text } from "@components/atoms";
import Card from "@components/moleculas/Card";
import ConnectBtn from "@components/moleculas/ConnectBtn";
import { Group, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  OperationType,
  SafeTransactionDataPartial,
} from "@safe-global/safe-core-sdk-types";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useSigner } from "wagmi";
import styles from "./styles.module.scss";
import { useRouter } from "next/router";
import { showNotification } from "@mantine/notifications";
import CurrencySelector from "@components/moleculas/CurrencySelector";
import { useSafeService } from "@components/layouts/SafeServiceProvider";
import { SafeBalanceResponse } from "@safe-global/safe-service-client";
import { buildTransaction } from "@utils/transaction";
import { checkAddressChecksum } from "ethereum-checksum-address";
import { notifyTransaction } from "api";
import { useSafeSdk } from "@components/layouts/SafeSdkProvider";

const SendTokenForm: React.FC<{
  amount?: string;
  to?: string;
  currency?: string;
  chatId?: string;
}> = ({ amount, to, chatId, currency }) => {
  const { data: signer } = useSigner();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { service } = useSafeService();
  const { sdk, safeAddress, chainPrefix } = useSafeSdk();

  const form = useForm({
    initialValues: {
      address: "",
      amount: amount || "",
      selectedToken: undefined as SafeBalanceResponse | undefined,
    },
    validate: {
      address: (value) => {
        if (value) {
          if (value.length > 2 && checkAddressChecksum(value)) {
            return null;
          }
          return "Enter a valid Ethereum address.";
        }
        return "Enter recipient address.";
      },
      selectedToken: (value) => {
        if (!value) return "Select Token";
        return null;
      },
    },
  });

  const handleFormSubmit = async () => {
    try {
      setIsLoading(true);
      if (service && sdk) {
        const nonce = await service.getNextNonce(safeAddress as string);
        const safeAddressChecksummed = ethers.utils.getAddress(
          safeAddress as string
        );

        const safeTransactionData: SafeTransactionDataPartial =
          await buildTransaction({
            receiverAddress: form.values.address,
            tokenAddress: form.values.selectedToken?.tokenAddress,
            nonce,
            amount: form.values.amount,
          });
        const safeTransaction = await sdk.createTransaction({
          safeTransactionData,
        });
        console.log("safeTransaction", safeTransaction);

        const senderAddress = await signer!.getAddress();
        const safeTxHash = await sdk.getTransactionHash(safeTransaction);
        const signature = await sdk.signTransactionHash(safeTxHash);

        console.log("safeTxHash", safeTxHash);
        console.log("signature", signature);

        // Propose transaction to the service
        await service.proposeTransaction({
          safeAddress: safeAddressChecksummed,
          safeTransactionData: safeTransaction.data,
          safeTxHash,
          senderAddress,
          senderSignature: signature.data,
        });

        showNotification({
          message: <Text size="lg">Transaction is submitted successfully</Text>,
          autoClose: 3000,
        });

        const txId = `multisig_${safeAddress}_${safeTxHash}`;
        await notifyTransaction(txId, chainPrefix!, chatId!);
        form.setValues({ address: "", amount: "" });
      }
    } catch (e: any) {
      setErrorMessage(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (to) {
      try {
        const checksumedAddres = ethers.utils.getAddress(to);
        form.setFieldValue("address", checksumedAddres);
      } catch (e) {
        console.error(e);
      }
    }
  }, [to]);

  return (
    <form onSubmit={form.onSubmit(handleFormSubmit)}>
      <Stack
        sx={{
          marginInline: "auto",
        }}
        align="stretch"
      >
        <div>
          <CurrencySelector
            preselectedCurrency={currency}
            walletAddress={safeAddress}
            value={form.values.selectedToken}
            onChange={(value) => form.setFieldValue("selectedToken", value)}
          />
          {form.errors.selectedToken && (
            <Text type="danger" lineClamp={4}>
              {form.errors.selectedToken}
            </Text>
          )}
        </div>
        <TextInput
          placeholder="Enter recipient address"
          className={styles.addressInput}
          size="lg"
          {...form.getInputProps("address")}
        />
        <TextInput
          placeholder="Enter amount"
          className={styles.addressInput}
          type="number"
          rightSection={
            <Group spacing={12} position="right" noWrap>
              <Text type="gradient" weight="bold">
                {form.values.selectedToken?.token.symbol}
              </Text>
            </Group>
          }
          size="lg"
          styles={{
            input: {
              paddingRight: 96,
            },
            rightSection: {
              right: 12.5,
              width: 78,
            },
          }}
          {...form.getInputProps("amount")}
        />
        <Button loading={isLoading} type="submit">
          Submit transaction
        </Button>
        {errorMessage && (
          <Text type="danger" mt={12} align="center" lineClamp={4}>
            {errorMessage}
          </Text>
        )}
      </Stack>
    </form>
  );
};

export default SendTokenForm;
