const apiUrl = 'http://srv55237340.ultasrv.net/api/datapersonal/';
let currentPage = 1;
let searchTerm = '';
let searching = false;
let filteredData = [];
const itemsPerPage = 6;

// Función para obtener datos de la API
const fetchData = async (url) => {
    const { results } = await getData(url);
    displayResults(results);
    renderPagination(); // Llama a la función de paginación después de obtener datos
};

// Función para mostrar resultados
function displayResults(results) {
    const resultCards = document.getElementById('resultCards');
    resultCards.innerHTML = ''; // Limpia los resultados anteriores

    if (results.length === 0) {
        resultCards.innerHTML = '<p>No se encontraron resultados.</p>';
        return;
    }

    // Limitar los resultados a los elementos de la página actual
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedResults = results.slice(start, end);

    paginatedResults.forEach(person => {
        const card = `
          <div class="col-md-4">
            <div class="card h-100">
              <img src="${person.photo}" class="card-img-top" alt="Foto de ${person.nombre}">
              <div class="card-body">
                <h5 class="card-title">ID: ${person._id}</h5>
                <p class="card-text"><strong>Nombre:</strong> ${person.nombre}</p>
                <p class="card-text"><strong>Apellido:</strong> ${person.apellido}</p>
                <p class="card-text"><strong>Edad:</strong> ${person.edad}</p>
                <p class="card-text"><strong>Email:</strong> ${person.email}</p>
                <p class="card-text"><strong>Teléfono:</strong> ${person.telefono}</p>
                <p class="card-text"><strong>Dirección:</strong> ${person.direccion}</p>
                <p class="card-text"><strong>Ciudad:</strong> ${person.ciudad}</p>
                <p class="card-text"><strong>País:</strong> ${person.pais}</p>
                <p class="card-text"><strong>Fecha:</strong> ${person.fecha}</p>
              </div>
            </div>
          </div>
        `;
        resultCards.innerHTML += card;
    });
}

// Función para obtener datos de la API
const getData = async (url) => {
    const tarerdat = await fetch(url)
    const trasrjs = await tarerdat.json()
    return trasrjs;
};

// Función para buscar una persona por nombre
const buscarNombre = async (nombre, url) => {
    const datosPersonas = await getData(url);
    return datosPersonas.results.find(personas => personas.nombre.toLowerCase() === nombre.toLowerCase());
};

// Función para buscar una persona por ID
const sacarIDCard = async (id) => {
    let urlID = apiUrl; // Corregido para usar apiUrl
    let personaBuscada = null;
    let paginacion = 1;
    while (urlID) {
        const guardarR = await getData(urlID);
        const resultadoBusqueda = guardarR.results.find(persona => persona._id === id);
        if (resultadoBusqueda) {
            personaBuscada = resultadoBusqueda;
            break;
        } else {
            paginacion++;
            urlID = `${apiUrl}?page=${paginacion}`; // Corregido para usar apiUrl
        }
    }
    return personaBuscada;
};

// Evento para buscar al hacer clic en el botón
document.getElementById('boton').addEventListener('click', async function (event) {
    event.preventDefault(); // Prevenir el comportamiento por defecto (submit del formulario)
    
    let nombre = document.getElementById('searchInput').value;
    if (nombre) {
        console.log(nombre);
        let primeraLetra = nombre.charAt(0);

        if (/^[a-zA-Z]/.test(primeraLetra)) {
            console.log(`Primera letra es: ${primeraLetra}`);
            let personasEncontradas = null;
            let paginacion = 1;
            let urlN = `${apiUrl}?page=${paginacion}`;
            while (urlN) {
                console.log(`Buscando en la página: ${paginacion}, URL: ${urlN}`);
                const resultado = await buscarNombre(nombre, urlN);
                console.log(`Resultados obtenidos en la página ${paginacion}:`, resultado);
                if (resultado) {
                    personasEncontradas = resultado;
                    break;
                } else {
                    paginacion++;
                    urlN = `${apiUrl}?page=${paginacion}`;
                }
            }

            console.log(`Personas encontradas final:`, personasEncontradas);
            document.getElementById('resultCards').innerHTML = ""; // Asegúrate de usar getElementById

            if (personasEncontradas) {
                displayResults([personasEncontradas]); // Cambiado para enviar un array
                return;
            } else {
                alert('No se encontró ninguna persona con ese nombre.');
            }
        }

        // Manejo de búsqueda por ID
        if (/^\d+$/.test(primeraLetra)) {
            const personaEncontrada = await sacarIDCard(nombre);
            document.getElementById('resultCards').innerHTML = ""; // Asegúrate de usar getElementById
            if (personaEncontrada) {
                displayResults([personaEncontrada]); // Cambiado para enviar un array
                return;
            } else {
                alert('No se encontró ninguna persona con ese ID.');
                return;
            }
        }
    } else {
        alert('La caja está vacía');
    }
});

// Función para renderizar la paginación
const renderPagination = async () => {
    const datos = await getData(apiUrl); // Obtener todos los datos para el cálculo de páginas
    filteredData = datos.results; // Poblamos filteredData
    const pagination = document.querySelector('.pagination');
    pagination.innerHTML = ''; // Limpiamos la paginación

    const totalPages = Math.ceil(filteredData.length / itemsPerPage); // Calculamos el total de páginas

    for (let i = 1; i <= totalPages; i++) {
        const activeClass = i === currentPage ? 'active' : ''; // Clase activa para la página actual
        const pageItem = `
        <li class="page-item ${activeClass}">
          <a class="page-link" href="#" data-page="${i}">${i}</a>
        </li>
      `;
        pagination.insertAdjacentHTML('beforeend', pageItem); // Añadimos elemento de página
    }

    document.querySelectorAll('.page-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            currentPage = parseInt(e.target.dataset.page); 
            fetchData(`${apiUrl}?page=${currentPage}`); // Usar apiUrl
        });
    });
};

// Cargar datos de la primera página al iniciar
fetchData(apiUrl);


