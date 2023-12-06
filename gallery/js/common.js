const galleryItems = [
  {
    preview:
      'https://cdn.pixabay.com/photo/2019/05/14/16/43/himilayan-blue-poppy-4202825__340.jpg',
    original:
      'https://cdn.pixabay.com/photo/2019/05/14/16/43/himilayan-blue-poppy-4202825_1280.jpg',
    description: 'Hokkaido Flower',
  },
  {
    preview:
      'https://cdn.pixabay.com/photo/2019/05/14/22/05/container-4203677__340.jpg',
    original:
      'https://cdn.pixabay.com/photo/2019/05/14/22/05/container-4203677_1280.jpg',
    description: 'Container Haulage Freight',
  },
  {
    preview:
      'https://cdn.pixabay.com/photo/2019/05/16/09/47/beach-4206785__340.jpg',
    original:
      'https://cdn.pixabay.com/photo/2019/05/16/09/47/beach-4206785_1280.jpg',
    description: 'Aerial Beach View',
  },
  {
    preview:
      'https://cdn.pixabay.com/photo/2016/11/18/16/19/flowers-1835619__340.jpg',
    original:
      'https://cdn.pixabay.com/photo/2016/11/18/16/19/flowers-1835619_1280.jpg',
    description: 'Flower Blooms',
  },
  {
    preview:
      'https://cdn.pixabay.com/photo/2018/09/13/10/36/mountains-3674334__340.jpg',
    original:
      'https://cdn.pixabay.com/photo/2018/09/13/10/36/mountains-3674334_1280.jpg',
    description: 'Alpine Mountains',
  },
  {
    preview:
      'https://cdn.pixabay.com/photo/2019/05/16/23/04/landscape-4208571__340.jpg',
    original:
      'https://cdn.pixabay.com/photo/2019/05/16/23/04/landscape-4208571_1280.jpg',
    description: 'Mountain Lake Sailing',
  },
  {
    preview:
      'https://cdn.pixabay.com/photo/2019/05/17/09/27/the-alps-4209272__340.jpg',
    original:
      'https://cdn.pixabay.com/photo/2019/05/17/09/27/the-alps-4209272_1280.jpg',
    description: 'Alpine Spring Meadows',
  },
  {
    preview:
      'https://cdn.pixabay.com/photo/2019/05/16/21/10/landscape-4208255__340.jpg',
    original:
      'https://cdn.pixabay.com/photo/2019/05/16/21/10/landscape-4208255_1280.jpg',
    description: 'Nature Landscape',
  },
  {
    preview:
      'https://cdn.pixabay.com/photo/2019/05/17/04/35/lighthouse-4208843__340.jpg',
    original:
      'https://cdn.pixabay.com/photo/2019/05/17/04/35/lighthouse-4208843_1280.jpg',
    description: 'Lighthouse Coast Sea',
  },
];

class GalleryList {
  constructor(element) {
      this.element = element;
  }

  generateList(galleryItems) {
    return galleryItems.map(galleryItem => {
      return `<li class="gallery__item">
        <a class="gallery__link" href="${galleryItem.original}">
          <img class="gallery__image"
            src="${galleryItem.preview}"
            alt="${galleryItem.description}"
            data-source="${galleryItem.original}" 
          />
        </a>
      </li>`
    });
  }

  render() {
      this.element.innerHTML = this.generateList(galleryItems).join('');
  }

  onClick(callback) {
      this.element.addEventListener('click', callback);
  }
}

class Modal {
  constructor(element) {
    this.element = element;
    this.image = document.querySelector('.lightbox__image');
  }

  onClick(callback) {
    this.element.addEventListener('click', callback);
  }

  onKeydown(callback) {
    document.addEventListener('keydown', callback);
  }
}

class AppController {
  constructor(galleryItems, gallery, modal) {
    this.gallery = gallery;
    this.modal = modal;
    this.galleryItems = galleryItems;
  }

  initialize() {
    this.gallery.render(this.galleryItems);

    this.gallery.onClick((e) => {
      if(e.target.tagName === 'IMG') {
        e.preventDefault();
        const src = e.target.getAttribute('data-source');
        this.openModal(src);
      }
    });

    this.modal.onClick((e) => {
      if(e.target.matches('[data-action="close-lightbox"]') || e.target.className === 'lightbox__overlay') {
        this.closeModal();
      }
    });

    this.modal.onKeydown((e) => {
      if(e.key === "Escape") {
        this.closeModal();
      }

      if(e.key === "ArrowRight") {
        this.moveRight();
      }

      if(e.key === "ArrowLeft") {
        this.moveLeft();
      }
    });
  }

  openModal(src) {
    this.modal.element.classList.add('is-open');
    this.modal.image.src = src;
  }

  closeModal() {
    this.modal.element.classList.remove('is-open');
    this.modal.image.src = '';
  }

  getActiveImg() {
    return this.galleryItems.findIndex(item => item.original === this.modal.image.src);
  }

  moveRight() {
    const index = this.getActiveImg();
    if (index < this.galleryItems.length - 1) {
      this.modal.image.src = this.galleryItems[index + 1].original;
    }
  }

  moveLeft() {
    const index = this.getActiveImg();
    if (index > 0) {
      this.modal.image.src = this.galleryItems[index - 1].original;
    }
  }
}

const gallery = new GalleryList(document.querySelector('.js-gallery'));
const modal = new Modal(document.querySelector('.js-lightbox'));

const appController = new AppController(galleryItems, gallery, modal);
appController.initialize();