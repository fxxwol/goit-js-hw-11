
 const createCardMarkup = ({ largeImageURL, webformatURL, tags, likes, views, comments, downloads }) => {
    return `<div class="photo-card">
   <a class="gallery__link" href="${largeImageURL}">
      <img loading="lazy" src="${webformatURL}" alt="${tags}" loading="lazy" class="card-img"/>
   </a>
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
export default makeGalleryMarkup;