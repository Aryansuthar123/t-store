import CountMeter from "../components/CountMeter";
import RevenueChart from "../components/RevenueChart";
import OrdersChart from "../components/OrdersChart";

export default function page() {
  return (
    <main className="flex flex-col gap-4 p-1">
      <CountMeter />
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <RevenueChart />
        </div>
        <div className="flex-1">
          <OrdersChart />
        </div>
      </div>
    </main>
  );
}
