import DetailsView from "@/components/details-view";
import PointsListComponent from "@/components/points-list-component";
import { TradesView } from "@/components/trades-view";
import { pointsTableData } from "@/data";

export default function MarketPlace() {
  return (
    <main className="w-full flex gap-8 py-16 flex-col items-center">
      <PointsListComponent isLoading={false} Points={pointsTableData} />
      <div className="flex w-full">
        <TradesView />
        <DetailsView isActive={true} Data={pointsTableData} />
      </div>
    </main>
  );
}
