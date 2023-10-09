import Notiflix from 'notiflix';
import axios from 'axios';

const searchForm = document.getElementById("search-form");
const gallery = document.querySelector(".gallery");
const loadMoreButton = document.querySelector(".load-more");
let page = 1;
let searchQuery = '';
let totalHits = 0; 
let loadedImagesCount = 0;

const apiKey = "39897320-b68065050135ed430301d40a9";

searchForm.addEventListener("submit", async (e) => {
   e.preventDefault();
   searchQuery = e.target.searchQuery.value;

   gallery.innerHTML = "";
   page = 1;

   if (searchQuery.trim() === "") {
      Notiflix.Notify.failure('Please enter a search query.');
      return;
   }
   try {
      const response = await axios.get(
            `https://pixabay.com/api/?key=${apiKey}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
      );

      const data = response.data;
      
      if (data.hits.length === 0) {
            Notiflix.Notify.info('Sorry, there are no images matching your search query. Please try again.'); 
      loadMoreButton.style.display = "none";
      } else {
            totalHits = data.totalHits; 
         loadedImagesCount += data.hits.length;
         
            data.hits.forEach((image) => {
               const photoCard = document.createElement("div");
               photoCard.classList.add("photo-card");
               photoCard.innerHTML = `
                  <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
                  <div class="info">
                     <p class="info-item"><b>Likes:</b> ${image.likes}</p>
                     <p class="info-item"><b>Views:</b> ${image.views}</p>
                     <p class="info-item"><b>Comments:</b> ${image.comments}</p>
                     <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
                  </div>
               `;
               gallery.appendChild(photoCard);
            });

         if (loadedImagesCount >= totalHits) {
               loadMoreButton.style.display = "none"; 
            } else {
               loadMoreButton.style.display = "block";
            }
      }
   } catch (error) {
		console.error("Error fetching images:", error);
		Notiflix.Notify.failure('An error occurred while fetching images.'); 

   }
});

loadMoreButton.addEventListener("click", async () => {
   page++;
   try {
      const response = await axios.get(
            `https://pixabay.com/api/?key=${apiKey}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
      );
      const data = response.data;

      if (data.hits.length === 0) {
         Notiflix.Notify.info('No more images to load.');
         loadMoreButton.style.display = "none";
      } else {
         loadedImagesCount += data.hits.length; 

         data.hits.forEach((image) => {
            const photoCard = document.createElement("div");
            photoCard.classList.add("photo-card");
            photoCard.innerHTML = `
               <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
               <div class="info">
                  <p class="info-item"><b>Likes:</b> ${image.likes}</p>
                  <p class="info-item"><b>Views:</b> ${image.views}</p>
                  <p class="info-item"><b>Comments:</b> ${image.comments}</p>
                  <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
               </div>
            `;
            gallery.appendChild(photoCard);
         });

         if (loadedImagesCount >= totalHits) {
            loadMoreButton.style.display = "none"; 
         } else {
            loadMoreButton.style.display = "block";
         }
      }
   } catch (error) {
      console.error("Error fetching more images:", error);
      Notiflix.Notify.failure('An error occurred while fetching more images.'); 
   }
});