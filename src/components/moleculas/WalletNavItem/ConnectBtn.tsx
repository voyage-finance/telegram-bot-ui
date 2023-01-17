import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const ConnectBtn: React.FC = () => {
  const [showOptions, setShowOptions] = useState(false);

  return <ConnectButton />;
};

export default ConnectBtn;
