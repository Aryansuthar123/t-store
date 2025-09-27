"use client"
export default function CountMeter() {
    return(
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Cart imgURL={"/box.png"} title={"Products"} value={100}/>
          <Cart imgURL={"/received.png"} title={"Order"} value={34}/>
          <Cart imgURL={"/profit-up.png"} title={"Revenu"} value={342}/>
          <Cart imgURL={"/team.png"} title={"Customer"} value={43}/>
        </section>
    )
}


function Cart({title, value, imgURL}){
    return(
          <div className="flex gap-1 px-3 py-2 bg-white rounded-xl w-full justify-between items-center">
                <div className="flex flex-col">
                    <h1 className="font-semibold text-xl">{value}</h1>
                    <h1 className="text-sm text-gray-700">{title}</h1>
                </div>
                <img className="h-13" src={imgURL} alt=""/>
            </div>
    )
}