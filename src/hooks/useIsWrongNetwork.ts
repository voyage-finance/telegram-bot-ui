import { chainId } from '@utils/config';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';

export const useIsWrongNetwork = () => {
  const { chain } = useNetwork();
  const { address } = useAccount();
  const { switchNetwork } = useSwitchNetwork();
  const handleSwitch = () => switchNetwork?.(chainId);

  return [address && chain?.id !== chainId, handleSwitch] as const;
};
