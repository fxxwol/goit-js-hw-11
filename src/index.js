import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchImg } from './fetchImg';

const refs = {
  input: document.querySelector('.input-field'),
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  photoCard: document.querySelector('.photo-card')
}

refs.form.addEventListener('submit', onSubmit)

const createCardMarkup = ({ webformatURL, tags, likes, views, comments, downloads }) => {
  const [...rest] = Object.values(tags)
  return `<div class="photo-card">
  <img src="${webformatURL}" alt="${rest}" loading="lazy" class="card-img"/>
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
</div>`}

const makeGalleryMarkup = (arr) => arr.map(createCardMarkup).join('')

let options = {
  root: null,
  rootMargin: "300px",
  threshold: 1.0,
};
let currPage = 1

let observer = new IntersectionObserver(onLoad, options);
function onLoad(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      currPage += 1
      console.log(currPage)
      fetchImg(query, currPage).then(data => {
        if (!data.total) {
          Notify.failure("Sorry, there are no images matching your search query. Please try again.")
        }
        refs.gallery.insertAdjacentHTML('beforeend', makeGalleryMarkup(data.hits))
      }
      )
        .catch((e) => {
          Notify.failure("Error happened :(")
          console.log(e.message)
        });
    }
  });

}

function onSubmit(e) {
  e.preventDefault()
  const query = refs.input.value.trim()

  fetchImg(query).then(data => {
    if (!data.total) {
      Notify.failure("Sorry, there are no images matching your search query. Please try again.")
    }
    console.log(data)
    refs.gallery.insertAdjacentHTML('beforeend', makeGalleryMarkup(data.hits))
    observer.observe(refs.gallery)
  }
  )
    .catch((e) => {
      Notify.failure("Error happened :(")
      console.log(e.message)
    });
  
}
