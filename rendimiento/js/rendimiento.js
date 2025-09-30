// Prueba de rendimiento para 5 algoritmos de ordenamiento
// Ejecuta cada algoritmo sobre la misma lista de datos (8 elementos por defecto)
// Muestra tiempo de ejecución y contador de operaciones (comparaciones + swaps donde aplique)

(function(){
    // Controles de ingreso manual y animación central
    const inputManual = document.getElementById('txtDatos');
    const btnLeft = document.getElementById('leftBtn');
    const btnRight = document.getElementById('rightBtn');
    const btnStart = document.getElementById('startBtn');
    const sliderProgreso = document.getElementById('rangotxt');
    // Estado para animación manual
    let manualSteps = null;
    let manualIndex = 0;
    let manualMax = 0;
    // Elementos del DOM
    const graphic = document.getElementById('graphic-content');
    // Controles del panel lateral
    const sliderDatos = document.getElementById('datostxt');
    const btnAleatorio = document.getElementById('randomBtn');
    const btnDesordenar = document.getElementById('sortBtn');
    const btnParar = document.getElementById('stopBtn');
    // Estado para animación
    let animInterval = null;
    let animSpeed = 200;
    let cantidadDatos = 8;

    // Crear el panel de resultados y controles de animación
    function createResultsPanel(){
        const panel = document.createElement('div');
        panel.id = 'results-panel';
        panel.style.padding = '12px';
        panel.style.marginTop = '12px';
        panel.style.background = '#ffffffcc';
        panel.style.borderRadius = '8px';
        panel.style.boxShadow = '0 6px 18px rgba(0,0,0,0.06)';

        panel.innerHTML = `
            <div style="display:flex;
            gap:8px;
            align-items:center;
            margin-bottom:8px;
            flex-wrap:wrap">
                <span style="margin-left:8px;color:#333">Lista:</span>
                <code id="current-list" style="background:#f5f5f5;
                padding:4px 8px;
                border-radius: 6px;
                margin-left:6px"
                ></code>
            </div>
            <div id="panels-graphics" style="display:flex;
            gap:12px;
            flex-wrap:wrap;
            align-items: center;
            justify-content: center;
            width: 100%"></div>
            <div id="table-area" style="margin-top:12px">
            </div>
        `;
        // Insertar el panel después de la sección de gráficos principal
        //Lo inserta después de los divs de algoritmos
        if (graphic && graphic.parentElement) {
            graphic.parentElement.insertBefore(panel, graphic.nextSibling);
        } else {
            // Fallback: agregar al final del body
            document.body.appendChild(panel);
        }
            const btnClearTable = document.getElementById('clearTableBtn');
            if (btnClearTable) {
                btnClearTable.onclick = function() {
                    // Algoritmos presentes en la tabla
                    const defaultResults = [
                        { name: 'Burbuja', time: 0, comparisons: 0, swaps: 0 },
                        { name: 'Burbuja V2', time: 0, comparisons: 0, swaps: 0 },
                        { name: 'Selección', time: 0, comparisons: 0, swaps: 0 },
                        { name: 'Inserción', time: 0, comparisons: 0, swaps: 0 },
                        { name: 'Quicksort', time: 0, comparisons: 0, swaps: 0 }
                    ];
                    renderTable(defaultResults);
                };
            }
    }

    function renderTable(results){
        const area = document.getElementById('table-area');
        area.innerHTML = '';
        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        table.innerHTML = `
            <thead>
                <tr>
                    <th style="text-align:left;   padding:6px">Algoritmo</th>
                    <th style="text-align:right;  padding:6px">Tiempo (s)</th>
                    <th style="text-align:right;  padding:6px">Comparaciones</th>
                    <th style="text-align:right;  padding:6px">Movimientos</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;
        const tbody = table.querySelector('tbody');
        results.forEach(r => {
            const tr = document.createElement('tr');
            const timeSec = (r.time / 1000).toFixed(2);
            // Estilos para tiempo, comparaciones y swaps
            let timeStyle = "padding:6px; border-top:1px solid #eee; text-align:right;";
            let compStyle = "padding:6px; border-top:1px solid #eee; text-align:right;";
            let swapStyle = "padding:6px; border-top:1px solid #eee; text-align:right;";
            if (r.done) {
                timeStyle += "color: #1bb700; font-weight:bold; background:#eaffea; transition:background 0.3s;";
                compStyle += "color: #1bb700; font-weight:bold; background:#eaffea; transition:background 0.3s;";
                swapStyle += "color: #1bb700; font-weight:bold; background:#eaffea; transition:background 0.3s;";
            }
            tr.innerHTML = `
                <td style="padding:6px; border-top:1px solid #eee  ">${r.name}</td>
                <td style="${timeStyle}">${timeSec}</td>
                <td style="${compStyle}">${r.comparisons}</td>
                <td style="${swapStyle}">${r.swaps}</td>
            `;
            tbody.appendChild(tr);
        });
        area.appendChild(table);
    }

    // Nueva función: actualiza la tabla de métricas con los datos actuales
    function updateMetricsTable() {
        const reps = 30; // Menos repeticiones para responsividad
        const results = algorithms.map(a => {
            let totalTime = 0;
            let totalComparisons = 0;
            let totalSwaps = 0;
            for (let r = 0; r < reps; r++) {
                const arr = current.slice();
                const t0 = performance.now();
                const out = a.gen(arr);
                const t1 = performance.now();
                totalTime += (t1 - t0);
                totalComparisons += out.comparisons;
                totalSwaps += out.swaps;
            }
            return {
                name: a.name,
                time: totalTime / reps,
                comparisons: Math.round(totalComparisons / reps),
                swaps: Math.round(totalSwaps / reps)
            };
        });
        renderTable(results);
    }

    // Generador de lista de 8 datos
    function generarLista8(){
        const arr = [];
        for(let i=0;i<20;i++) arr.push(Math.floor(Math.random()*200)+1);
        return arr;
    }

    // Medición clásica (sin animación) para promedios
    function measure(sortFn, arr){
        const copia = arr.slice();
        const stats = {comparisons:0, swaps:0};
        const t0 = performance.now();
        sortFn(copia, stats);
        const t1 = performance.now();
        return {time: t1 - t0, comparisons: stats.comparisons, swaps: stats.swaps};
    }

    // --- Generadores de steps (snapshots) por algoritmo ---
    // Cada función devuelve {steps: [arrays], comparisons, swaps}
    function bubbleSteps(input){
        const arr = input.slice();
        const steps = [arr.slice()];
        let stats = {comparisons:0, swaps:0};
        const n = arr.length;
        for(let i=0;i<n-1;i++){
            for(let j=0;j<n-1-i;j++){
                stats.comparisons++;
                if(arr[j] > arr[j+1]){
                    [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
                    stats.swaps++;
                    steps.push(arr.slice());
                }
            }
        }
        return {steps, comparisons: stats.comparisons, swaps: stats.swaps};
    }

    function bubbleV2Steps(input){
        const arr = input.slice();
        const steps = [arr.slice()];
        let stats = {comparisons:0, swaps:0};
        let n = arr.length;
        let swapped = true;
        while(swapped){
            swapped = false;
            for(let i=0;i<n-1;i++){
                stats.comparisons++;
                if(arr[i] > arr[i+1]){
                    [arr[i], arr[i+1]] = [arr[i+1], arr[i]];
                    stats.swaps++;
                    swapped = true;
                    steps.push(arr.slice());
                }
            }
            n--;
        }
        return {steps, comparisons: stats.comparisons, swaps: stats.swaps};
    }

    function selectionSteps(input){
        const arr = input.slice();
        const steps = [arr.slice()];
        let stats = {comparisons:0, swaps:0};
        const n = arr.length;
        for(let i=0;i<n-1;i++){
            let minIdx = i;
            for(let j=i+1;j<n;j++){
                stats.comparisons++;
                if(arr[j] < arr[minIdx]) minIdx = j;
            }
            if(minIdx !== i){
                [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
                stats.swaps++;
                steps.push(arr.slice());
            }
        }
        return {steps, comparisons: stats.comparisons, swaps: stats.swaps};
    }

    function insertionSteps(input){
        const arr = input.slice();
        const steps = [arr.slice()];
        let stats = {comparisons:0, swaps:0};
        for(let i=1;i<arr.length;i++){
            let key = arr[i];
            let j = i-1;
            while(j>=0){
                stats.comparisons++;
                if(arr[j] > key){
                    arr[j+1] = arr[j];
                    stats.swaps++;
                    steps.push(arr.slice());
                    j--;
                }else break;
            }
            arr[j+1] = key;
            steps.push(arr.slice());
        }
        return {steps, comparisons: stats.comparisons, swaps: stats.swaps};
    }

    function quicksortSteps(input){
        const arr = input.slice();
        const steps = [arr.slice()];
        let stats = {comparisons:0, swaps:0};
        function qs(a, lo, hi){
            if(lo>=hi) return;
            const p = partition(a, lo, hi);
            qs(a, lo, p-1);
            qs(a, p+1, hi);
        }
        function partition(a, lo, hi){
            const pivot = a[hi];
            let i = lo;
            for(let j=lo;j<hi;j++){
                stats.comparisons++;
                if(a[j] < pivot){
                    [a[i], a[j]] = [a[j], a[i]];
                    stats.swaps++;
                    steps.push(a.slice());
                    i++;
                }
            }
            [a[i], a[hi]] = [a[hi], a[i]];
            stats.swaps++;
            steps.push(a.slice());
            return i;
        }
        qs(arr, 0, arr.length-1);
        return {steps, comparisons: stats.comparisons, swaps: stats.swaps};
    }

    // Map de algoritmos y generadores
    const algorithms = [
        {name: 'Burbuja', gen: bubbleSteps},
        {name: 'Burbuja V2', gen: bubbleV2Steps},
        {name: 'Selección', gen: selectionSteps},
        {name: 'Inserción', gen: insertionSteps},
        {name: 'Quicksort', gen: quicksortSteps}
    ];

    // Render mini gráfica (barras) dentro de un contenedor
    function renderMini(arr, container){
        container.innerHTML = '';
        const max = Math.max(...arr, 1);
        const inner = document.createElement('div');
        inner.style.display = 'flex';
        inner.style.alignItems = 'end';
        inner.style.justifyContent = 'center';
        inner.style.gap = '4px';
        arr.forEach((v, idx) => {
            const bar = document.createElement('div');
            bar.style.width = '18px';
            bar.style.height = `${(v / max) * 120 + 8}px`;
            // Si highlightIdx está definido y coincide, resaltar la barra
            if (typeof highlightIdx === 'number' && idx === highlightIdx) {
                bar.style.background = '#3b82f6'; // azul vibrante
            } else {
                bar.style.background = '#6ee7b7';
            }
            bar.style.borderRadius = '4px 4px 0 0';
            bar.style.display = 'flex';
            bar.style.alignItems = 'flex-end';
            bar.style.justifyContent = 'center';
            bar.style.fontSize = '10px';
            bar.style.color = '#222';
            bar.textContent = v;
            inner.appendChild(bar);
        });
        container.appendChild(inner);
    }

    // Setup UI y paneles por algoritmo
    createResultsPanel();
    const listCode = document.getElementById('current-list');
    const panelsArea = document.getElementById('panels-graphics');

    // Crear paneles individuales
    function buildAlgoPanels(){
        panelsArea.innerHTML = '';
        algorithms.forEach(a=>{
            const wrapper = document.createElement('div');
            wrapper.style.width = 'fit-content';
            wrapper.style.minWidth = '180px';
            wrapper.style.background = '#fff';
            wrapper.style.border = '1px solid #ffffffff';
            wrapper.style.borderRadius = '8px';
            wrapper.style.padding = '8px';
            wrapper.style.boxSizing = 'border-box';
            wrapper.style.display = 'flex';
            wrapper.style.flexDirection = 'column';
            wrapper.style.justifyContent = 'center';
            wrapper.style.alignItems = 'center';

            const title = document.createElement('div');
            title.textContent = a.name;
            title.style.fontWeight = '600';
            title.style.marginBottom = '6px';

            const chart = document.createElement('div');
            chart.className = 'mini-chart';
            chart.style.height = '100%';
            chart.style.display = 'flex';
            chart.style.alignItems = 'end';
            chart.style.justifyContent = 'center';

            wrapper.appendChild(title);
            wrapper.appendChild(chart);

            panelsArea.appendChild(wrapper);
            a._elements = {wrapper, chart};
        });
    }

    let current = generarLista8();
    listCode.textContent = JSON.stringify(current);
    buildAlgoPanels();
    // Render initial previews
    algorithms.forEach(a=> renderMini(current, a._elements.chart));
        // Mostrar la tabla con valores en cero al iniciar
        const defaultResults = [
            { name: 'Burbuja', time: 0, comparisons: 0, swaps: 0 },
            { name: 'Burbuja V2', time: 0, comparisons: 0, swaps: 0 },
            { name: 'Selección', time: 0, comparisons: 0, swaps: 0 },
            { name: 'Inserción', time: 0, comparisons: 0, swaps: 0 },
            { name: 'Quicksort', time: 0, comparisons: 0, swaps: 0 }
        ];
        renderTable(defaultResults);

    // --- Ingreso manual de lista y animación paso a paso ---
    function parseManualInput(val) {
    // Permitir formato: 1,2,3,4 o 1 2 3 4, acepta decimales
    if (!val) return null;
    let arr = val.split(/,|\s+|;/).map(x=>parseFloat(x)).filter(x=>!isNaN(x));
    if (arr.length < 3) return null;
    return arr;
    }

    // Resalta la barra que corresponde al paso actual (manualIndex)
    function updateManualStep(idx) {
        if (!manualSteps) return;
        manualIndex = Math.max(0, Math.min(idx, manualMax));
        algorithms.forEach((a,i)=>{
            if (manualSteps[i] && manualSteps[i][manualIndex]) {
                // Determinar el índice de la barra a resaltar (puedes ajustar la lógica según el algoritmo)
                let highlightIdx = null;
                if (manualSteps[i][manualIndex]._highlight !== undefined) {
                    highlightIdx = manualSteps[i][manualIndex]._highlight;
                } else if (manualIndex < manualSteps[i][manualIndex].length) {
                    highlightIdx = manualIndex;
                }
                renderMini(manualSteps[i][manualIndex], a._elements.chart, highlightIdx);
            }
        });
        if (sliderProgreso) sliderProgreso.value = manualIndex;
    }

    if (btnStart && inputManual) {
        btnStart.addEventListener('click', function() {
            // Inicializar barra de progreso sincronizada desde el inicio
            const progressBar = document.getElementById('progressBar');
            if (progressBar) {
                progressBar.style.width = '0%';
                progressBar.classList.add('progreso-activo');
            }
            let arr = parseManualInput(inputManual.value);
            if (!arr) arr = Array.isArray(current) ? current.slice() : [];
            if (!arr || arr.length < 3) return alert('Ingrese al menos 3 números separados por coma, espacio o punto y coma, o use la lista por defecto.');
            current = arr;
            listCode.textContent = JSON.stringify(current);
            buildAlgoPanels();
            // Generar steps y guardar comparaciones y swaps para cada algoritmo
            const manualResults = algorithms.map(a=>a.gen(current));
            manualSteps = manualResults.map(r=>r.steps);
            manualMax = Math.max(...manualSteps.map(s=>s.length-1));
            manualIndex = 0;
            // Inicializar tiempos y estados, y preparar contadores en tiempo real
            algorithms.forEach((a, i)=>{
                a._manualStart = null;
                a._manualTime = 0;
                a._manualDone = false;
                a._comparisonsTotal = manualResults[i].comparisons;
                a._swapsTotal = manualResults[i].swaps;
                // Inicializar contadores en tiempo real
                a._comparisons = 0;
                a._swaps = 0;
            });
            if (sliderProgreso) {
                sliderProgreso.max = manualMax;
                sliderProgreso.value = 0;
                sliderProgreso.classList.add('progreso-activo');
            }
            updateManualStep(0);
            // Iniciar animación automática de progreso y contador de tiempo
            if (animInterval) clearInterval(animInterval);
            if (btnParar) btnParar.disabled = false;
            // Inicializar tabla con tiempos en cero
            renderTable(algorithms.map(a=>({
                name: a.name,
                time: 0,
                comparisons: 0,
                swaps: 0
            })));
            const startTimes = new Map();
            algorithms.forEach(a=> startTimes.set(a.name, performance.now()));
            animInterval = setInterval(() => {
                let now = performance.now();
                let allDone = true;
                algorithms.forEach((a,i)=>{
                    if(a._manualDone) return;
                    allDone = false;
                    if(a._manualStart === null) a._manualStart = startTimes.get(a.name);
                    // Calcular comparaciones y swaps en tiempo real según el paso actual
                    let stepsLen = manualSteps[i].length;
                    let percent = manualIndex / (stepsLen-1);
                    a._comparisons = Math.round(a._comparisonsTotal * percent);
                    a._swaps = Math.round(a._swapsTotal * percent);
                    if(manualIndex >= stepsLen-1){
                        if(!a._manualDone){
                            a._manualTime = now - a._manualStart;
                            a._manualDone = true;
                            a._comparisons = a._comparisonsTotal;
                            a._swaps = a._swapsTotal;
                        }
                    } else {
                        a._manualTime = now - a._manualStart;
                    }
                });
                // Actualizar barra de progreso visual sincronizada
                const progressBar = document.getElementById('progressBar');
                if (progressBar && manualMax > 0) {
                    const percent = (manualIndex / manualMax) * 100;
                    progressBar.style.width = percent + '%';
                }
                // Actualizar tabla con los tiempos y contadores actuales
                renderTable(algorithms.map((a,i)=>({
                    name: a.name,
                    time: a._manualDone ? a._manualTime : (a._manualStart ? now - a._manualStart : 0),
                    comparisons: a._comparisons,
                    swaps: a._swaps,
                    done: !!a._manualDone
                })));
                if (manualIndex < manualMax) {
                    updateManualStep(manualIndex + 1);
                } else {
                    clearInterval(animInterval);
                    animInterval = null;
                    if (btnParar) btnParar.disabled = true;
                    if (sliderProgreso) sliderProgreso.classList.remove('progreso-activo');
                }
            //Cada segundo hará una iteración (tiempo de conteo en segundos)
            }, 1000);
        });
    }

    if (btnLeft) {
        btnLeft.addEventListener('click', function() {
            updateManualStep(manualIndex-1);
        });
    }
    if (btnRight) {
        btnRight.addEventListener('click', function() {
            updateManualStep(manualIndex+1);
        });
    }
    if (sliderProgreso) {
        sliderProgreso.addEventListener('input', function() {
            updateManualStep(parseInt(sliderProgreso.value));
        });
    }

    // --- Panel lateral: cantidad de datos ---
    if (sliderDatos) {
        sliderDatos.addEventListener('input', function() {
            cantidadDatos = parseInt(sliderDatos.value) || 8;
            // Generar nueva lista con la cantidad seleccionada
            current = Array.from({length: cantidadDatos}, () => Math.floor(Math.random()*200)+1);
            listCode.textContent = JSON.stringify(current);
            buildAlgoPanels();
            algorithms.forEach(a=> renderMini(current, a._elements.chart));
            updateMetricsTable();
        });
    }


    // --- Panel lateral: Aleatorio ---
    if (btnAleatorio) {
        btnAleatorio.addEventListener('click', function() {
            current = Array.from({length: cantidadDatos}, () => Math.floor(Math.random()*200)+1);
            listCode.textContent = JSON.stringify(current);
            buildAlgoPanels();
            algorithms.forEach(a=> renderMini(current, a._elements.chart));
              // No actualizar la tabla aquí
        });
    }

    // --- Panel lateral: Desordenar (genera permutación aleatoria de la lista actual) ---
    if (btnDesordenar) {
        btnDesordenar.addEventListener('click', function() {
            // Mezclar la lista actual
            for (let i = current.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [current[i], current[j]] = [current[j], current[i]];
            }
            listCode.textContent = JSON.stringify(current);
            buildAlgoPanels();
            algorithms.forEach(a=> renderMini(current, a._elements.chart));
                // No actualizar la tabla aquí
        });
    }

    // --- Panel lateral: Parar animación ---
    if (btnParar) {
        btnParar.addEventListener('click', function() {
            if (animInterval) {
                clearInterval(animInterval);
                animInterval = null;
                btnParar.disabled = true;
            }
        });
    }

    // Medir promedios desde el botón del cuadro de configuraciones
    // El botón de benchmark config ya no actualiza la tabla, solo la función automática lo hace

    
    // Medir promedios (tabla)
    // El botón de medir promedios ya no actualiza la tabla, solo la función automática lo hace

    // Animación simultánea: generar steps para cada algoritmo y animar en paralelo
    
})();
