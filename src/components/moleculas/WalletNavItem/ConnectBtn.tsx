import { useState } from "react";
import Button from "@components/atoms/Button";
import ConnectWalletModal from "../ConnectWalletModal";

const ConnectBtn: React.FC = () => {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <>
      <Button onClick={() => setShowOptions(true)}>Connect wallet</Button>
      <ConnectWalletModal
        opened={showOptions}
        onClose={() => setShowOptions(false)}
      />
    </>
  );
};

export default ConnectBtn;
