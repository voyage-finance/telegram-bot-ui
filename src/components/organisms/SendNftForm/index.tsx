import { Button, Text } from "@components/atoms";
import { Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { SafeTransactionDataPartial } from "@safe-global/safe-core-sdk-types";
import { ethers } from "ethers";
import { useState } from "react";
import { useSigner } from "wagmi";
import styles from "./styles.module.scss";
import { showNotification } from "@mantine/notifications";
import { useSafeService } from "@components/layouts/SafeServiceProvider";
import { SafeCollectibleResponse } from "@safe-global/safe-service-client";
import { buildERC721Transaction } from "@utils/transaction";
import NFTSelector from "@components/moleculas/NFTSelector";
import { checkAddressChecksum } from "ethereum-checksum-address";

export default function SendNftForm() {
  const { data: signer } = useSigner();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { service, sdk, safeAddress } = useSafeService();

  const form = useForm({
    initialValues: {
      address: "",
      selectedNft: undefined as SafeCollectibleResponse | undefined,
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
      selectedNft: (value) => {
        if (!value) return "Select NFT";
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
          await buildERC721Transaction({
            receiverAddress: form.values.address,
            tokenAddress: form.values.selectedNft!.address,
            tokenId: form.values.selectedNft!.id,
            nonce,
            safeAddress,
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
          autoClose: 1000,
        });
        form.setValues({ address: "" });
      }
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
        <div>
          <NFTSelector
            walletAddress={safeAddress}
            value={form.values.selectedNft}
            onChange={(value) => form.setFieldValue("selectedNft", value)}
          />
          {form.errors.selectedNft && (
            <Text type="danger" lineClamp={4}>
              {form.errors.selectedNft}
            </Text>
          )}
        </div>
        <TextInput
          placeholder="Enter recipient address"
          className={styles.addressInput}
          size="lg"
          {...form.getInputProps("address")}
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
