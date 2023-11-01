/*
    Завдання: Система управління фінансами
    Вам потрібно створити систему управління фінансами, використовуючи JavaScript функції.
    Ваша програма повинна мати наступні можливості:

    Додавання та видалення транзакцій.
    Створіть функцію, яка додає нову транзакцію з інформацією про суму та опис.
    Створіть функцію, яка видаляє транзакцію за індексом.

    Розрахунок загального балансу.
    Створіть функцію, яка обчислює і повертає поточний баланс (сума всіх транзакцій).

    Фільтрація транзакцій за певним критерієм.
    Створіть функцію, яка приймає умову фільтрації (наприклад, всі транзакції з позитивними сумами) та повертає список транзакцій, що відповідають цій умові.

    Відображення історії транзакцій.
    Створіть функцію, яка виводить список транзакцій у зрозумілому форматі (наприклад, "Транзакція 1: +$100 - Покупка товару").

    Збереження та завантаження даних.
    Реалізуйте можливість зберігати поточний стан системи фінансів у локальному сховищі (localStorage)
    та завантажувати дані при завантаженні сторінки.

    Візуалізація даних.
    Додайте можливість побудови графіка зміни балансу з часом.

    Це завдання вимагає від вас використання функцій, масивів, обробників подій та роботи з локальним сховищем.
    Також, ви можете використовувати HTML та CSS для створення користувацького інтерфейсу.

    Бажаю успіху у вирішенні цього складного завдання на тему функцій у JavaScript!
 */


/*---------- /additional functions ----------*/

const randomInteger = (min, max) => Math.floor(min + Math.random() * (max + 1 - min));

const generate = (keyLength, characters) => [...Array(keyLength)]
    .map( () => characters[randomInteger(0, characters.length - 1)])
    .join('');

const generateUniqueId = (length = 9) => generate(length, 'abcdefghijklmnopqrstuvwxyz0123456789');

const formatDate = date => date.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' });

/*---------- /additional functions ----------*/

const transactionService = () => {
    const transactions = [];
    const CATEGORIES = ['Salary', 'Transport', 'Food', 'Entertainment', 'Utility Payments'];
    const TRANSACTION_FILTERS = {
        'expenditure': () => transactions.filter(a => a.amount < 0),
        'income': () => transactions.filter(a => a.amount > 0),
        'salary': () => transactions.filter(a => a.category === 'salary'),
        'transport': () => transactions.filter(a => a.category === 'transport'),
        'food': () => transactions.filter(a => a.category === 'food'),
        'entertainment': () => transactions.filter(a => a.category === 'entertainment'),
        'utility payments': () => transactions.filter(a => a.category === 'utility payments'),
    };

    /*
   * Functions
    */

    const getTotalBalance = () => transactions.reduce((a, b) => a += b.amount, 0);

    const generateArr = () => {
        const result = [['Category', 'Mhl']];
        const getTotalBalance = () => transactions.reduce((a, b) => a += Math.abs(b.amount), 0);

        for (let transaction of transactions) {
            const amount = Math.abs(transaction.amount) / getTotalBalance() * 100;
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

    const add = (amount, category, comment) => {
        transactions.push({
            id: generateUniqueId(),
            date: formatDate(new Date()),
            amount: amount,
            category: category,
            comment: comment,
        });
    };

    const remove = id => {
        let idx = transactions.findIndex(item => item.id === id);
        idx !== -1  &&  transactions.splice(idx, 1);
    };

    const save = () => {
        localStorage.setItem('transactions', JSON.stringify(transactions));
    };

    const findBy = (filterCondition) => TRANSACTION_FILTERS[filterCondition]();

    /*
    * Render
     */

    const renderCategorySelect = () => {
        const categorySelect = document.querySelector('#categorySelect');
        let str = '';

        CATEGORIES.map(category => {
            str += `<option>${category}</option>`
        });

        categorySelect.innerHTML = str;
    };
    renderCategorySelect();

    const renderTotalBalance = () => {
        const totalBalance = document.querySelector('#totalBalance');
        const sum = getTotalBalance();
        let cl = 'green';
        if (sum < 0) {
            cl = 'red';
        }
        totalBalance.innerHTML = `<h1 style="color:${cl}">${sum}$</h1>`
    };

    const loadDrawChart = () => {
        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(drawChart);
    };

    const drawChart = () => {
        const data = google.visualization.arrayToDataTable(generateArr());

        const chart = new google.visualization.PieChart(document.getElementById('myChart'));
        chart.draw(data);
    };

    const load = () => {
        localStorage.getItem('transactions') && transactions.push(...JSON.parse(localStorage.getItem('transactions')));
    };
    load();

    const render = () => {
        const tableBody = document.querySelector('#history tbody');
        let str = '';

        transactions.map((transaction, i) => {
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

    /*
    * Events
     */

    const formSubmissionEvents = () => {
        const newRecordForm = document.getElementById('newRecordForm');
        const newRecordBtn = document.getElementById('newRecordBtn');

        newRecordBtn.addEventListener('click', function (e) {
            e.preventDefault();

            let category = document.getElementById('categorySelect').value;
            let type = document.querySelector('input[name="type"]:checked').value;
            let amount = Math.abs(document.getElementById('amount').value);
            let comment = document.getElementById('comment').value;
            amount = type === 'income' ? amount : -amount;

            newRecordForm.reset();

            // Add New Record
            add(amount, category, comment);

            // Rerender Transactions
            render();

            // Rerender Total Balance
            renderTotalBalance();

            // Save To LocalStorage
            save();

            // Load Diagram
            loadDrawChart();
        });
    };
    formSubmissionEvents();

    const removeItemEvents = () => {
        const tableHistory = document.querySelector('#history');

        tableHistory.addEventListener('click', e => {
            e.preventDefault();

            if (e.target && e.target.tagName === "BUTTON") {
                let id = e.target.getAttribute('data-id');

                // Remove record
                remove(id);

                // Rerender Transactions
                render();

                // Render Total Balance
                renderTotalBalance();

                // Save To LocalStorage
                save();

                // Load Diagram
                loadDrawChart();
            }
        });
    };
    removeItemEvents();


    return {
        renderTotalBalance,
        loadDrawChart,
        render
    };
};

const transactions = transactionService();

// Render Total Balance
transactions.renderTotalBalance();

// Render Transactions
transactions.render();

// Load Diagram
transactions.loadDrawChart();