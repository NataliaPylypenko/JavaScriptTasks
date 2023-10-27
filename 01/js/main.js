
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

    Реалізуйте можливість зберігати поточний стан системи фінансів у локальному сховищі (localStorage) та завантажувати дані при завантаженні сторінки.
    Візуалізація даних.

    Додайте можливість побудови графіка зміни балансу з часом.
    Це завдання вимагає від вас використання функцій, масивів, обробників подій та роботи з локальним сховищем. Також, ви можете використовувати HTML та CSS для створення користувацького інтерфейсу.

    Бажаю успіху у вирішенні цього складного завдання на тему функцій у JavaScript!

 */


const randomInteger = (min, max) =>  Math.floor(min + Math.random() * (max + 1 - min));

const generate = (keyLength, characters) => [...Array(keyLength)]
    .map( () => characters[randomInteger(0, characters.length - 1)])
    .join('');

function generateUniqueId() {
    return generate(9, 'abcdefghijklmnopqrstuvwxyz0123456789');
}

function formatDate(date) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('uk-UA', options);
}

function getRandomCategory(categories) {
    const randomIndex = Math.floor(Math.random() * categories.length);
    return categories[randomIndex];
}

const categories = ['utility payments', 'purchases', 'make transfer', 'receive transfer', 'replenishment'];




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

console.log(transactions);

addTransaction(getRandomCategory(categories), randomInteger(-1000, 1000));
addTransaction(getRandomCategory(categories), randomInteger(-1000, 1000), 'for bread)');
addTransaction(getRandomCategory(categories), randomInteger(-1000, 1000), 'hello)');

console.log(transactions);

deleteTransaction(12);

console.log(transactions);


/*

deleteTransaction(id) {}

for(-90; today){
  for(rand(1, 50), ){
    addTransaction(rand(-10000, 10000, 'caategoiry',  today))
  }
}

getAmount(){
  transactions.reduce(....)
}


criteria = {datefrom: '2029-20', dateto: '2020', amountfrom: '0'}

findTransactionsBy(criteria){

  transactions.filter(....)
}

renderTransactions(){
  document.

}

saveTransactions(){
  localstorage.save(Json.deconde(transactions)
}

loadTransacions(){
  localstorage.get(Json.encode(transactions)).
}

*/
