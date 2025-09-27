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
let interval = null;
let sorting = false;
let velocidad = 50;
let cantidad = 12;
let tiempo = 0;
let ultimoIngresado = null; // Para resaltar el último número ingresado
let progresoBarra = null;
function desactBtn(boolean){
    stopBtn.disabled = !boolean;
    randomBtn.disabled = boolean;
    startBtn.disabled = boolean;
    sortBtn.disabled = boolean;
    txtDatos.disabled  = boolean;
}
// Inicializar datos
function generarDatosAleatorios() {
    datos = Array.from({length: cantidad}, () => Math.floor(Math.random() * 200 - 100));
    renderDatos();
}

function renderDatos(highlight = -1, minIdx = -1) {
    graphicContent.innerHTML = '';
    const maxAbs = Math.max(...datos.map(n => Math.abs(n)), 100);
    datos.forEach((num, idx) => {
        // Contenedor para barra y número
        const barContainer = document.createElement('div');
        barContainer.style.display = 'inline-block';
        barContainer.style.width = '30px';
        barContainer.style.margin = '0 4px';
        barContainer.style.verticalAlign = 'bottom';
        barContainer.style.textAlign = 'center';
        barContainer.style.position = 'relative';

        // Etiqueta del número (encima de la barra)
        const label = document.createElement('span');
        label.textContent = num;
        label.style.display = 'block';
        label.style.marginBottom = '4px';
        label.style.fontWeight = 'bold';
        label.style.color = idx === highlight ? '#b59f00' : (idx === minIdx ? '#33691e' : '#333');
        barContainer.appendChild(label);

        // Barra
        const bar = document.createElement('div');
        bar.style.height = `${Math.abs(num) * 120 / maxAbs + 30}px`;
        bar.style.background = idx === highlight ? '#ffeb3b' : (idx === minIdx ? '#8bc34a' : '#2196f3');
        bar.style.border = '2px solid #333';
        bar.style.borderRadius = '6px 6px 0 0';
        bar.style.transition = 'height 0.3s, background 0.3s';
        barContainer.appendChild(bar);

        graphicContent.appendChild(barContainer);
    });
    // Actualizar barra de progreso si existe
    if (progresoBarra) {
        progresoBarra.style.width = `${progresoBarra.value || 0}%`;
    }
}

// Selection Sort animado
async function selectionSortAnimado() {
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
    for (let i = 0; i < datos.length - 1 && sorting; i++) {
        let minIdx = i;
                // Actualizar barra de progreso
        if (progresoBarra) {
            let porcentaje = Math.round((i / (datos.length - 1)) * 100);
            progresoBarra.style.width = porcentaje + '%';
            progresoBarra.value = porcentaje;
        }
        renderDatos(i, minIdx);
        await sleep(velocidad);
        for (let j = i + 1; j < datos.length && sorting; j++) {
            renderDatos(j, minIdx);
            await sleep(velocidad);
            if (datos[j] < datos[minIdx]) {
                minIdx = j;
                renderDatos(j, minIdx);
                await sleep(velocidad);
            }
        }
        if (minIdx !== i) {
            [datos[i], datos[minIdx]] = [datos[minIdx], datos[i]];
            tiempo += 1;
            tiempoText.textContent = `${tiempo} segundos`;
        }
        renderDatos(i, minIdx);
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
    if (!sorting) selectionSortAnimado();
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

//Inicializar
window.onload = () => {
    generarDatosAleatorios();
    tiempoText.textContent = '0 segundos';
        progresoBarra = document.querySelector('.progressBar');
    if (progresoBarra) {
        progresoBarra.style.width = '0%';
        progresoBarra.value = 0;
    }
};