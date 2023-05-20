import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchImg } from './fetchImg';
import makeGalleryMarkup from './drawInterface'
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

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

async function loadMoreImages() {
  isLoading = true;
  currentPage++;
  if (currentPage >= totalPages) {
    Notify.info("We're sorry, but you've reached the end of search results.")
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

async function onSubmit(e) {
  e.preventDefault();
  query = refs.input.value.trim();
  currentPage = 1;

  if (!query) {
    Notify.warning('Please enter a query in the search field')
    return;
  }

  try {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const data = await fetchImg(query, currentPage)
    refs.form.reset();
    totalPages = Math.ceil(data.totalHits / 40) + 1;
    if (!data.total) {
      Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    } else { Notify.success(`Hooray! We found ${data.totalHits} images.`) }

    refs.gallery.innerHTML = makeGalleryMarkup(data.hits);
    lightBox = new SimpleLightbox('.gallery a');
    observer.observe(refs.gallery.lastElementChild);
    

  } catch (error) {
    Notify.failure("Error happened :(");
     console.log(error.message);
  }

}