class SearchForm {
    constructor () {
        this.form = document.querySelector('#searchForm');
    }

    render() {
        return this.form.innerHTML = `
            <input type="text" class="form-control" id="city" placeholder="Enter your city..." name="city">
            <select class="form-select" id="unitSelect">
                <option value="metric">Celsius</option>
                <option value="imperial">Fahrenheit</option>
            </select>
            <button type="submit" id="submitButton"><i class="fa fa-search"></i></button>
        `;
    }

    collectData() {
        let q = document.querySelector('#city').value;
        let units = document.querySelector('#unitSelect').value;
        q = q.trim() !== '' ? q : 'Kyiv';
        return {
            str: `q=${q}&units=${units}`,
            units
        }

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

    async getWeather(params) {
        fetch(`${this.API_URL}?${params.str}&appid=${this.API_KEY_WEATHER}`)
            .then(response => response.json())
            .then(data => this.ui.displayWeather(data, params.units))
            .catch(error => this.ui.displayError('Error getting weather'));
    }

    loadPage() {
        user.getUserLocation()
            .then(locationData => {
                const data = {
                    str: `lat=${locationData.lat}&lon=${locationData.lon}&units=metric`,
                    units: 'metric'
                };
                weatherApp.getWeather(data);
            })
            .catch(error => {
                console.error('Error getting user location:', error);
            });
    }

    changeParameters() {
        searchForm.form.addEventListener('submit', e => {
            e.preventDefault();

            const data = searchForm.collectData();
            weatherApp.getWeather(data);

            searchForm.form.reset();
        });
    }
}

class UI {
    displayWeather(data, units) {
        const display = document.querySelector('#display');
        let iconcode = data.weather[0].icon;
        let iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
        let zn = units === 'metric' ? 'C' : 'F';

        return display.innerHTML = `
            <div class="cardBodyWeather">
                <span class="weatherCity">${data.name}, ${data.sys.country}</span>
                <span class="weatherTemperature">t: ${data.main.temp} &#176;${zn}</span>
                
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
weatherApp.changeParameters();