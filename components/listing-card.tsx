import { Listing } from "@/models/listing";
import { BackgroundGradient } from "./ui/background-gradient";
import { Button } from "./ui/button";
import { DeleteIcon, TrashIcon } from "lucide-react";

type Props = {
  listing: Listing;
  allowBuy?: boolean;
  allowCancel?: boolean;
  onBuy?: (id: string) => void;
  onCancel?: (id: string) => void;
};

const ListingCard: React.FC<Props> = ({
  listing,
  onBuy,
  allowBuy,
  onCancel,
  allowCancel,
}) => {
  const { id, quantity, amount } = listing;
  return (
    <BackgroundGradient className="rounded-[22px] p-8 bg-black h-full relative">
      {allowCancel && (
        <TrashIcon
          className="absolute top-2 right-2 cursor-pointer w-4 h-4 m-2"
          onClick={() => {
            id && onCancel && onCancel(id);
          }}
        />
      )}
      <div>
        <p className="text-white font-bold text-lg">{quantity} ELP</p>
        <p className="text-white text-sm">Amount: {amount} Eth</p>
        {allowBuy && (
          <Button
            className="mt-4 bg-[#ffd700] text-black hover:bg-yellow-500"
            onClick={() => {
              id && onBuy && onBuy(id);
            }}
          >
            Buy
          </Button>
        )}
      </div>
    </BackgroundGradient>
  );
};

export default ListingCard;
