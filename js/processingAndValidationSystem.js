/*
    Розробити систему обробки та валідації форми зворотного зв'язку на JavaScript, використовуючи
    об'єктно-орієнтовані класи. Форма повинна включати поля для імені, електронної пошти, теми повідомлення
    та тексту повідомлення. Потрібно перевірити, що жодне з полів не є порожнім, що електронна адреса має
    вірний формат, а текст повідомлення містить щонайменше 20 символів.

    Клас FeedbackForm:
    Має метод render(), який відображає форму в HTML.
    Містить метод collectData(), який збирає та повертає дані з форми.

    Клас FormValidator:
    Відповідає за валідацію даних, зібраних з форми.
    Має метод validate(data), який перевіряє валідність даних та повертає об'єкт із помилками валідації.

    Клас FeedbackProcessor:
    Відповідає за обробку даних форми після того, як вони пройшли валідацію.
    Має метод process(data), який може, наприклад, відправляти дані на сервер або зберігати їх у локальній базі даних.
 */

class FeedbackForm {
    render() {
        const feedbackForm = document.querySelector('#feedbackForm');

        return feedbackForm.innerHTML = `
                <div class="mb-3">
                    <label for="name" class="form-label">Name:</label>
                    <input type="text" class="form-control" id="name" placeholder="Enter name" name="name" required>
                </div>
                <div class="mb-3">
                    <label for="email" class="form-label">Email:</label>
                    <input type="email" class="form-control" id="email" placeholder="Enter email" name="email" required>
                </div>
                <div class="mb-3">
                    <label for="subject" class="form-label">Message subject:</label>
                    <input type="text" class="form-control" id="subject" placeholder="Enter subject" name="subject" required>
                </div>
                <div class="mb-3">
                    <label for="comment" class="form-label">Comment:</label>
                    <textarea class="form-control" rows="2" id="comment" name="text" required></textarea>
                </div>
                <div class="mb-3">
                    <button type="submit" id="submitButton" class="btn btn-outline-success">Submit</button>
                </div>
            `;
    }

    collectData() {
        const data = [];

        let name = document.getElementById('name').value;
        let email = document.getElementById('email').value;
        let subject = document.getElementById('subject').value;
        let comment = document.getElementById('comment').value;

        data.push({
            name: name,
            email: email,
            subject: subject,
            comment: comment,
        });

        return data;
    }
}

class FormValidator {
    validate(data) {
        return data;
    }
}

class FeedbackProcessor {
    process(data) {
        localStorage.setItem('collectData', JSON.stringify(data));
    }
}

const feedbackForm = new FeedbackForm();
feedbackForm.render();

const formValidator = new FormValidator();
const feedbackProcessor = new FeedbackProcessor();

const form = document.querySelector('#feedbackForm');
form.addEventListener('submit', function (e) {
    e.preventDefault();

    const collectData = feedbackForm.collectData();
    console.log(collectData);

    formValidator.validate(collectData);
    feedbackProcessor.process(collectData);

    form.reset();
});


