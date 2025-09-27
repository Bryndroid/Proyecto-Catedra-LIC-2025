// Algoritmo de Burbuja Bidireccional (Cocktail Shaker Sort) y lógica de UI

document.addEventListener('DOMContentLoaded', () => {
    // Elementos
    const graphic = document.getElementById('graphic-content');
    const randomBtn = document.getElementById('randomBtn');
    const sortBtn = document.getElementById('sortBtn');
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.querySelector("#stopBtn")
    const veloSlider = document.getElementById('velotxt');
    const datosSlider = document.getElementById('datostxt');
    const inputValor = document.querySelector('.input-content input');
    const progress = document.getElementById('rangotxt');

    let datos = [];
    let velocidad = 50;
    let cantidad = 10;
    let sorting = false;
    let interval = null;
    let pasos = [];
    let pasoActual = 0;

    // Generar datos aleatorios
    function generarDatos(n) {
        datos = Array.from({length: n}, () => Math.floor(Math.random() * 100) + 1);
        renderDatos();
    }

    // Renderizar barras
    function renderDatos(resaltados = []) {
        graphic.innerHTML = '';
        const max = Math.max(...datos, 100);
        datos.forEach((val, idx) => {
            const bar = document.createElement('div');
            bar.style.height = `${(val / max) * 180 + 30}px`;
            bar.style.width = '32px';
            bar.style.margin = '0 6px';
            bar.style.background = resaltados.includes(idx) ? '#4f8cff' : '#6ee7b7';
            bar.style.borderRadius = '8px 8px 0 0';
            bar.style.display = 'flex';
            bar.style.alignItems = 'flex-end';
            bar.style.justifyContent = 'center';
            bar.style.fontWeight = 'bold';
            bar.style.color = '#222';
            bar.textContent = val;
            graphic.appendChild(bar);
        });
    }

    // Desordenar
    sortBtn.onclick = () => {
        datos = datos.sort(() => Math.random() - 0.5);
        renderDatos();
    };

    // Aleatorio
    randomBtn.onclick = () => {
        generarDatos(cantidad);
    };

    // Cambiar velocidad
    veloSlider.oninput = (e) => {
        velocidad = 101 - parseInt(e.target.value);
    };

    // Cambiar cantidad
    datosSlider.oninput = (e) => {
        cantidad = parseInt(e.target.value);
        generarDatos(cantidad);
    };

    // Agregar valor manual
    inputValor.addEventListener('change', () => {
        const val = parseInt(inputValor.value);
        if (!isNaN(val)) {
            datos.push(val);
            renderDatos();
        }
        inputValor.value = '';
    });

    // Algoritmo Cocktail Shaker Sort (paso a paso)
    function generarPasos(arr) {
        let pasos = [];
        let a = arr.slice();
        let left = 0, right = a.length - 1;
        let swapped = true;
        while (swapped) {
            swapped = false;
            for (let i = left; i < right; i++) {
                pasos.push({arr: a.slice(), resaltados: [i, i+1]});
                if (a[i] > a[i+1]) {
                    [a[i], a[i+1]] = [a[i+1], a[i]];
                    swapped = true;
                }
            }
            right--;
            for (let i = right; i > left; i--) {
                pasos.push({arr: a.slice(), resaltados: [i, i-1]});
                if (a[i] < a[i-1]) {
                    [a[i], a[i-1]] = [a[i-1], a[i]];
                    swapped = true;
                }
            }
            left++;
        }
        pasos.push({arr: a.slice(), resaltados: []});
        return pasos;
    }

    // Iniciar animación
    startBtn.onclick = () => {
        if (sorting) return;
        desactBtn(true);
        pasos = generarPasos(datos);
        pasoActual = 0;
        sorting = true;
        progress.max = pasos.length - 1;
        avanzarPaso();
      
    };
    function desactBtn(boolean){
        stopBtn.disabled = !boolean;
        randomBtn.disabled = boolean;
        sortBtn.disabled = boolean;
        inputValor.disabled  = boolean;
    }
    function avanzarPaso() {
        if (!sorting || pasoActual >= pasos.length) {
            sorting = false;
            return;
        }
        const paso = pasos[pasoActual];
        datos = paso.arr.slice();
        renderDatos(paso.resaltados);
        progress.value = pasoActual;
        pasoActual++;
        interval = setTimeout(avanzarPaso, velocidad * 5 + 20);
        if (pasoActual >= pasos.length){
            sorting = false;
            desactBtn(false);
        };
    }

    // Slider de progreso manual
    progress.oninput = (e) => {
        if (!pasos.length) return;
        pasoActual = parseInt(e.target.value);
        const paso = pasos[pasoActual];
        datos = paso.arr.slice();
        renderDatos(paso.resaltados);
    };

    // Inicializar
    generarDatos(cantidad);
});
