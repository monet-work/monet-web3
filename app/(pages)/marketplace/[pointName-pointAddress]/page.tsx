import TradeDetails from "@/components/trade-details";
import TradesView from "@/components/trades-view";
import { pointsTableData } from "@/data";

const PointPage = () => {
  return (
    <main className="pt-16">
      <div className="flex flex-col md:flex-row gap-4 w-full container">
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="mb-2">Public Trades</h3>
            <TradesView />
          </div>
          <div>
            <h3 className="mb-2">Your Trades</h3>
            <TradesView />
          </div>
        </div>
        <div className="border w-1/3">
          <TradeDetails isActive={true} Data={pointsTableData} />
        </div>
      </div>
    </main>
  );
};

export default PointPage;
