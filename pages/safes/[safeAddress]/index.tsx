import { Button } from "@components/atoms";
import TitleWithLine from "@components/moleculas/TitleWithLine";
import { Stack, Title } from "@mantine/core";
import { useRouter } from "next/router";
import * as React from "react";

interface ISafePageProps {}

const SafePage: React.FunctionComponent<ISafePageProps> = (props) => {
  const { query } = useRouter();
  const { safeAddress } = query;

  const router = useRouter();

  const onClick = () => {
    router.push(window.location.pathname + "/transactions/create");
  };

  return (
    <Stack mx="auto" align="center">
      <TitleWithLine size="md">{safeAddress}</TitleWithLine>
      <a
        href={`https://app.safe.global/matic:${safeAddress}/transactions/history`}
        target="_blank"
      >
        <Button w={300} type="button">
          Transactions
        </Button>
      </a>
      <Button w={300} onClick={onClick}>
        Create Transaction
      </Button>
    </Stack>
  );
};

export default SafePage;
