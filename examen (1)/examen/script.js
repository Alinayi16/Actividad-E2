const API_URL = 'http://srv55237340.ultasrv.net/api/datapersonal';
let currentPage = 1;
let totalCount = 0;
let allData = []; // Para almacenar todos los datos obtenidos de la página actual

// Función para mostrar el loader
function showLoader() {
    document.getElementById('loader').style.display = 'block';
}

// Función para ocultar el loader
function hideLoader() {
    document.getElementById('loader').style.display = 'none';
}

// Función para crear una carta de datos
function crearCarta(persona) {
    const col = document.createElement('div');
    col.className = 'col-md-4 mb-3';
    col.innerHTML = `
        <div class="card">
            <img src="${persona.photo || 'https://via.placeholder.com/150'}" class="card-img-top" alt="${persona.nombre} ${persona.apellido}" onerror="this.onerror=null; this.src='https://via.placeholder.com/150';">
            <div class="card-body">
                <h5 class="card-title">${persona.nombre} ${persona.apellido}</h5>
                <p class="card-text">Edad: ${persona.edad}</p>
                <p class="card-text">Email: ${persona.email}</p>
                <p class="card-text">Teléfono: ${persona.telefono}</p>
                <p class="card-text">Dirección: ${persona.direccion}</p>
                <p class="card-text">Ciudad: ${persona.ciudad}</p>
                <p class="card-text">País: ${persona.pais}</p>
                <p class="card-text">Fecha de nacimiento: ${new Date(persona.fecha).toLocaleDateString()}</p>
            </div>
        </div>
    `;
    return col;
}

// Función para obtener los datos de la API y mostrarlos en las cartas
async function obtenerDatos(page = currentPage) {
    showLoader();
    try {
        const response = await fetch(`${API_URL}?page=${page}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();

        // Verificación de la estructura de los datos
        if (!data.results || !data.totalCount) throw new Error('Estructura de datos inesperada');

        totalCount = data.totalCount;
        allData = data.results; // Guardar los datos obtenidos de la página actual

        updatePaginationButtons();
        mostrarDatos(allData);
    } catch (error) {
        console.error('Error al obtener los datos:', error);
        alert('Error al obtener los datos. Intente de nuevo más tarde.');
    } finally {
        hideLoader();
    }
}

// Función para mostrar datos en las cartas
function mostrarDatos(data) {
    const cardsContainer = document.getElementById('cards-container');
    cardsContainer.innerHTML = ''; // Limpiar datos anteriores

    if (data.length === 0) {
        document.getElementById('no-data').style.display = 'block'; // Mostrar mensaje de no datos
    } else {
        document.getElementById('no-data').style.display = 'none'; // Ocultar mensaje de no datos
        data.forEach((persona, index) => {
            const card = crearCarta(persona);
            cardsContainer.appendChild(card);
            
            // Añadir la animación de entrada
            card.style.opacity = 0; // Inicialmente invisible
            setTimeout(() => {
                card.style.transition = 'opacity 0.5s ease';
                card.style.opacity = 1; // Hacer visible la tarjeta
            }, 100 * index); // Cada tarjeta se mostrará con un ligero retraso

            // Añadir un evento de hover para animación
            card.addEventListener('mouseover', () => {
                card.style.transform = 'scale(1.05)';
                card.style.transition = 'transform 0.3s ease';
            });
            card.addEventListener('mouseout', () => {
                card.style.transform = 'scale(1)';
            });
        });
    }
}

// Función para actualizar los botones de paginación
function updatePaginationButtons() {
    const prevButton = document.getElementById('pagination-prev');
    const nextButton = document.getElementById('pagination-next');

    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage >= Math.ceil(totalCount / 10) || totalCount === 0; // Mejora: corrección del cálculo
}

// Función para filtrar los datos
function filtrarDatos() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const filteredData = allData.filter(persona =>
        persona._id.toString().includes(searchInput) ||
        persona.nombre.toLowerCase().includes(searchInput)
    );
    mostrarDatos(filteredData);
}

// Eventos para los botones de paginación
document.getElementById('pagination-prev').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        obtenerDatos(currentPage);
    }
});

document.getElementById('pagination-next').addEventListener('click', () => {
    currentPage++;
    obtenerDatos(currentPage);
});

// Evento para el botón de búsqueda
document.getElementById('search-button').addEventListener('click', filtrarDatos);
document.getElementById('search-input').addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        filtrarDatos(); // Permitir búsqueda al presionar Enter
    }
});

// Llama a la función al cargar la página
obtenerDatos();
