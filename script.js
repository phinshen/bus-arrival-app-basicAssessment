// -----------------getting value from user input from HTML------------------------
const userBusStopId = document.getElementById("busStopId"); // input box where user types bus stop ID
const arrivalInfo = document.getElementById("arrivalContent"); // area to show arrival info

// ----------------------fetch bus arrival data from API-----------------------
async function fetchBusArrivalInfo(busStopId) {
    const response = await fetch(`https://sg-bus-arrivals.vercel.app/?id=${busStopId}`);
    // Add the user-provided ID to the API endpoint
    if (response.ok) {
        const data = await response.json(); // convert API response to JSON
        return data;
    } else {
        throw new Error ('Error fetching bus arrival data.');
    }
}
// -------------------------- Format the bus arrival data -----------------------
function busArrivalFormat(arrivalData) {
    const buses = arrivalData.services; // get list of buses
    const totalBuses = buses.length; // total number of buses

    if (totalBuses === 0) {
        return '<p>No bus arriving soon.</p>';
    }

    let formattedData = `
        <p><strong>${totalBuses} buses arriving</strong></p>
        <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">
          <thead>
            <tr>
              <th>Bus No.</th>
              <th>Operator</th>
              <th>Next Arrival</th>
            </tr>
          </thead>
          <tbody>
        `;

      // Loop through each bus and add a row to the table
      for (const bus of buses) {
        // Changed from bus.bus_no to bus.no (correct property from API)
        const busNo = bus.bus_no;

        // Added operator column (from API response)
        const operator = bus.operator;

        // Format arrival time string: "Arriving" if 0 or less, else X min(s)
        const arrivalTimeString = bus.next_bus_mins <= 0 ? `<strong>Arriving</strong>` : `${bus.next_bus_mins} min(s)`;

        // Add a row for each bus
        formattedData += `
            <tr>
                <td>${busNo}</td>
                <td>${operator}</td>
                <td>${arrivalTimeString}</td>
            </tr>
        `;
    }

    formattedData += `
          </tbody>
        </table>
    `;

    return formattedData;
}
// --------------------------- Display the bus arrival data on webpage ---------------------
function displayBusArrival(busStopId) {
    arrivalInfo.innerHTML = "Loading..."; // temporary message while fetching
    fetchBusArrivalInfo(busStopId)
        .then((arrivalData) => {
            const formattedArrivalData = busArrivalFormat(arrivalData);
            arrivalInfo.innerHTML = formattedArrivalData; // show data on screen
        })
        .catch((error) => {
            console.error("Error", error);
            arrivalInfo.innerHTML = 'Failed to load bus arrival data.';
        })
}   

// ---------------------- Called when user clicks the button -----------------------
let intervalId; // used to store repeating timer

function showArrivals() {
    const busStopId = userBusStopId.value; // get what user typed

    if (intervalId) {
        clearInterval(intervalId); // stop previous refresh
    }

    displayBusArrival(busStopId); // load once immediately

    // Refresh data every 5 seconds
    intervalId = setInterval(() => {
        displayBusArrival(busStopId);
    }, 5000);
}