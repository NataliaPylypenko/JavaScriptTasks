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
    const CATEGORIES = ['utility payments', 'purchases', 'make transfer', 'receive transfer', 'replenishment'];
    const FILTER_CONDITION = ['expenses', 'income', 'utility payments', 'purchases', 'make transfer', 'receive transfer', 'replenishment'];
    const TRANSACTION_FILTERS = {
        'expenses': () => transactions.filter(a => a.amount < 0),
        'income': () => transactions.filter(a => a.amount > 0),
        'utility payments': () => transactions.filter(a => a.category === 'utility payments'),
        'purchases': () => transactions.filter(a => a.category === 'purchases'),
        'make transfer': () => transactions.filter(a => a.category === 'make transfer'),
        'receive transfer': () => transactions.filter(a => a.category === 'receive transfer'),
        'replenishment': () => transactions.filter(a => a.category === 'replenishment'),
    };

    const add = (category, amount, comment = '') => {
        transactions.push({
            id: generateUniqueId(),
            date: formatDate(new Date()),
            category,
            amount,
            comment,
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

    const findBy = (filterCondition) => TRANSACTION_FILTERS[filterCondition]();

    const render = () => {
        const tableBody = document.querySelector('#history tbody');
        let str = '';

        transactions.map((transaction, i) => {
            str += `<tr>
                        <td>${++i}</td>
                        <td>${transaction.date}</td>
                        <td>${transaction.amount}$</td>
                        <td>${transaction.category}</td>
                        <td>${transaction.comment}</td>
                        <td><button type="button" class="btn btn-outline-danger">Remove</button></td>
                    </tr>`
        });

        tableBody.innerHTML = str;
    };

    load();

    return {
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

transactions.add(getRandomArrayItem(transactions.CATEGORIES), randomInteger(-1000, 1000));
transactions.add(getRandomArrayItem(transactions.CATEGORIES), randomInteger(-1000, 1000), 'for bread)');
transactions.add(getRandomArrayItem(transactions.CATEGORIES), randomInteger(-1000, 1000), 'hello)');
transactions.add(getRandomArrayItem(transactions.CATEGORIES), randomInteger(-1000, 1000));
transactions.add(getRandomArrayItem(transactions.CATEGORIES), randomInteger(-1000, 1000), 'for coffee');

transactions.render();

// console.log('Total Balance', transactions.getTotalBalance());
// console.log('Filtered Transactions', transactions.findBy(getRandomArrayItem(transactions.FILTER_CONDITION)));

// transactions.save();
// console.log('Get Transactions', transactions.getAll());
