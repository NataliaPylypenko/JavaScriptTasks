const eventEmitter = () => {
   const events = {};
    return {
        events,
        subscribe: (eventName, callback) => {
            !events[eventName] && (events[eventName] = []);
            events[eventName].push(callback);
        },
        emit: (eventName, args) => {
            const event = events[eventName];
            event && event.forEach(callback => callback.call(null, args));
        }
    };
};

const tokenizer = () => {
    const randomInteger = (min, max) => Math.floor(min + Math.random() * (max + 1 - min));

    const generate = (keyLength, characters) => [...Array(keyLength)]
        .map( () => characters[randomInteger(0, characters.length - 1)])
        .join('');

    const generateUniqueId = (length = 9) => generate(length, 'abcdefghijklmnopqrstuvwxyz0123456789');

    return {
        randomInteger,
        generateUniqueId,
    }
};

const transactionsRepository = (tokenizer) => {
    const transactions = [];
    const load = () => localStorage.getItem('transactions') && transactions.push(...JSON.parse(localStorage.getItem('transactions')));

    const getExpenses = () => transactions.filter(transaction => transaction.amount < 0);

    const getTotalBalance = () => transactions.reduce((a, b) => a += b.amount, 0);
    const getTotalExpenses = () => getExpenses().reduce((a, b) => a += Math.abs(b.amount), 0);

    const transactionsByPeriod = (arrayDates) => {
        // console.log(arrayDates);
        let result = [];

        arrayDates.forEach(date => {
            let balance = 0;

            let transactionsForDate = transactions.filter(transaction => formatDate(new Date(transaction.date)) === date);
            // console.log(transactionsForDate);

            transactionsForDate.forEach(transaction => {
                transaction.amount < 0 ? balance += Math.abs(transaction.amount) : balance;
            });

            result.push({
                date: date,
                balance: balance
            });
        });

        return result;
    };

    const add = (amount, category, date, comment) => {
        transactions.push({
            id: tokenizer.generateUniqueId(),
            date: date,
            amount: amount,
            category: category,
            comment: comment,
        });

        save()
    };

    const remove = id => {
        let idx = transactions.findIndex(item => item.id === id);
        idx !== -1  &&  transactions.splice(idx, 1);

        save()
    };

    const save = () => {
        // const transactions = [
        //     {id: "x9avql5ap", date: "2023-10-28T06:16:10.090Z", amount: 25000, category: "Salary", comment: ""},
        //     {id: "pxdhihemr", date: "2023-10-28T06:16:10.090Z", amount: -350, category: "Food", comment: ""},
        //     {id: "ywrdw80fa", date: "2023-10-29T06:16:10.090Z", amount: -60, category: "Transport", comment: ""},
        //     {id: "ql5apx9av", date: "2023-10-30T06:16:10.090Z", amount: -8500, category: "Utility Payments", comment: ""},
        //     {id: "ihemrpxdh", date: "2023-10-31T06:16:10.090Z", amount: -650, category: "Food", comment: ""},
        //     {id: "w80faywrd", date: "2023-11-01T06:16:10.090Z", amount: -40, category: "Food", comment: "coffee"},
        //     {id: "mk1plr3xo", date: "2023-11-02T15:00:51.947Z", amount: -60, category: "Transport", comment: ""},
        //     {id: "vls7210rk", date: "2023-11-03T15:04:26.970Z", amount: -500, category: "Entertainment", comment: ""},
        //     {id: "m9ynvqhwf", date: "2023-11-03T15:04:48.305Z", amount: -60, category: "Transport", comment: ""},
        //     {id: "g06uoixxk", date: "2023-11-04T15:07:42.121Z", amount: -350, category: "Food", comment: ""},
        // ];
        localStorage.setItem('transactions', JSON.stringify(transactions));
    };

    const getAll = () => transactions;

    load();

    return{
        getAll,
        getExpenses,
        remove,
        add,
        getTotalBalance,
        getTotalExpenses,
        transactionsByPeriod
    }
};

const transactionService = (repository, events) => {
    const CATEGORIES = ['Salary', 'Transport', 'Food', 'Entertainment', 'Utility Payments'];

    const getCategories = () => CATEGORIES;

    const add = (amount, category, date, comment) => {
        if(CATEGORIES.find((item) => item === category) === undefined){
            throw `Category ${category} is not found!`
        }

        repository.add(
            amount,
            category,
            date || new Date(),
            comment
        );

        events.emit('transaction.changed');
    };

    const remove = id => {
        repository.remove(id);
        events.emit('transaction.changed');
    };

    return {
        add,
        remove,
        getCategories,
    };
};

