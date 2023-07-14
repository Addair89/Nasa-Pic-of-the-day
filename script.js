// https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY

const apiKey = 'DEMO_KEY';
const count = 2;
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;
const imagesConatiner = document.querySelector('.images-container');
const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const saveConfirm = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');


let resultsArray = [];
let favorites = {};

function showContent(page) {
    window.scrollTo({
        top: 0,
        behavior: 'instant'
    });
    if(page === 'results'){
        favoritesNav.classList.add('hidden');
        resultsNav.classList.remove('hidden');
    }else{
        favoritesNav.classList.remove('hidden');
        resultsNav.classList.add('hidden');
    }
    loader.classList.add('hidden');
}


function createDomNodes (page) {
    
    const currentArray = page === 'results' ? resultsArray : Object.values(favorites);
    currentArray.forEach((result) => {
        //card container
        const card = document.createElement('div');
        card.classList.add('card');
        //link for image
        const link = document.createElement('a');
        link.href = result.hdurl;
        link.title = 'View Full Image';
        link.target = '_blank';
        //Image
        const image = document.createElement('img');
        image.src = result.hdurl;
        image.alt = 'NASA Photo of the day';
        image.loading = 'lazy';
        image.classList.add('card-image-top');
        //Card Body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        //Card Title
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = result.title;
        //Save Text
        const saveText = document.createElement('p');
        saveText.classList.add('clickable');
        if(page === 'results'){
            saveText.textContent = 'Add to Favorites';
            saveText.setAttribute('onclick', `saveFavorite('${result.url}')`);
        }else {
            saveText.textContent = 'Remove Favorite';
            saveText.setAttribute('onclick', `deleteFavorite('${result.url}')`);
        }
        //Card Description
        const description = document.createElement('p');
        description.classList.add('card-text');
        description.textContent = result.explanation;
        //Date & Copyright
        //Date
        const small = document.createElement('small');
        small.classList.add('text-muted');
        const date = document.createElement('strong');
        date.textContent = result.date;
        //Copyright
        const copyrightResult = result.copyright ? result.copyright : ''; 
        const copyright = document.createElement('span');
        copyright.textContent = ` ${copyrightResult}`;

        //Append all elements together to build the card
        small.append(date, copyright);
        cardBody.append(cardTitle, saveText, description, small);
        link.appendChild(image);
        card.append(link, cardBody);
        imagesConatiner.appendChild(card)
    });
}

function updateDom(page) {
    //Get Favorites from local strorage
    if(localStorage.getItem('nasaFavorites')) {
        favorites = JSON.parse(localStorage.getItem('nasaFavorites'));
        console.log(favorites);
    }
    imagesConatiner.textContent = '';
    createDomNodes(page);
    showContent(page);
}

//Get 10 images from nasa API
async function getNasaPictures(){
    loader.classList.remove('hidden');
    try{
        const response = await fetch(apiUrl);
        resultsArray = await response.json();
        updateDom('results');
    } catch(error){
        console.log(error);
    }
}

//add Result to favorites
const saveFavorite = (itemUrl) => {
    resultsArray.forEach((item) => {
        if(item.url.includes(itemUrl) && !favorites[itemUrl]){
            favorites[itemUrl] = item;
            //show save confirmation
            saveConfirm.hidden = false;
            setTimeout(() =>{
                saveConfirm.hidden = true;
            }, 2000);
            //Set favorites in local storage
            localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        }
    })
}

//Delete item from favorite
const deleteFavorite = (itemUrl) => {
    if(favorites[itemUrl]) {
        delete favorites[itemUrl];
        localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        updateDom('favorites');
    }
}

//onload 
getNasaPictures();
