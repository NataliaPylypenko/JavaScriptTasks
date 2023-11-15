class SearchForm {
    constructor () {
        this.form = document.querySelector('#searchForm');
    }

    render() {
        return this.form.innerHTML = `
            <input type="text" class="form-control" id="city" placeholder="Enter your city..." name="city">
            <button type="submit" id="submitButton"><i class="fa fa-search"></i></button>
        `;
    }

    collectData() {
        return `q=${document.querySelector('#city').value}`;
    }
}

class User {
    getUserLocation() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(position => {
                    const locationData = {
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    };
                resolve(locationData);
            },
            error => {
                console.error('Error getting user location:', error);
                reject(error);
            });
        })
    }
}

class WeatherApp {
    API_KEY_WEATHER = '10e61b9a9f2c2dfb75a2697576d924bd';
    API_URL = 'https://api.openweathermap.org/data/2.5/weather';

    constructor() {
        this.ui = new UI();
    }

    async getWeather(data) {
        fetch(`${this.API_URL}?${data}&units=metric&appid=${this.API_KEY_WEATHER}`)
            .then(response => response.json())
            .then(data => this.ui.displayWeather(data))
            .catch(error => this.ui.displayError('Error getting weather'));
    }

    loadPage() {
        user.getUserLocation()
            .then(locationData => {
                const data = `lat=${locationData.lat}&lon=${locationData.lon}`;
                weatherApp.getWeather(data);
            })
            .catch(error => {
                console.error('Error getting user location:', error);
            });
    }

    changeCity() {
        searchForm.form.addEventListener('submit', e => {
            e.preventDefault();

            const data = searchForm.collectData();
            weatherApp.getWeather(data);

            searchForm.form.reset();
        });
    }
}

class UI {
    displayWeather(data) {
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

const searchForm = new SearchForm();
const weatherApp = new WeatherApp();
const user = new User();

searchForm.render();
weatherApp.loadPage();
weatherApp.changeCity();