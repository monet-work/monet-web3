import { elpContract, elpMarketplaceContract } from "@/app/contract-utils";
import { prepareEvent, watchContractEvents } from "thirdweb";
import { useContractEvents } from "thirdweb/react";

const useThirdwebEvents = () => {
  const prepareTransferredEvent = prepareEvent({
    signature: "event transferred(address user,uint256 value)",
  });

  const preparedTradeExecutedEvent = prepareEvent({
    signature:
      "event TradeExecuted(uint256 id, address user, uint256 quantity, uint256 value)",
  });

  const { data: eventsFromElpContract } = useContractEvents({
    contract: elpContract,
    events: [prepareTransferredEvent],
  });

  const { data: eventsFromMarketplaceContract } = useContractEvents({
    contract: elpMarketplaceContract,
    events: [preparedTradeExecutedEvent],
  });

  return { eventsFromElpContract, eventsFromMarketplaceContract };
};

export default useThirdwebEvents;
