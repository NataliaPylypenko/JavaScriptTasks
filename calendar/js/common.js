class Calendar {
    constructor(element) {
        this.element = element;
    }

    generateCalendar(currentDate, daysOfTheWeek) {
      return `
        <div class="currentDate">
          <h1>${currentDate.day} ${currentDate.number}</h1>
          <h1>${currentDate.month} ${currentDate.year}</h1>
        </div>

        <div class="daysOfTheWeek">
          <ul class="week-days">${daysOfTheWeek.map(day => `<li>${day}</li>`).join('')}</ul>
        </div>
            
        <div class="weeks">
                <div>
                    <span class="last-month">28</span>
                    <span class="last-month">29</span>
                    <span>01</span>
                    <span>02</span>
                    <span>03</span>
                    <span>04</span>
                    <span>05</span>
                </div>
        </div>
      `
    }

    render(currentDate, daysOfTheWeek) {
        this.element.innerHTML = this.generateCalendar(currentDate, daysOfTheWeek);
    }
}

class DateSelector {}

class AppController {
    constructor(calendar) {
        this.calendar = calendar;
        this.weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        this.month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    }

    initialize() {
        this.calendar.render(this.getCurrentDate(), this.daysOfTheWeek());
    }

    getCurrentDate() {
        let date = new Date();
        return {
            day: this.weekDays[date.getDay() === 0 ? 6 : date.getDay() - 1],
            number: `${this.addZero(date.getDate())}th`,
            month: this.month[date.getMonth()],
            year: date.getFullYear()
        }
    }

    addZero(num) {
        return num > 0 && num < 10 ? '0' + num : num;
    }

    daysOfTheWeek() {
        return this.weekDays.map(day => day.substr(0, 3).toUpperCase())
    }
}

const calendar = new Calendar(document.querySelector('#calendar'));

const appController = new AppController(calendar);
appController.initialize();