import TitleWithLine from "@components/moleculas/TitleWithLine";
import SendNftForm from "@components/organisms/SendNftForm";
import SendTokenForm from "@components/organisms/SendTokenForm";
import { SegmentedControl, Stack } from "@mantine/core";
import * as React from "react";
import styles from "./index.module.scss";

export enum TransferType {
  TOKEN = "Token",
  NFT = "NFT",
}

const SendPage: React.FunctionComponent = () => {
  const [currentTab, setCurrentTab] = React.useState<TransferType>(
    TransferType.TOKEN
  );

  return (
    <div className={styles.wrapper}>
      <Stack className={styles.root} w={504} mx="auto">
        <TitleWithLine>Send</TitleWithLine>
        <SegmentedControl
          data={[
            { label: TransferType.TOKEN, value: TransferType.TOKEN },
            { label: TransferType.NFT, value: TransferType.NFT },
          ]}
          color="black"
          value={currentTab}
          onChange={(value) => setCurrentTab(value as TransferType)}
          styles={{
            root: {
              backgroundColor: "rgba(27, 29, 44, 0.6)",
              borderRadius: 10,
              padding: "5px, 6px",
              flexShrink: 0,
            },
            label: {
              fontWeight: 700,
              fontSize: 14,
              color: "white",
              ":hover": {
                color: "rgba(255, 255, 255, 0.8)",
              },
            },
            labelActive: {
              borderRadius: 5,
            },
            active: {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        />
        {currentTab == TransferType.TOKEN && <SendTokenForm />}
        {currentTab == TransferType.NFT && <SendNftForm />}
      </Stack>
    </div>
  );
};

export default SendPage;
