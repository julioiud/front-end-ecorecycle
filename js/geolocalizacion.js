const geo = document.getElementById('geo');

function getLocalizacion() {
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition)
    }else{
        geo.innerHTML = 'Navegador no soporta la Geolocation';
    }    
}

function showPosition (position) {
    const {latitude, longitude} = position.coords;
    geo.innerHTML = 
    `
    <a target="_blank" href="https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}">
        Latitud: ${latitude} /
        Longitud: ${longitude}
    </a>`
}

getLocalizacion()