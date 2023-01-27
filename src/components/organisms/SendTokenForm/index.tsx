import { Button, Text } from "@components/atoms";
import Card from "@components/moleculas/Card";
import ConnectBtn from "@components/moleculas/WalletNavItem/ConnectBtn";
import { Group, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  OperationType,
  SafeTransactionDataPartial,
} from "@safe-global/safe-core-sdk-types";
import { fetchSigner } from "@wagmi/core";
import { ethers } from "ethers";
import Head from "next/head";
import { useEffect, useState } from "react";
import { SafeService } from "services/safeSdk";
import { useSigner } from "wagmi";
import BigNumber from "bignumber.js";
import styles from "./styles.module.scss";
import TitleWithLine from "@components/moleculas/TitleWithLine";
import { formatAmount } from "@utils/bn";
import { useRouter } from "next/router";
import { showNotification } from "@mantine/notifications";
import CurrencySelector from "@components/moleculas/CurrencySelector";

export default function SendTokenForm() {
  const { data: signer } = useSigner();
  const router = useRouter();
  const { safeAddress } = router.query;

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm({
    initialValues: {
      address: "",
      amount: "",
    },
    validate: {
      address: (value) => {
        if (value) {
          if (value.length > 2) {
            //&& checkAddressChecksum(value)
            return null;
          }
          return "Enter a valid Ethereum address.";
        }
        return "Enter recipient address.";
      },
    },
  });

  const handleFormSubmit = async () => {
    try {
      setIsLoading(true);
      const safe = await SafeService.instance().sdk();
      const service = await SafeService.instance().service();
      const nonce = await safe.getNonce();
      const safeAddressChecksummed = ethers.utils.getAddress(
        safeAddress as string
      );
      console.log("nonce", nonce);

      const safeTransactionData: SafeTransactionDataPartial = {
        to: form.values.address,
        value: ethers.utils.parseUnits(form.values.amount, 18).toString(), // 1 wei
        data: "0x",
        operation: OperationType.Call,
        nonce: nonce,
      };
      const safeTransaction = await safe.createTransaction({
        safeTransactionData,
      });
      console.log("safeTransaction", safeTransaction);

      const senderAddress = await signer!.getAddress();
      const safeTxHash = await safe.getTransactionHash(safeTransaction);
      const signature = await safe.signTransactionHash(safeTxHash);

      console.log("safeTxHash", safeTxHash);
      console.log("signature", signature);

      // Propose transaction to the service
      const proposedTx = await service.proposeTransaction({
        safeAddress: safeAddressChecksummed,
        safeTransactionData: safeTransaction.data,
        safeTxHash,
        senderAddress,
        senderSignature: signature.data,
      });

      showNotification({
        message: <Text size="lg">Transaction is submitted successfully</Text>,
        autoClose: 1000,
      });
      form.setValues({ address: "", amount: "" });
    } catch (e: any) {
      setErrorMessage(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleFormSubmit)}>
      <Stack
        sx={{
          marginInline: "auto",
        }}
        align="stretch"
      >
        <CurrencySelector />
        <TextInput
          placeholder="Enter recipient address"
          className={styles.addressInput}
          size="md"
          {...form.getInputProps("address")}
        />
        <TextInput
          placeholder="Enter amount"
          className={styles.addressInput}
          type="number"
          rightSection={
            <Group spacing={12} position="right" noWrap>
              <Text type="gradient" weight="bold">
                ETH
              </Text>
            </Group>
          }
          size="md"
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
}
