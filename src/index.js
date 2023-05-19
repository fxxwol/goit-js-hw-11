import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchImg } from './fetchImg';
import makeGalleryMarkup from './drawInterface'
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
const throttle = require('lodash.throttle');

const refs = {
  input: document.querySelector('.input-field'),
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
};

let totalPages = 0;
let currentPage = 1;
let isLoading = false;
let query = '';
let lightBox;

refs.form.addEventListener('submit', onSubmit);
refs.input.addEventListener('input', throttle(clearPage, 200))

async function loadMoreImages() {
  isLoading = true;
  currentPage++;
  if (currentPage >= totalPages) {
    observer.unobserve(refs.gallery.lastElementChild);
    return;
  }
  try {
    const data = await fetchImg(query, currentPage)

    refs.gallery.insertAdjacentHTML('beforeend', makeGalleryMarkup(data.hits));
    lightBox.refresh();
    observer.observe(refs.gallery.lastElementChild);

  }
  catch (error) {
    console.error(error);
  } finally {
    isLoading = false;
  }
}

const handleIntersection = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && !isLoading) {
      loadMoreImages();
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
        totalPages = Math.ceil(data.totalHits / 20);
        if (!data.total) {
          Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        } else { Notify.success(`Hooray! We found ${data.totalHits} images.`) }
        refs.gallery.innerHTML = makeGalleryMarkup(data.hits);
        lightBox = new SimpleLightbox('.gallery a');
        if (refs.gallery.lastElementChild) {
          observer.observe(refs.gallery.lastElementChild);
        }
      })
      .catch((e) => {
        Notify.failure("Error happened :(");
        console.log(e.message);
      });
}
function clearPage() {
  if (refs.input.value) {
    refs.gallery.innerHTML = ''
  }
}