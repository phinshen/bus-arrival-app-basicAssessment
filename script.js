// -----------------getting value from user input from HTML------------------------
const userBusStopId = document.getElementById("busStopId");
const arrivalInfo = document.getElementById("arrivalContent");

// ----------------------obtain data from API-----------------------
async function fetchBusArrivalInfo(busStopId) {
    const response = await fetch(`https://sg-bus-arrivals.vercel.app/?id=${busStopId}`);

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

    formattedData.push(`<p><strong>${totalBuses} buses</strong></p>`);

    for (const bus of buses) {
        const arrivalTimeString = bus.next_bus_mins <= 0 ? `<strong>Arriving</strong>` : `${bus.next_bus_mins} min(s)`;
        
        formattedData.push(`
            <div>
                <p>Bus ${bus.bus_no}: ${arrivalTimeString}</p>
            </div>
        `)
    }

    return formattedData.join(" ");
}
// ---------------------------update content bus arrival data to HTML---------------------
function displayBusArrival(busStopId) {
    arrivalInfo.innerHTML = "Loading...";
    fetchBusArrivalInfo(busStopId)
        .then((arrivalData) => {
            const formattedArrivalData = busArrivalFormat(arrivalData);
            arrivalInfo.innerHTML = formattedArrivalData;
        })
        .catch((error) => {
            console.error("Error", error);
            arrivalInfo.innerHTML = 'Failed to load bus arrival data.';
        })
}   

// ---------retrieves value of userBusStopId to display on webpage once button clicked-------
let intervalId;

function showArrivals() {
    const busStopId = userBusStopId.value;

    if (intervalId) {
        clearInterval(intervalId);
    }

    displayBusArrival(busStopId);

    intervalId = setInterval(() => {
        displayBusArrival(busStopId);
    }, 5000);
}