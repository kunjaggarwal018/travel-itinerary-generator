document.getElementById("form").addEventListener("submit", async function (event) {


    event.preventDefault();

    let city = document.getElementById("city").value;
    let days = Number(document.getElementById("days").value);
    let persona = document.getElementById("persona").value;

    document.getElementById("loading").innerHTML = "Loading...";
    document.getElementById("error").innerHTML = "";
    document.getElementById("result").innerHTML = "";

    try {

        let response = await fetch(
            "https://geocoding-api.open-meteo.com/v1/search?name=" +
            encodeURIComponent(city) +
            "&count=1"
        );

        let data = await response.json();

        if (!data.results) {
            throw new Error();
        }

        let latitude = data.results[0].latitude;
        let longitude = data.results[0].longitude;
        let cityName = data.results[0].name;

        let weatherResponse = await fetch(
            "https://api.open-meteo.com/v1/forecast?latitude=" +
            latitude +
            "&longitude=" +
            longitude +
            "&daily=temperature_2m_max,precipitation_probability_max&timezone=auto"
        );

        let weather = await weatherResponse.json();

        let result = document.getElementById("result");

        result.innerHTML = "<h2>" + cityName + "</h2>";

        for (let i = 0; i < days; i++) {

            let temp = weather.daily.temperature_2m_max[i];
            let rain = weather.daily.precipitation_probability_max[i];

            if (rain == null) {
                rain = 0;
            }

            let activity = "";

            if (rain > 40) {

                if (persona == "Backpacker") {
                    let indoor = [
                        "Visit a free museum",
                        "Attend a hostel event",
                        "Explore a local market",
                        "Visit a cultural center"
                    ];
                    activity = indoor[i % indoor.length];
                }

                if (persona == "Luxury") {
                    let indoor = [
                        "Enjoy a luxury spa",
                        "Have a fine dining experience",
                        "Visit an art gallery",
                        "Relax at a luxury hotel"
                    ];
                    activity = indoor[i % indoor.length];
                }

                if (persona == "Family") {
                    let indoor = [
                        "Visit a science museum",
                        "Visit an aquarium",
                        "Go to a children's museum",
                        "Visit an indoor entertainment center"
                    ];
                    activity = indoor[i % indoor.length];
                }

            } else {

                if (persona == "Backpacker") {
                    let outdoor = [
                        "Go on a free walking tour",
                        "Explore a local park",
                        "Visit local markets",
                        "Explore the city on foot"
                    ];
                    activity = outdoor[i % outdoor.length];
                }

                if (persona == "Luxury") {
                    let outdoor = [
                        "Go on a private yacht tour",
                        "Take a private city tour",
                        "Enjoy a luxury outdoor excursion",
                        "Take a private scenic tour"
                    ];
                    activity = outdoor[i % outdoor.length];
                }

                if (persona == "Family") {
                    let outdoor = [
                        "Visit a zoo",
                        "Visit an amusement park",
                        "Have a family nature outing",
                        "Enjoy an outdoor family activity"
                    ];
                    activity = outdoor[i % outdoor.length];
                }

            }

            result.innerHTML +=
                "<div class='day'>" +
                "<h2>Day " + (i + 1) + "</h2>" +
                "<p>Temperature: " + temp + "&deg;C</p>" +
                "<p>Rain Probability: " + rain + "%</p>" +
                "<p><b>Activity:</b> " + activity + "</p>" +
                "</div>";
        }

        document.getElementById("loading").innerHTML = "";

    } catch (error) {

        document.getElementById("loading").innerHTML = "";
        document.getElementById("error").innerHTML =
            "Could not find the city. Please try again.";

    }

});
