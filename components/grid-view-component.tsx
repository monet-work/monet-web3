import React from "react";
import TradeCard from "./trade-card";

type Props = {};

function GridViewComponent({}: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <TradeCard
        For="15"
        ForImg={"/images/For.svg"}
        ForPrice="$7.08"
        Offer="0.281"
        OfferImg={"/images/Offer.png"}
        OfferPrice="$106.1"
      />
      <TradeCard
        For="15"
        ForImg={"/images/For.svg"}
        ForPrice="$7.08"
        Offer="0.281"
        OfferImg={"/images/Offer.png"}
        OfferPrice="$106.1"
      />
      <TradeCard
        For="15"
        ForImg={"/images/For.svg"}
        ForPrice="$7.08"
        Offer="0.281"
        OfferImg={"/images/Offer.png"}
        OfferPrice="$106.1"
      />
      <TradeCard
        For="15"
        ForImg={"/images/For.svg"}
        ForPrice="$7.08"
        Offer="0.281"
        OfferImg={"/images/Offer.png"}
        OfferPrice="$106.1"
      />
    </div>
  );
}

export default GridViewComponent;
