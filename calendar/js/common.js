class Calendar {
    constructor(element, year, month) {
        this.element = element;
        this.weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        this.monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        this.today = new Date();
        this.year = year || this.today.getFullYear();
        this.month = month || this.today.getMonth();
    }

    generateCalendar(year, month) {
        const date = new Date(year, month);

        const currentDate = {
            day: this.weekDays[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1],
            number: `${this.addZero(new Date().getDate())}`,
        };

        const actualDate = {
            month: this.monthNames[date.getMonth()],
            year: date.getFullYear()
        };

        const countOfDays = new Date(year, (month + 1), 0).getDate();
        const firstDayOfWeek = new Date(year, month, 1).getDay() === 0 ? 6 : new Date().getDay() - 1;
        const days = new Array(firstDayOfWeek).fill('').concat([...new Array(countOfDays)].map((i, idx) => idx + 1));

        return `
            <div class="currentDate">
              <h1>${currentDate.day} ${currentDate.number}th</h1>
              <h1>${actualDate.month} ${actualDate.year}</h1>
            </div>
    
            <div class="daysOfTheWeek list">
              ${this.daysOfTheWeek().map(day => `<span class="list-item">${day}</span>`).join('')}
            </div>
                
            <div class="weeks list">
                ${days.map(day =>`<span class="list-item ${Number(currentDate.number) === day ? 'active' : ''}">${day}</span>`).join('')}  
            </div>
        `
    }

    daysOfTheWeek() {
        return this.weekDays.map(day => day.substr(0, 3).toUpperCase())
    }

    addZero(num) {
        return num > 0 && num < 10 ? '0' + num : num;
    }

    render() {
        this.element.innerHTML = this.generateCalendar(this.year, this.month);
    }
}

class DateSelector {}

class AppController {
    constructor(calendar) {
        this.calendar = calendar;
    }

    initialize() {
        this.calendar.render();
    }
}

const calendar = new Calendar(document.querySelector('#calendar'));

const appController = new AppController(calendar);
appController.initialize();