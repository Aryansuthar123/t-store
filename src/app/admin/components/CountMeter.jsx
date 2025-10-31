"use client";
import { useState, useEffect } from "react";

export default function CountMeter() {
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    fetch("/api/products/count")
      .then((res) => res.json())
      .then((data) => setProductCount(data.total))
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetch("/api/orders/count")
      .then((res) => res.json())
      .then((data) => setOrderCount(data.total))
      .catch(console.error);
  }, []);

  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <Cart imgURL={"/box.png"} title={"Products"} value={productCount} />
      <Cart imgURL={"/received.png"} title={"Order"} value={orderCount} />
      <Cart imgURL={"/profit-up.png"} title={"Revenu"} value={342} />
      <Cart imgURL={"/team.png"} title={"Customer"} value={43} />
    </section>
  );
}

function Cart({ title, value, imgURL }) {
  return (
    <div className="flex gap-1 px-4 py-3 bg-white rounded-xl w-full justify-between items-start overflow-hidden">
      <div className="flex flex-col leading-tight">
        <h1 className="!text-[30px] text-gray-600">{value}</h1>
        <h1 className="!text-[25px] text-gray-600">{title}</h1>

      </div>
      <img
        className="h-12 -mt-0 object-contain"
        src={imgURL}
        alt=""
      />
    </div>
  );
}
