import { Button, Text } from "@components/atoms";
import AllTransactions from "@components/organisms/AllTransactions";
import PendingTransactions from "@components/organisms/PendingTransactions";
import { Group, Tabs } from "@mantine/core";
import { useRouter } from "next/router";
import * as React from "react";

interface ITransactionListProps {}

const TransactionList: React.FunctionComponent<ITransactionListProps> = (
  props
) => {
  const router = useRouter();
  const onClick = () => {
    router.push(window.location.pathname + "/create");
  };
  return (
    <div>
      <Tabs defaultValue="queue">
        <Group>
          <Tabs.List>
            <Tabs.Tab value="queue">
              <Text size="lg">Queue</Text>
            </Tabs.Tab>
            <Tabs.Tab value="history">
              <Text size="lg">History</Text>
            </Tabs.Tab>
          </Tabs.List>
          <Button ml={"auto"} onClick={onClick}>
            New Transaction
          </Button>
        </Group>

        <Tabs.Panel value="queue" pt="xs">
          <PendingTransactions />
        </Tabs.Panel>

        <Tabs.Panel value="history" pt="xs">
          <AllTransactions />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default TransactionList;
