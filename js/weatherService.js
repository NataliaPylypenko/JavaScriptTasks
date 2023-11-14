class SearchForm {
    render() {
        const form = document.querySelector('#searchForm');

        return form.innerHTML = `
            <label for="city" class="form-label">Enter your city</label>
            <div class="search-container">
                <input type="text" class="form-control" id="city" placeholder="Search.." name="city">
                <button type="submit" id="submitButton"><i class="fa fa-search"></i></button>
            </div>
        `;
    }

    collectData() {
        return document.querySelector('#city').value;
    }
}

class FormValidator {
    validate(data) {}
}

class SearchProcessor {
    process(data) {}
}

let searchForm = new SearchForm();
searchForm.render();

const form = document.querySelector('#searchForm');
form.addEventListener('submit', (e) => {
    e.preventDefault();

    console.log(searchForm.collectData());

    form.reset();
});
