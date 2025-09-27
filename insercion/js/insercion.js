// Elementos
const randomBtn = document.getElementById('randomBtn');
const sortBtn = document.getElementById('sortBtn');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const velotxt = document.getElementById('velotxt');
const datostxt = document.getElementById('datostxt');
const graphicContent = document.getElementById('graphic-content');
const txtDatos = document.getElementById('txtDatos');
const tiempoText = document.getElementById('tiempoText');

let datos = [];
let sorting = false;
let velocidad = 50;
let cantidad = 12;
let tiempo = 0;
let ultimoIngresado = null; // Para resaltar el último número ingresado
let progresoBarra = null;

// Inicializar datos
function generarDatosAleatorios() {
    datos = Array.from({length: cantidad}, () => Math.floor(Math.random() * 200 - 100));
    renderDatos();
}
function desactBtn(boolean){
    stopBtn.disabled = !boolean;
    randomBtn.disabled = boolean;
    startBtn.disabled = boolean;
    sortBtn.disabled = boolean;
    txtDatos.disabled  = boolean;
}
function renderDatos(highlight = -1, insertIdx = -1) {
    graphicContent.innerHTML = '';
    const maxAbs = Math.max(...datos.map(n => Math.abs(n)), 100);
    datos.forEach((num, idx) => {
        // Contenedor de palito
        const stickContainer = document.createElement('div');
        stickContainer.style.display = 'inline-flex';
        stickContainer.style.flexDirection = 'column';
        stickContainer.style.alignItems = 'center';
        stickContainer.style.width = '24px';
        stickContainer.style.margin = '0 8px';

        // Palito
        const stick = document.createElement('div');
        stick.style.width = '8px';
        stick.style.height = `${Math.abs(num) * 120 / maxAbs + 30}px`;
        // Resaltado especial si es el último ingresado
        if (idx === highlight) {
            stick.style.background = '#ff9800';
        } else if (idx === insertIdx) {
            stick.style.background = '#43a047';
        } else if (ultimoIngresado !== null && idx === datos.length - 1 && num === ultimoIngresado) {
            stick.style.background = '#e91e63'; // Color especial para el último ingresado
        } else {
            stick.style.background = '#1976d2';
        }
        stick.style.borderRadius = '4px';
        stick.style.boxShadow = '0 2px 8px rgba(0,0,0,0.10)';
        stick.style.marginBottom = '6px';
        stickContainer.appendChild(stick);

        // Número en la base
        const label = document.createElement('span');
        label.textContent = num;
        if (idx === highlight) {
            label.style.color = '#ff9800';
        } else if (idx === insertIdx) {
            label.style.color = '#43a047';
        } else if (ultimoIngresado !== null && idx === datos.length - 1 && num === ultimoIngresado) {
            label.style.color = '#e91e63';
        } else {
            label.style.color = '#1976d2';
        }
        label.style.fontWeight = 'bold';
        label.style.fontSize = '13px';
        stickContainer.appendChild(label);

        graphicContent.appendChild(stickContainer);
    });

    // Actualizar barra de progreso si existe
    if (progresoBarra) {
        progresoBarra.style.width = `${progresoBarra.value || 0}%`;
    }
}

// Insertion Sort animado
async function insercionSortAnimado() {
    sorting = true;
    desactBtn(true);
    tiempo = 0;
    // Obtener barra de progreso
    if (!progresoBarra) {
        progresoBarra = document.querySelector('.progressBar');
    }
    if (progresoBarra) {
        progresoBarra.style.width = '0%';
        progresoBarra.value = 0;
    }
    for (let i = 1; i < datos.length && sorting; i++) {
        let key = datos[i];
        let j = i - 1;
        // Actualizar barra de progreso
        if (progresoBarra) {
            let porcentaje = Math.round((i / (datos.length - 1)) * 100);
            progresoBarra.style.width = porcentaje + '%';
            progresoBarra.value = porcentaje;
        }
        renderDatos(i, j);
        await sleep(velocidad);
        while (j >= 0 && datos[j] > key && sorting) {
            datos[j + 1] = datos[j];
            renderDatos(i, j);
            await sleep(velocidad);
            j = j - 1;
        }
        datos[j + 1] = key;
        tiempo += 1;
        tiempoText.textContent = `${tiempo} segundos`;
        renderDatos(i, j + 1);
        await sleep(velocidad);
    }
    // Barra al 100% al finalizar
    if (progresoBarra) {
        progresoBarra.style.width = '100%';
        progresoBarra.value = 100;
    }
    sorting = false;
    desactBtn(false);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Eventos
randomBtn.onclick = () => {
    generarDatosAleatorios();
};

sortBtn.onclick = () => {
    datos = [...datos].sort(() => Math.random() - 0.5);
    renderDatos();
};

startBtn.onclick = () => {
    if (!sorting) {
        insercionSortAnimado();
        
    };
};

stopBtn.onclick = () => {
    sorting = false;
    stopBtn.disabled = true;
    startBtn.disabled = false;
};

velotxt.oninput = (e) => {
    // Ahora el rango será de 100ms (rápido) a 1000ms (lento)
    velocidad = 1000 - parseInt(e.target.value, 10) * 6;
    if (velocidad < 100) velocidad = 100;
};

datostxt.oninput = (e) => {
    cantidad = parseInt(e.target.value, 10);
    generarDatosAleatorios();
};

txtDatos.onchange = (e) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
        if (datos.length < cantidad) {
            datos.push(val);
        } else {
            datos[datos.length - 1] = val;
        }
        ultimoIngresado = val;
        renderDatos();
        txtDatos.value = '';
    }
};

// Inicializar
window.onload = () => {
    generarDatosAleatorios();
    tiempoText.textContent = '0 segundos';
    progresoBarra = document.querySelector('.progressBar');
    if (progresoBarra) {
        progresoBarra.style.width = '0%';
        progresoBarra.value = 0;
    }
};