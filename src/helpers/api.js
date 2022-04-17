export default function getURL(query, page = 1) {
  const KEY = '26794105-00755d3499209d24967edc661';
  return `https://pixabay.com/api/?key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;
}
