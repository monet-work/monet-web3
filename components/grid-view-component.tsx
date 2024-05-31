import React from "react";
import { TradeGridCard } from "./trade-grid-card";

type Props = {};

function GridViewComponent({}: Props) {
  return (
    <div className="flex flex-wrap">
      <TradeGridCard
        For="15"
        ForImg={"/images/For.svg"}
        ForPrice="$7.08"
        Offer="0.281"
        OfferImg={"/images/Offer.png"}
        OfferPrice="$106.1"
      />
      <TradeGridCard
        For="15"
        ForImg={"/images/For.svg"}
        ForPrice="$7.08"
        Offer="0.281"
        OfferImg={"/images/Offer.png"}
        OfferPrice="$106.1"
      />
      <TradeGridCard
        For="15"
        ForImg={"/images/For.svg"}
        ForPrice="$7.08"
        Offer="0.281"
        OfferImg={"/images/Offer.png"}
        OfferPrice="$106.1"
      />
      <TradeGridCard
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
