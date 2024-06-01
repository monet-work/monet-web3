import TradeDetails from "@/components/trade-details";
import TradesView from "@/components/trades-view";
import { pointsTableData } from "@/data";

const PointPage = () => {
  return (
    <main>
      <div className="flex flex-col md:flex-row gap-4 w-full container">
        <TradesView />
        <TradeDetails isActive={true} Data={pointsTableData} />
      </div>
    </main>
  );
};

export default PointPage;
