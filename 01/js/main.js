
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


/*---------- additional functions ----------*/

const randomInteger = (min, max) => Math.floor(min + Math.random() * (max + 1 - min));

const generate = (keyLength, characters) => [...Array(keyLength)]
    .map( () => characters[randomInteger(0, characters.length - 1)])
    .join('');

const generateUniqueId = () => generate(9, 'abcdefghijklmnopqrstuvwxyz0123456789');

const formatDate = date => date.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' });

const categories = ['utility payments', 'purchases', 'make transfer', 'receive transfer', 'replenishment'];
const filterCondition = ['expenses', 'income', 'utility payments', 'purchases', 'make transfer', 'receive transfer', 'replenishment'];
const getRandomItem = item => item[randomInteger(0, item.length - 1)];

/*---------- /additional functions ----------*/


let transactions = [];
let i = 11;

const addTransaction = (category, amount, comment = null) => {
    transactions.push({
        // id: generateUniqueId(),
        id: i,
        date: formatDate(new Date()),
        category,
        amount,
        comment,
    });

    i++;
};

const deleteTransaction = id => {
    transactions.forEach((item, index) => {
        if (item.id === id) {
            transactions.splice(index, 1);
        }
    });
};

const getTotalBalance = () => transactions.reduce((a, b) => a += b.amount, 0);

const filteredTransactions = {
    'expenses': () => transactions.filter(a => a.amount < 0),
    'income': () => transactions.filter(a => a.amount > 0),
    'utility payments': () => transactions.filter(a => a.category === 'utility payments'),
    'purchases': () => transactions.filter(a => a.category === 'purchases'),
    'make transfer': () => transactions.filter(a => a.category === 'make transfer'),
    'receive transfer': () => transactions.filter(a => a.category === 'receive transfer'),
    'replenishment': () => transactions.filter(a => a.category === 'replenishment'),
};

const getFilteredTransactions = (filterCondition) => filteredTransactions[filterCondition]();

const getTransactionsHistory = () => transactions.map((a, i) => console.log(`Transaction ${++i}: ${a.amount}$ - ${a.category}`));

const setTransactions = (key, obj) => {
    localStorage.setItem(key, JSON.stringify(obj));
};

const getTransactions = (key) => {
    return JSON.parse(localStorage.getItem(key));
};


addTransaction(getRandomItem(categories), randomInteger(-1000, 1000));
addTransaction(getRandomItem(categories), randomInteger(-1000, 1000), 'for bread)');
addTransaction(getRandomItem(categories), randomInteger(-1000, 1000), 'hello)');
addTransaction(getRandomItem(categories), randomInteger(-1000, 1000));
addTransaction(getRandomItem(categories), randomInteger(-1000, 1000), 'for coffee');

console.log(transactions);

// deleteTransaction(12);

console.log('Total Balance', getTotalBalance());

console.log('Filtered Transactions', getFilteredTransactions(getRandomItem(filterCondition)));

getTransactionsHistory();

setTransactions('transactions', transactions);

console.log('Get Transactions', getTransactions('transactions'));

// localStorage.clear();
