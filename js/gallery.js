import galleryItems from '../gallery-items.js';

// Разбей задание на несколько подзадач:
// Создание и рендер разметки по массиву данных и предоставленному шаблону.
// Реализация делегирования на галерее ul.js-gallery и получение url большого изображения.
// Открытие модального окна по клику на элементе галереи.

// Подмена значения атрибута src элемента img.lightbox__image.
// Закрытие модального окна по клику на кнопку button[data-action="close-lightbox"].
// Очистка значения атрибута src элемента img.lightbox__image. Это необходимо для того, чтобы при следующем открытии модального окна, пока грузится изображение, мы не видели предыдущее.

const refs = {
  gallery: document.querySelector('.js-gallery'),
  lightbox: document.querySelector('.js-lightbox'),
  lightboxImg: document.querySelector('.lightbox__image'),
  lightboxOverlay: document.querySelector('.lightbox__overlay'),
  lightboxCloseBtn: document.querySelector(
    'button[data-action="close-lightbox"]',
  ),
};

const galleryMarkup = makeGalleryMarkup(galleryItems);
refs.gallery.insertAdjacentHTML('afterbegin', galleryMarkup);

refs.gallery.addEventListener('click', onModalOpen);
refs.lightbox.addEventListener('click', onModalClose);

function makeGalleryMarkup(items) {
  return galleryItems
    .map(({ preview, original, description }) => {
      return `
        <li class="gallery__item">
        <a class="gallery__link" href="${original}">
        <img
        class="gallery__image"
        src="${preview}"
        data-source="${original}"
        alt="${description}"
        />
        </a>
        </li>`;
    })
    .join('');
}

function onModalOpen(e) {
  e.preventDefault();

  if (e.target.tagName !== 'IMG') {
    return;
  }

  setOriginalImageOnLightbox(e);
  addOpenLightboxClass();

  window.addEventListener('keydown', onEscPress);
}

function onModalClose(e) {
  const isLightboxOverlayEl = e.target === refs.lightboxOverlay;
  const isLightboxCloseBtnEl = e.target === refs.lightboxCloseBtn;
  const isEscBtn = e.code === 'Escape';

  if (isLightboxOverlayEl || isLightboxCloseBtnEl || isEscBtn) {
    removeOpenLightboxClass();
    refs.lightboxImg.src = '';
    window.removeEventListener('keydown', onEscPress);
  }
}

function onEscPress(e) {
  onModalClose(e);
}

function setOriginalImageOnLightbox(el) {
  const originalImg = el.target.dataset.source;
  refs.lightboxImg.src = originalImg;
}

function addOpenLightboxClass() {
  refs.lightbox.classList.add('is-open');
}

function removeOpenLightboxClass() {
  refs.lightbox.classList.remove('is-open');
}
