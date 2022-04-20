import './css/style.css';
import getURL from './helpers/api';
import renderGallery from './helpers/renderGallery';
import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const axios = require('axios').default;
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'notiflix/dist/notiflix-3.2.5.min.css';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');

let gallerySLB = {};
let currentPage = 1;
let querySearch = '';

form.addEventListener('submit', onSearchBtnClick);
btnLoadMore.addEventListener('click', onBtnLoadMore);

async function onSearchBtnClick(event) {
  event.preventDefault();
  querySearch = event.currentTarget.searchQuery.value.trim().split(' ').join('+');
  if (querySearch === '') {
    event.target.reset();
    return;
  }
  gallery.innerHTML = '';
  let searchResult = {};

  try {
    const { data } = await axios.get(getURL(querySearch));
    searchResult = data;
  } catch (error) {
    console.error(error);
  }
  if (!searchResult.hits.length) {
    Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    btnLoadMore.classList.add('is-hidden');
  }

  if (searchResult.total < 40) {
    Notify.success(`We've found ${searchResult.total} matches`);
    renderGallery(searchResult, gallery);
    btnLoadMore.classList.add('is-hidden');
    createLightBox();
  } else {
    Notify.success(`We've found ${searchResult.total} matches`);
    renderGallery(searchResult, gallery);
    btnLoadMore.classList.remove('is-hidden');
    createLightBox();
  }
}

async function onBtnLoadMore(event) {
  event.preventDefault();
  currentPage += 1;
  let searchResult = {};

  try {
    const { data } = await axios.get(getURL(querySearch, currentPage));
    searchResult = data;
  } catch (error) {
    console.error(error);
  }

  if (currentPage * 40 > searchResult.totalHits || currentPage * 40 > searchResult.total) {
    Notify.warning("Sorry, we've reached the limit of our search");
    btnLoadMore.classList.add('is-hidden');
  }

  renderGallery(searchResult, gallery);
  gallerySLB.refresh();
}

function createLightBox() {
  gallerySLB = new simpleLightbox('.gallery a');
}
