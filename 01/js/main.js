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

const getRandomArrayItem = array => array[randomInteger(0, array.length - 1)];

/*---------- /additional functions ----------*/

const transactionService = () => {
    const transactions = [];
    const CATEGORIES = ['Salary', 'Transport', 'Food', 'Entertainment', 'Utility Payments'];
    const FILTER_CONDITION = ['expenditure', 'income', 'salary', 'transport', 'food', 'entertainment', 'utility payments'];
    const TRANSACTION_FILTERS = {
        'expenditure': () => transactions.filter(a => a.amount < 0),
        'income': () => transactions.filter(a => a.amount > 0),
        'salary': () => transactions.filter(a => a.category === 'salary'),
        'transport': () => transactions.filter(a => a.category === 'transport'),
        'food': () => transactions.filter(a => a.category === 'food'),
        'entertainment': () => transactions.filter(a => a.category === 'entertainment'),
        'utility payments': () => transactions.filter(a => a.category === 'utility payments'),
    };

    const renderCategorySelect = () => {
        const categorySelect = document.querySelector('#categorySelect');
        let str = '';

        CATEGORIES.map(category => {
            str += `<option>${category}</option>`
        });

        categorySelect.innerHTML = str;
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
        let idx = transactions.findIndex((item) => item.id === id);
        idx !== -1  &&  transactions.splice(idx, 1);
    };

    const getTotalBalance = () => transactions.reduce((a, b) => a += b.amount, 0);

    const save = () => {
        localStorage.setItem('transactions', JSON.stringify(transactions));
    };

    const load = () => {
        transactions.concat(JSON.parse(localStorage.getItem('transactions')));
    };

    load();

    const findBy = (filterCondition) => TRANSACTION_FILTERS[filterCondition]();

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
                        <td><button type="button" class="btn btn-outline-danger">Remove</button></td>
                    </tr>`
        });

        tableBody.innerHTML = str;
    };

    return {
        renderCategorySelect,
        add,
        save,
        findBy,
        remove,
        getTotalBalance,
        render,
        getAll: () => transactions,
        CATEGORIES,
        FILTER_CONDITION,
        TRANSACTION_FILTERS,
    };
};

const transactions = transactionService();

transactions.renderCategorySelect();

// Render transactions
transactions.render();


// Add New Record
const newRecordBtn = document.getElementById('newRecordBtn');

newRecordBtn.addEventListener('click', function (e) {
    e.preventDefault();

    let category = document.getElementById('categorySelect').value;
    let type = document.getElementById('type').value;
    let amount = Math.abs(document.getElementById('amount').value);
    let comment = document.getElementById('comment').value;

    amount = type === 'income' ? amount : -amount;

    transactions.add(amount, category, comment);

    // Rerender transactions
    transactions.render();
});


// console.log('Total Balance', transactions.getTotalBalance());
// console.log('Filtered Transactions', transactions.findBy(getRandomArrayItem(transactions.FILTER_CONDITION)));

// transactions.save();
// console.log('Get Transactions', transactions.getAll());
