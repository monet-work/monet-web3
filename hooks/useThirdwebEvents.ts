import { elpContract } from "@/app/thirdweb";
import { prepareEvent } from "thirdweb";
import { useContractEvents } from "thirdweb/react";

const useThirdwebEvents = () => {
  const prepareTransferredEvent = prepareEvent({
    signature: "event transferred(address user,uint256 value)",
  });

  const { data: eventsData } = useContractEvents({
    contract: elpContract,
    events: [prepareTransferredEvent],
  });

  return { eventsData };
};

export default useThirdwebEvents;
