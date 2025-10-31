import CountMeter from "../components/CountMeter";
import RevenueChart from "../components/RevenueChart";
import OrdersChart from "../components/OrdersChart";

export default function page() {
  return (
    <main className="flex w-full flex-col gap-4 p-1">
      <div
        className="bg-amber-50 rounded-lg px-2"
        style={{ fontSize: "30px", fontWeight: "bold" }}>
        Dashboard
      </div>

      <CountMeter />

      <div className="flex flex-col md:flex-row w-full gap-2">

        <div className="md:w-1/2 w-full flex">
          <RevenueChart />
        </div>


        <div className="md:w-1/2 w-full flex">
          <OrdersChart />
        </div>
      </div>


    </main>

  );
}
