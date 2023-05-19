import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchImg } from './fetchImg';

const refs = {
  input: document.querySelector('.input-field'),
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
};

let currentPage = 1;
let isLoading = false;
let query = '';

refs.form.addEventListener('submit', onSubmit);

const createCardMarkup = ({ webformatURL, tags, likes, views, comments, downloads }) => {
  return `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" class="card-img"/>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${downloads}
    </p>
  </div>
</div>`;
};

const makeGalleryMarkup = (arr) => arr.map(createCardMarkup).join('');

async function loadMoreImages() {
  isLoading = true;
  currentPage++;

  try {
    const data = await fetchImg(query, currentPage);
    refs.gallery.insertAdjacentHTML('beforeend', makeGalleryMarkup(data.hits));
     observer.observe(refs.gallery.lastElementChild);
  } catch (error) {
    console.error(error);
  } finally {
    isLoading = false;
  }
}

const handleIntersection = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && !isLoading) {
      loadMoreImages();
      console.log(entry)
    }
  });
};

const options = {
  root: null,
  rootMargin: "200px",
  threshold: 0.5,
};

let observer = new IntersectionObserver(handleIntersection, options);

function onSubmit(e) {
  e.preventDefault();
  query = refs.input.value.trim();
  currentPage = 1;

  fetchImg(query)
    .then((data) => {
      if (!data.total) {
        Notify.failure("Sorry, there are no images matching your search query. Please try again.");
      }
      refs.gallery.innerHTML = makeGalleryMarkup(data.hits);
      if (refs.gallery.lastElementChild) {
        observer.observe(refs.gallery.lastElementChild);
      }
    })
    .catch((e) => {
      Notify.failure("Error happened :(");
      console.log(e.message);
    });
}