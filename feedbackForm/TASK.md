<h1>Feedback form</h1>

# Задача:
Розробити систему обробки та валідації форми зворотного зв'язку на JavaScript, використовуючи
об'єктно-орієнтовані класи. Форма повинна включати поля для імені, електронної пошти, теми повідомлення
та тексту повідомлення. Потрібно перевірити, що жодне з полів не є порожнім, що електронна адреса має
вірний формат, а текст повідомлення містить щонайменше 20 символів.

# Класи та їх відповідальності:

## Клас Common:
Має метод render(), який відображає форму в HTML.
Містить метод collectData(), який збирає та повертає дані з форми.

## Клас FormValidator:
Відповідає за валідацію даних, зібраних з форми.
Має метод validate(data), який перевіряє валідність даних та повертає об'єкт із помилками валідації.

## Клас FeedbackProcessor:
Відповідає за обробку даних форми після того, як вони пройшли валідацію.
Має метод process(data), який може, наприклад, відправляти дані на сервер або зберігати їх у локальній базі даних.
