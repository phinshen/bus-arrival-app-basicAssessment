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
// --------------------------setting up bus arrival content-----------------------
function 