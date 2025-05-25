// -----------------getting value from user input from HTML------------------------
const userBusStopId = document.getElementById("busStopId");
const arrivalInfo = document.getElementById("arrivalContent");

// ----------------------obtain data from API-----------------------
async function fetchBusArrivalInfo(busStopId) {
    const response = await fetch('https://sg-bus-arrivals.vercel.app/?id=');

    if (response.ok) {
        const data = await response.json();
        return data;
    } else {
        throw new Error ('Error fetching bus arrival data.');
    }
}
// --------------------------setting up the bus arrival data format-----------------------
function busArrivalFormat(arrivalData) {
    const buses = arrivalData.services;
    const totalBuses = buses.length;
    const formattedData = [];
    for (const bus of buses) {
        const arrivalTimeString = bus.next_bus_mins <= 0 ? `<strong>Arriving</strong>` : `${bus.next_bus_mins} min(s)`;
        formattedData.push(`
            <div>
                <p><strong>${totalBuses} buses</strong></p>
            </div>
        `)

        return formattedData.join(" ");
    }
}