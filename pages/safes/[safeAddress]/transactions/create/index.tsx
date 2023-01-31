import { Button, Text } from "@components/atoms";
import Card from "@components/moleculas/Card";
import { Stack } from "@mantine/core";
import Head from "next/head";
import { useRouter } from "next/router";

const txBuildUrl =
  "https://app.safe.global/matic:0x775AD9C18e0D8dE7dFCFfc8540a0203F61b39A7e/apps?appUrl=https%3A%2F%2Fapps.gnosis-safe.io%2Ftx-builder";

export default function Home() {
  const { query, push } = useRouter();

  return (
    <>
      <Head>
        <title>Create transaction</title>
        <meta name="description" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Card w={420} px={60} py={38} mx="auto">
          <Stack align="center">
            <Text sx={{ fontSize: 24, fontWeight: "bold" }} type="gradient">
              Create transaction
            </Text>
            <Button
              onClick={() =>
                push(`/safes/${query.safeAddress}/transactions/create/send`)
              }
              w="100%"
            >
              Send Tokens/NFTs
            </Button>
            <Button w="100%" onClick={() => window.open(txBuildUrl, "_blank")}>
              Custom Transaction Builder
            </Button>
          </Stack>
        </Card>
      </main>
    </>
  );
}
