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
        try {
            const response = await fetch(`${this.apiUrl}?q=${city}&appid=${this.apiKey}`);
            const data = await response.json();

            this.ui.displayWeather(data);
        } catch (error) {
            this.ui.displayError('Помилка при отриманні погоди');
        }
    }
}

class UI {
    displayWeather(data) {
        const display = document.querySelector('#display');

        return display.innerHTML = `
            <h2>${data.name}</h2>
            <h1>${data.main.temp}</h1>
        `;

        // console.log(data);
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
