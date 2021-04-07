import galleryItems from '../gallery-items.js';

// Разбей задание на несколько подзадач:
// Создание и рендер разметки по массиву данных и предоставленному шаблону.
// Реализация делегирования на галерее ul.js-gallery и получение url большого изображения.
// Открытие модального окна по клику на элементе галереи.

// Подмена значения атрибута src элемента img.lightbox__image.
// Закрытие модального окна по клику на кнопку button[data-action="close-lightbox"].
// Очистка значения атрибута src элемента img.lightbox__image. Это необходимо для того, чтобы при следующем открытии модального окна, пока грузится изображение, мы не видели предыдущее.

// Ссылки на элементы
const refs = {
  gallery: document.querySelector('.js-gallery'),
  lightbox: document.querySelector('.js-lightbox'),
  lightboxImg: document.querySelector('.lightbox__image'),
  lightboxOverlay: document.querySelector('.lightbox__overlay'),
  lightboxCloseBtn: document.querySelector(
    'button[data-action="close-lightbox"]',
  ),
};

const galleryMarkup = makeGalleryMarkup(galleryItems); // Переменная с отрендеренной разметкой
refs.gallery.insertAdjacentHTML('afterbegin', galleryMarkup); // Добавляет разметку в галлерею

refs.gallery.addEventListener('click', onModalOpen);
refs.lightbox.addEventListener('click', onModalClose);

// Функция, создающая разметку из массива
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
// Коллбек для слушателя открытия модалки
function onModalOpen(e) {
  e.preventDefault();
  document.body.style.overflow = 'hidden'; // Фикс скролла на боди при открытой модалке

  if (e.target.tagName !== 'IMG') {
    return;
  }

  setOriginalImageOnLightbox(e); // Меняет превью изображения на оригинал
  addOpenLightboxClass(); // Добавляет класс открытой модалки

  // Добавляет слушателей для манипуляций с клавиатуры
  window.addEventListener('keydown', onModalClose);
  window.addEventListener('keydown', onArrowPress);
}

// Коллбек для слушателя закрытия модалки
function onModalClose(e) {
  const isLightboxOverlayEl = e.target === refs.lightboxOverlay;
  const isLightboxCloseBtnEl = e.target === refs.lightboxCloseBtn;
  const isEscBtn = e.code === 'Escape';

  // Проверка на нажатие необходимых для закрытия кнопок
  if (isLightboxOverlayEl || isLightboxCloseBtnEl || isEscBtn) {
    removeOpenLightboxClass(); // Убирает класс открытой модалки

    refs.lightboxImg.src = ''; // Очищает значение атрибута src элемента img.lightbox__image

    document.body.removeAttribute('Style');
    window.removeEventListener('keydown', onModalClose);
    window.removeEventListener('keydown', onArrowPress);
  }
}

function onArrowPress(e) {
  changeLightboxImage(e);
}

// Меняет изображения по нажатию на стрелки
function changeLightboxImage(e) {
  const isArrowRight = e.code === 'ArrowRight';
  const isArrowLeft = e.code === 'ArrowLeft';
  let currentLightboxImage = refs.lightboxImg.src; // Текущее изображение модалки

  galleryItems.forEach((item, index, arr) => {
    const nextItem = arr[index + 1]; // Следующий объект галлереи
    const prevItem = arr[index - 1]; // Предыдущий объект галлереи
    const originalImage = item.original; // URL Оригинального изображения

    if (isArrowRight && nextItem && refs.lightboxImg.src === originalImage) {
      currentLightboxImage = nextItem.original;
    }

    if (isArrowLeft && prevItem && refs.lightboxImg.src === originalImage) {
      currentLightboxImage = prevItem.original;
    }
  });

  refs.lightboxImg.src = currentLightboxImage;
}

// Устанавливает оригинальное изображение
function setOriginalImageOnLightbox(e) {
  const originalImg = e.target.dataset.source;
  refs.lightboxImg.src = originalImg;
}

function addOpenLightboxClass() {
  refs.lightbox.classList.add('is-open');
}

function removeOpenLightboxClass() {
  refs.lightbox.classList.remove('is-open');
}
