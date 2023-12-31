<h1>Динамічне створення навігаційного меню</h1>

## Умова:
Уявімо, що у вас є веб-сторінка з декількома розділами, кожен з яких позначений елементом
заголовка <h2>. Ваше завдання — написати скрипт, який автоматично створює навігаційне меню
на основі цих заголовків. Меню має містити посилання, що при кліку перенесуть користувача
до відповідного розділу на сторінці.

## Вхідні дані:
- Веб-сторінка містить кілька <h2> заголовків.
- Кожен <h2> заголовок має унікальний id, що відповідає назві розділу.

## Завдання:
1. Знайти всі <h2> елементи на сторінці та створити NodeList або HTMLCollection.
2. Динамічно створити навігаційне меню (<nav> з вкладеним <ul> списком), де кожен <li> міститиме 
посилання <a> на відповідний розділ сторінки.
3. Вставити це меню в задане місце на сторінці (наприклад, у елемент з класом .menu-container).
4. Забезпечити плавний скрол до розділу при кліку на посилання меню.

## Вимоги:
- Кожен пункт меню має використовувати текст з відповідного <h2> елементу.
- Посилання мають скролити сторінку до id, який відповідає id заголовка <h2>.
- Написати код таким чином, щоб він був масштабованим і легко додавався на будь-яку сторінку
незалежно від кількості розділів.

## Бонус:
- Додати логіку, що змінює клас активного пункту меню на .active при скролі сторінки, щоб відображати,
який розділ зараз переглядається.

Це завдання дозволить вам попрактикуватися в роботі з колекціями вузлів DOM, додаванні елементів до DOM
та обробці подій у JavaScript.