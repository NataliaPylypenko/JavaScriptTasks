class Topnav {
    collectData() {
        let headers = document.querySelectorAll('h2');
        return [...headers].map(header => header.getAttribute('id'));
    }

    render() {
        let nav = document.querySelector('.topnav');
        let list = this.collectData();

        nav.innerHTML = [...list].map(li => {
            return `<li><a href="#${li}">${this.upFirst(li)}</a></li>`;
        }).join('');
    }

    upFirst(word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }
}

const topnav = new Topnav();
topnav.collectData();
topnav.render();