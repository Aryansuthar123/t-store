import CountMeter from "./components/CountMeter"
import RevenueChart from "./components/RevenueChart"
import OrdersChart from "./components/OrdersChart"

export default function page(){
    return(
        <main className="flex flex-col gap-4 p-2">
            <CountMeter/>
            <div className="flex flex-col md:flex-row gap-4 ">
                <RevenueChart/>
                <OrdersChart/>
            </div>
        </main>
    )
}