const totalBalanceComponent = (repository, events) => {
    const render = () => {
        const totalBalance = document.querySelector('#totalBalance');
        const sum = repository.getTotalBalance();
        let cl = 'green';
        if (sum < 0)  cl = 'red';
        totalBalance.innerHTML = `<h1 style="color:${cl}">${sum}$</h1>`
    };

    events.subscribe('transaction.changed', () => render());

    return {
        render
    }
};

const historyTableComponent = (transactionService, repository, events) => {
    const removeItemEvent = () => {
        const tableHistory = document.querySelector('#history');

        tableHistory.addEventListener('click', e => {
            e.preventDefault();

            if (e.target && e.target.tagName === "BUTTON") {
                let id = e.target.getAttribute('data-id');
                transactionService.remove(id);
            }
        });
    };
    removeItemEvent();

    const render = () => {
        const tableBody = document.querySelector('#history tbody');
        let str = '';

        repository.getAll().map((transaction, i) => {
            str += `<tr>
                        <td>${++i}</td>
                        <td>${transaction.amount}$</td>
                        <td>${formatDate(new Date(transaction.date))}</td>
                        <td>${transaction.category}</td>
                        <td>${transaction.comment}</td>
                        <td><button type="button" data-id="${transaction.id}" class="btn btn-outline-danger">Remove</button></td>
                    </tr>`
        });

        tableBody.innerHTML = str;
    };

    events.subscribe('transaction.changed', () => render());

    return {
        render
    }
};

const historyDiagramComponent = (repository, events) => {
    const prepareData = () => {
        const result = [['Category', 'Mhl']];
        const totalExpenses = repository.getTotalExpenses();

        for (let transaction of repository.getExpenses()) {
            const amount = Math.abs(transaction.amount) / totalExpenses * 100;
            const categoryExists = result.some(item => item[0] === transaction.category);

            if (categoryExists) {
                const index = result.findIndex(item => item[0] === transaction.category);
                result[index][1] += amount;
            } else {
                result.push([transaction.category, amount]);
            }
        }

        return result;
    };

    events.subscribe('transaction.changed', () => render());

    const render = () => {
        const drawChart = () => {
            const data = google.visualization.arrayToDataTable(prepareData());

            const chart = new google.visualization.PieChart(document.getElementById('myChart'));
            chart.draw(data);
        };

        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(drawChart);
    };

    return {
        render
    }
};

const costScheduleComponent = (repository, events) => {
    const getArrayDates = () => {
        const currentDate = new Date();
        const arrayDates = [];

        for (let i = 0; i < 7; i++) {
            arrayDates.unshift(formatDate(new Date(currentDate - i * 24 * 60 * 60 * 1000)));
        }

        return arrayDates;
    };

    const prepareData = () => {
        const arrayDates = getArrayDates();

        let coord = repository.transactionsByPeriod(arrayDates);

        const dates = coord.map(item => item.date);
        const balances = coord.map(item => item.balance);

        return {
            dates,
            balances
        }
    };

    events.subscribe('transaction.changed', () => render());

    const render = () => {
        const ctx = document.getElementById('balanceChart').getContext('2d');
        const data = prepareData();

        const dates = data.dates;
        const balances = data.balances;

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Costs',
                    data: balances,
                    borderColor: '#6ECC39',
                    fill: false,
                }]
            },
            options: {
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day'
                        }
                    },
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    };

    return {
        render
    }
};

const transactionFormComponent = (transactionService) => {
    const renderCategorySelect = () => {
        const categorySelect = document.querySelector('#categorySelect');
        let str = '';

        transactionService.getCategories().map(category => {
            str += `<option>${category}</option>`
        });

        categorySelect.innerHTML = str;
    };
    renderCategorySelect();

    const handle = () => {
        const newRecordForm = document.getElementById('newRecordForm');

        newRecordForm.addEventListener('submit', function (e) {
            e.preventDefault();

            let category = document.getElementById('categorySelect').value;
            let type = document.querySelector('input[name="type"]:checked').value;
            let amount = Math.abs(document.getElementById('amount').value);
            let comment = document.getElementById('comment').value;
            amount = type === 'income' ? amount : -amount;
            newRecordForm.reset();

            transactionService.add(amount, category, null, comment);
        });
    };

    return {
        handle
    }
};

/*---------- /additional functions ----------*/

const formatDate = date => date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

/*---------- /additional functions ----------*/

const events = eventEmitter();
const repository = transactionsRepository(tokenizer());
const transaction = transactionService(repository, events);

const totalBalance = totalBalanceComponent(repository, events);
const historyTable = historyTableComponent(transaction, repository, events);
const historyDiagram = historyDiagramComponent(repository, events);
const costSchedule = costScheduleComponent(repository, events);

const transactionForm = transactionFormComponent(transaction, totalBalance);

totalBalance.render();
transactionForm.handle();
historyTable.render();
historyDiagram.render();
costSchedule.render();

// console.log(events);
