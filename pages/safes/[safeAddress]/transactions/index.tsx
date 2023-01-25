import { Text } from "@components/atoms";
import AllTransactions from "@components/organisms/AllTransactions";
import PendingTransactions from "@components/organisms/PendingTransactions";
import { Tabs } from "@mantine/core";
import * as React from "react";

interface ITransactionListProps {}

const TransactionList: React.FunctionComponent<ITransactionListProps> = (
  props
) => {
  return (
    <div>
      <Tabs defaultValue="queue">
        <Tabs.List>
          <Tabs.Tab value="queue">
            <Text size="lg">Queue</Text>
          </Tabs.Tab>
          <Tabs.Tab value="history">
            <Text size="lg">History</Text>
          </Tabs.Tab>
        </Tabs.List>

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
