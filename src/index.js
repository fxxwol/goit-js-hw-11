import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchImg } from './fetchImg';

const refs = {
    input: document.querySelector('.input-field'),
    form: document.querySelector('.search-form'),
    gallery: document.querySelector('.gallery')
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

function onSubmit(e) {
    e.preventDefault()
    const query = refs.input.value.trim()
    // if (!query) {
    //     refs.list.innerHTML = ''
    //     refs.infoDiv.innerHTML = ''
    //     return
    // }

    fetchImg(query).then(data => {
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
