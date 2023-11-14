class SearchForm {
    render() {
        const form = document.querySelector('#searchForm');

        return form.innerHTML = `
            <input type="text" class="form-control" id="city" placeholder="Enter your city..." name="city">
            <button type="submit" id="submitButton"><i class="fa fa-search"></i></button>
        `;
    }

    collectData() {
        return document.querySelector('#city').value;
    }
}

class WeatherApp {
    API_KEY_WEATHER = '10e61b9a9f2c2dfb75a2697576d924bd';
    API_URL = 'https://api.openweathermap.org/data/2.5/weather';

    constructor() {
        this.ui = new UI();
        this.apiKey = this.API_KEY_WEATHER;
        this.apiUrl = this.API_URL;
    }

    async getWeather(city) {
        fetch(`${this.apiUrl}?q=${city}&units=metric&appid=${this.apiKey}`)
            .then(response => response.json())
            .then(data => this.ui.displayWeather(data))
            .catch(error => this.ui.displayError('Error getting weather'));
    }
}

class UI {
    displayWeather(data) {
        console.log(data);
        const display = document.querySelector('#display');
        let iconcode = data.weather[0].icon;
        let iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";

        return display.innerHTML = `
            <div class="cardBodyWeather">
                <span class="weatherCity">${data.name}, ${data.sys.country}</span>
                <span class="weatherTemperature">t: ${data.main.temp} &#176;C</span>
                
                <div class="weather">
                    <img class="weatherIcon" src="${iconurl}">
                    <span class="weatherDescr">${data.weather[0].description}</span>
                </div>
                <div class="weatherWind">
                    <span class="weatherWindSpeed">wind speed: ${data.wind.speed}</span>
                </div>
                <div class="weatherMinMax">
                    <p>min: ${data.main.temp_min}</p>
                    <p>max: ${data.main.temp_max}</p>
                </div> 
            </div>
        `;
    }

    displayError(message) {
        console.log(message);
    }
}

class FormValidator {
    validate(data) {}
}

class SearchProcessor {
    process(data) {}
}

const searchForm = new SearchForm();
searchForm.render();

const weatherApp = new WeatherApp();

const form = document.querySelector('#searchForm');
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const city = searchForm.collectData();

    weatherApp.getWeather(city);

    form.reset();
});
