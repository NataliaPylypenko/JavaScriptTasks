class Calendar {
    constructor(element) {
        this.element = element;
    }

    generateCalendar() {
      return `
        <div class="current-date">
          <h1>Friday 15th</h1>
          <h1>January 2016</h1>
        </div>

        <div class="current-month">
                <ul class="week-days">
                    <li>MON</li>
                    <li>TUE</li>
                    <li>WED</li>
                    <li>THU</li>
                    <li>FRI</li>
                    <li>SAT</li>
                    <li>SUN</li>
                </ul>
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

    render() {
        this.element.innerHTML = this.generateCalendar();
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