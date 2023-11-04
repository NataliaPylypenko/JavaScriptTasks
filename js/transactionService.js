const eventEmitter = () => {
   const events = {}
    return {
        events,
        subscribe: (eventName, callback) => {
            !events[eventName] && (events[eventName] = []);
            events[eventName].push(callback);
        },
        unsubscribe: (eventName, callback) => {
            events[eventName] = events[eventName].filter(eventCallback => callback !== eventCallback);
        },
        emit: (eventName, args) => {
            const event = events[eventName];
            event && event.forEach(callback => callback.call(null, args));
        }
    };
}

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

    const getExpenses = () => transactions.filter(transaction => transaction.amount > 0);

    const getTotalBalance = () => transactions.reduce((a, b) => a += b.amount, 0);
    const getTotalExpenses = () => getExpenses().reduce((a, b) => a += b.amount, 0);

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
        save();
    };

    const save = () => {
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
    }
};

const transactionService = (repository, events) => {
    const CATEGORIES = ['Salary', 'Transport', 'Food', 'Entertainment', 'Utility Payments'];

    const getCategories = () => CATEGORIES

    const add = (amount, category, date, comment) => {

        if(CATEGORIES.find((item) => category) === undefined){
            throw `Category ${category} is not found!`
        }

        repository.add(
            amount,
            category,
            date || new Date(),
            comment
        )

        events.emit('transaction.changed')
    }

    const remove = (id) => {
        repository.remove(id);
        events.emit('transaction.changed')
    }

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
        if (sum < 0) {
            cl = 'red';
        }
        totalBalance.innerHTML = `<h1 style="color:${cl}">${sum}$</h1>`
    };

    events.subscribe('transaction.changed', () => render())

    return {
        render
    }
}

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
                        <td>${transaction.date}</td>
                        <td>${transaction.category}</td>
                        <td>${transaction.comment}</td>
                        <td><button type="button" data-id="${transaction.id}" class="btn btn-outline-danger">Remove</button></td>
                    </tr>`
        });

        tableBody.innerHTML = str;
    };

    events.subscribe('transaction.changed', () => render())


    return {
        render
    }
}

const historyDiagramComponent = (repository, events) => {
    const prepareData = () => {
        const result = [['Category', 'Mhl']];
        const totalExpenses = repository.getTotalExpenses()

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

        events.subscribe('transaction.changed', () => render())

        return result;
    };

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
}

const costScheduleComponent = (repository, events) => {
    const prepareData = () => {
        const result = [];

        repository.getExpenses().map(transaction => {
            const date = transaction.date;
            const dateExists = result.some(item => item.date === date);
            const amount = Math.abs(transaction.amount)

            if (dateExists) {
                const index = result.findIndex(item => item.date === date);
                result[index].balance += amount;
            } else {
                result.push({
                    date: formatDate(new Date(date)),
                    balance: amount
                });
            }
        });

        return result;
    };

    events.subscribe('transaction.changed', () => render())

    const render = () => {
        const ctx = document.getElementById('balanceChart').getContext('2d');
        const data = prepareData();

        const dates = data.map(item => item.date);
        const balances = data.map(item => item.balance);

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
}

const transactionFormComponent = (transactionService, totalBalance) => {
    const renderCategorySelect = () => {
        const categorySelect = document.querySelector('#categorySelect');
        let str = '';

        transactionService.getCategories().map(category => {
            str += `<option>${category}</option>`
        });

        categorySelect.innerHTML = str;
    };
    renderCategorySelect();


    const handle = (transactionService) => {
        const newRecordForm = document.getElementById('newRecordForm');
        const newRecordBtn = document.getElementById('newRecordBtn');
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
    }
    return {
        handle: () => handle(transactionService, totalBalance)
    }
}

/*---------- /additional functions ----------*/
const formatDate = date => date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });


/*---------- /additional functions ----------*/

const events = eventEmitter();
const repository = transactionsRepository(tokenizer());
const transaction = transactionService(repository, events);

const totalBalance = totalBalanceComponent(repository, events)
const historyTable = historyTableComponent(transaction, repository, events)
const historyDiagram = historyDiagramComponent(repository, events)
const costSchedule = costScheduleComponent(repository, events)

const transactionForm = transactionFormComponent(transaction, totalBalance)


totalBalance.render()
transactionForm.handle()
historyTable.render()
historyDiagram.render()
costSchedule.render()

console.log(events)

