class FeedbackForm {
    render() {
        const feedbackForm = document.querySelector('#feedbackForm');

        return feedbackForm.innerHTML = `
                <div class="mb-3">
                    <label for="name" class="form-label">Name:</label>
                    <input type="text" class="form-control" id="name" placeholder="Enter name" name="name">
                </div>
                <div class="mb-3">
                    <label for="email" class="form-label">Email:</label>
                    <input type="email" class="form-control" id="email" placeholder="Enter email" name="email">
                </div>
                <div class="mb-3">
                    <label for="subject" class="form-label">Message subject:</label>
                    <input type="text" class="form-control" id="subject" placeholder="Enter subject" name="subject">
                </div>
                <div class="mb-3">
                    <label for="comment" class="form-label">Comment:</label>
                    <textarea class="form-control" rows="2" id="comment" name="text"></textarea>
                </div>
                <div class="mb-3">
                    <button type="submit" id="submitButton" class="btn btn-outline-success">Submit</button>
                </div>
            `;
    }

    collectData() {
        let name = document.querySelector('#name').value;
        let email = document.querySelector('#email').value;
        let subject = document.querySelector('#subject').value;
        let comment = document.querySelector('#comment').value;

        return {
            name,
            email,
            subject,
            comment,
        };
    }
}

class FormValidator {
    validate(data) {
        const validationErrors = {};

        if (data.name.trim() === '') {
            validationErrors.name = 'Name is a required field!';
        }

        if (data.email.trim() === '') {
            validationErrors.email = 'Email is a required field!';
        } else if (!this.#isValidEmail(data.email)) {
            validationErrors.email = 'The email is in the wrong format!';
        }

        if (data.subject.trim() === '') {
            validationErrors.subject = 'Subject is a required field!';
        }

        if (!data.comment || data.comment.trim().length <= 20) {
            validationErrors.comment = 'The text of the message must contain at least 20 characters!';
        }

        return validationErrors;
    }

    #isValidEmail(email) {
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        return emailRegex.test(email);
    }
}

class FeedbackProcessor {
    process(data) {
        let collectData;
        collectData = localStorage.getItem('collectData')
            ? JSON.parse(localStorage.getItem('collectData'))
            : [];
        collectData.push(data);

        localStorage.setItem('collectData', JSON.stringify(collectData));
    }
}

const feedbackForm = new FeedbackForm();
feedbackForm.render();

const formValidator = new FormValidator();
const feedbackProcessor = new FeedbackProcessor();

const form = document.querySelector('#feedbackForm');
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const collectData = feedbackForm.collectData();

    const validationErrors = formValidator.validate(collectData);

    if(Object.keys(validationErrors).length === 0) {
        feedbackProcessor.process(collectData);
        alert('Success: Data saved successfully!');
    } else {
        alert('Error: Enter the data again!');
    }

    form.reset();
});