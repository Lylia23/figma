const urlHost = 'http://localhost:5678/api';
const tabFiltres = ['Tous', 'Objets', 'Appartements', 'Hôtels & restaurants'];
const categoryIds = [1, 2, 3];

verifyToken();

construireFiltres();
getWorks(0);
addEventListenerLog();

//----------functions--------------------

function getCategories () {
    fetch(urlHost + '/categories', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + retreiveToken()
        }
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('There was a problem with the fetch operation:', error)); 
}

 function getWorks (filtre) {

    for (let i = 0; i < tabFiltres.length; i++) {
        // recuperation des boutons des filtres par id 
        let id = 'btn-' + i;
        let btnFiltre = document.getElementById(id);
        if (filtre == i){
            //Application de la classe de style au moment du clique 
            btnFiltre.className = "btn-filtre-on-clique";
        } else {
            //remetre le style par defaut des boutons non selectionnés
            btnFiltre.className = "btn-filtre";
        }
    }

    fetch(urlHost + '/works', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + retreiveToken()
        }
    })
    .then(response => response.json())
    .then(data => {
        remplirGalleryOfWorks(data, filtre);
    })
    .catch(error => console.error('There was a problem with the fetch operation:', error)); 
}

/*
function createWorks(image, title, category) {
    const formData = new FormData();

    //formData.append('profile_picture', fileInputElement.files[0]);
    
    formData.append('image', image);
    formData.append('title', title);
    formData.append('category', category);

    fetch(urlHost + '/works', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function deleteWorks (workId) {
    
}
*/


function remplirGalleryOfWorks(jsonData, filtre) {
    //vider la galerie
    document.querySelector(".gallery").innerHTML = "";
    
    for (let i = 0; i < jsonData.length; i++){
        let figure = jsonData [i];
        //Condition pour enrichir toutes les figures 
        if (!categoryIds.includes(filtre)) {
            let figureHtml = '<figure><img src="' + figure.imageUrl + '" alt="' + figure.title + '"><figcaption>' + figure.title + '</figcaption></figure>';
            document.querySelector(".gallery").innerHTML = document.querySelector(".gallery").innerHTML + figureHtml;
        
        } else 
        //Condition pour enrichir que les figures qui ont l'id demandé au niveau du paramètre filtre
        if(figure.categoryId == filtre) {

            let figureHtml = '<figure><img src="' + figure.imageUrl + '" alt="' + figure.title + '"><figcaption>' + figure.title + '</figcaption></figure>';
            document.querySelector(".gallery").innerHTML = document.querySelector(".gallery").innerHTML + figureHtml;

        }
    }
}

function construireFiltres() {
    for(let i = 0; i < tabFiltres.length; i++) {
        let idFiltre = 'btn-' + i;
        let filtre = '<div id="' + idFiltre + '"><p>' + tabFiltres[i] + '</p></div>';
        document.querySelector('.filtre').innerHTML = document.querySelector('.filtre').innerHTML + filtre;
    }
    addEventListenerAuFiltres();
}

function addEventListenerAuFiltres() {
    for(let i = 0; i < tabFiltres.length; i++) {
        document.getElementById('btn-' + i).addEventListener('click', ()=>getWorks(i));
    }
}

function verifyToken() {
    let monToken = retreiveToken();
    document.getElementById('log').innerHTML = !monToken ? 'login' : 'logout';
    document.querySelector(".mes-projet div").className = !monToken ? 'hide-mes-projet-modifier' : '';
    document.querySelector(".mes-projet div").addEventListener('click', ()=>loadPopup());
    document.querySelector(".mode-edition").className = !monToken ? 'hide-mode-edition' : 'mode-edition';
}

function retreiveToken () {
    return localStorage.getItem('monToken');
}

function addEventListenerLog() {
        document.getElementById('log').addEventListener('click', ()=>{
            let monToken = retreiveToken();
            if (!monToken) {
                redirectionToLogin();
            } else {
                removeToken();
                verifyToken();
            }
        });
}

function removeToken (){
    return localStorage.removeItem('monToken');
}

function redirectionToLogin() {
    window.location.href = window.location.origin + '/FrontEnd/pages/login.html';
}

function loadPopup() {
    fetch('./pages/popup.html')
    .then(response => response.text())
    .then(data => {
        const container = document.createElement('div');
        container.innerHTML = data;
        container.id = "popup"
        const popupPostion = document.getElementById('popup-position');
        popupPostion.className = 'show-popup-position';
        let pageHeight = document.documentElement.scrollHeight;
        popupPostion.style.height = pageHeight + 'px';
        popupPostion.appendChild(container);
        addEventListenerAuToPopupBtns();
        remplirPopupGalerie();
    })
    .catch(error => console.error('Error loading the file:', error));
}
