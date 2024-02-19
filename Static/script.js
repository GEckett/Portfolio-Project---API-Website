function fetchRaceData() {
    const year = document.getElementById('yearInput').value;
    const round = document.getElementById('roundInput').value;

    fetch(`https://ergast.com/api/f1/${year}/${round}.json`)
    .then(response => response.json())
    .then(data => {
        // Display the race information on the webpage
        const raceDataContainer = document.getElementById('raceData');
        raceDataContainer.style.display = 'block';
        raceDataContainer.innerHTML = ''; // Clear previous data

        const raceInfo = data.MRData.RaceTable.Races[0];
        const raceName = raceInfo.raceName;
        const date = raceInfo.date;
        const time = raceInfo.time;
        const circuit = raceInfo.Circuit.circuitName;
        const location = raceInfo.Circuit.Location.locality + ', ' + raceInfo.Circuit.Location.country;

        // Prepare race information HTML
        let raceInfoHtml = `
            <h2>Race Information</h2>
            <p>Race Name: ${raceName}</p>
            <p>Date: ${date}</p>
            <p>Time: ${time}</p>
            <p>Circuit: ${circuit}</p>
            <p>Location: ${location}</p>
        `;

        // Display race information
        raceDataContainer.innerHTML = raceInfoHtml;

        // Fetch race results after fetching race information
        fetchRaceResults(year, round);
    })
    .catch(error => {
        console.error('Error fetching race data:', error);
        document.getElementById('raceData').innerHTML = '<p>Unable to fetch race data at the moment. Please try again later.</p>';
    });
}

function fetchRaceResults(year, round) {
    fetch(`https://ergast.com/api/f1/${year}/${round}/results.json`)
    .then(response => response.json())
    .then(data => {
        const raceDataContainer = document.getElementById('raceResults');
        raceDataContainer.style.display = 'block';

        // Check if results are available
        if (data.MRData.RaceTable.Races[0].Results.length > 0) {
            let raceResultsHtml = '<h2>Race Results</h2>';
            raceResultsHtml += '<ul>';
            data.MRData.RaceTable.Races[0].Results.forEach(result => {
                const driverName = result.Driver.givenName + ' ' + result.Driver.familyName;
                const constructor = result.Constructor.name;
                const position = result.position;
                const status = result.status;

                raceResultsHtml += `
                    <li>
                        <strong>${position}. ${driverName}</strong> (${constructor}) - ${status}
                    </li>
                `;
            });
            raceResultsHtml += '</ul>';
            raceDataContainer.innerHTML += raceResultsHtml; // Append race results to race information
        } else {
            raceDataContainer.innerHTML += '<p>No results available for this race.</p>';
        }
    })
    .catch(error => {
        console.error('Error fetching race results:', error);
        document.getElementById('raceResults').innerHTML += '<p>Unable to fetch race results at the moment. Please try again later.</p>';
    });
}
