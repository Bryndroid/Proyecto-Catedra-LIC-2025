// Verifica si el arreglo está ordenado
function estaOrdenado(arr) {
	for (let i = 1; i < arr.length; i++) {
		if (arr[i-1] > arr[i]) return false;
	}
	return true;
}
// --- Contar todos los movimientos visuales antes de animar ---
function contarMovimientosVisualesQuick(arr) {
	let count = 0;
	function quicksort(arr, left, right, isFirst = false) {
		if (left >= right) return;
		if (isFirst) {
			count++; // Movimiento visual del pivote inicial
			let mid = Math.floor((left + right) / 2);
			[arr[right], arr[mid]] = [arr[mid], arr[right]];
			partition(arr, left, right, true, mid);
		} else {
			partition(arr, left, right);
		}
	}
	function partition(arr, left, right, isFirstPivot = false, mid = null) {
		let pivot = arr[right];
		let i = left;
		let tempArr = arr.slice(left, right);
		let menores = [];
		let mayores = [];
		for (let j = 0; j < tempArr.length; j++) {
			let idx = left + j;
			// No hay ordenados en el conteo previo
			if (arr[idx] < pivot) {
				menores.push(arr[idx]);
				count++; // Movimiento visual de partición
				i++;
			} else {
				mayores.push(arr[idx]);
				count++; // Movimiento visual de partición
			}
		}
		let k = left;
		for (let v of menores) arr[k++] = v;
		let pivotIdx = k;
		arr[k++] = pivot;
		for (let v of mayores) arr[k++] = v;
		count++; // Movimiento visual del pivote final
		quicksort(arr, left, pivotIdx - 1);
		quicksort(arr, pivotIdx + 1, right);
	}
	let copia = [...arr];
	quicksort(copia, 0, copia.length - 1, true);
	return count;
}
//ARRAY CONTENEDOR
let numerosQuick = Array.from({length: 12}, () => Math.floor(Math.random() * 250) + 1);
//LIENZO
let main = document.getElementById("graphic-content");
//VARIABLES DE CONTROL
let velocidadCustom = 0;
let pausado = false;
let pivotes = [];
let continuar;
let totalIteraciones = 0;
let iteracion = 0;
let quickIterCount = 0; // Lleva el conteo real de iteraciones para la barra de progreso
let tiempoAnimacion = 0;
let tiempoSecond = 0;
let idTimeo3;
let relevoTiempo = 0;
let estados = [];
let snapShots = 0;
let enAnimacion = false;

//---------------------------- QUICKSORT --------------------------//

// Precomputar todos los estados (snapshots) del quicksort para navegación
function precomputarQuick() {
	estados = [];
	let copia = [...numerosQuick];
	function quicksort(arr, left, right) {
		if (left < right) {
			let pivotIndex = partition(arr, left, right);
			estados.push([...arr]);
			quicksort(arr, left, pivotIndex - 1);
			quicksort(arr, pivotIndex + 1, right);
		}
	}
	function partition(arr, left, right) {
		let pivot = arr[right];
		let i = left - 1;
		for (let j = left; j < right; j++) {
			if (arr[j] < pivot) {
				i++;
				[arr[i], arr[j]] = [arr[j], arr[i]];
			}
		}
		[arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
		return i + 1;
	}
	estados.push([...copia]);
	quicksort(copia, 0, copia.length - 1);
	snapShots = estados.length;
}

function contarIteracionesQuick(arr) {
	let count = 0;
	function quicksort(arr, left, right) {
		if (left < right) {
			let pivotIndex = partition(arr, left, right);
			count++;
			quicksort(arr, left, pivotIndex - 1);
			quicksort(arr, pivotIndex + 1, right);
		}
	}
	function partition(arr, left, right) {
		let pivot = arr[right];
		let i = left - 1;
		for (let j = left; j < right; j++) {
			if (arr[j] < pivot) {
				i++;
				[arr[i], arr[j]] = [arr[j], arr[i]];
			}
		}
		[arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
		return i + 1;
	}
	let copia = [...arr];
	quicksort(copia, 0, copia.length - 1);
	return count;
}



async function quickSortAnim(arr, left, right, isFirst = false) {
	if (left >= right) {
		// Marcar como ordenados los elementos en este rango
		for (let i = left; i <= right; i++) {
			ordenados[i] = true;
		}
		return;
	}
	let pivotIndex;
	if (isFirst) {
		let mid = Math.floor((left + right) / 2);
		verQuickPivotMove(right, mid, arr, left, right);
		await esperar(700 + velocidadCustom);
		quickIterCount++;
		progressBar(quickIterCount); // Movimiento visual del pivote inicial
		[arr[right], arr[mid]] = [arr[mid], arr[right]];
		pivotIndex = await partitionAnim(arr, left, right, true, mid);
	} else {
		pivotIndex = await partitionAnim(arr, left, right);
	}
	// Marcar pivote como ordenado
	ordenados[pivotIndex] = true;
	await quickSortAnim(arr, left, pivotIndex - 1);
	await quickSortAnim(arr, pivotIndex + 1, right);
}

async function partitionAnim(arr, left, right, isFirstPivot = false, mid = null) {
	let pivot = arr[right];
	let i = left;
	let tempArr = arr.slice(left, right); // Copia de la sublista a particionar (sin el pivote)
	let menores = [];
	let mayores = [];

	// Animar la selección del pivote: solo el pivote actual (right) es naranja
	verQuickPivot(right, right, null, arr, right, false, null, false, false);
	await esperar(500 + velocidadCustom);

	// Animar el proceso de partición: mover uno a uno
	for (let j = 0; j < tempArr.length; j++) {
		let idx = left + j;
		// Si el elemento ya está ordenado, no lo muevas
		if (ordenados[idx]) continue;
		if (arr[idx] < pivot) {
			menores.push(arr[idx]);
			// Animar movimiento a la izquierda
			verQuickPartitionMove(arr, idx, i, right, isFirstPivot, mid, 'izq');
			await esperar(600 + velocidadCustom);
			i++;
		} else {
			mayores.push(arr[idx]);
			// Animar movimiento a la derecha
			verQuickPartitionMove(arr, idx, right - (mayores.length - 1), right, isFirstPivot, mid, 'der');
			await esperar(600 + velocidadCustom);
		}
		quickIterCount++;
		progressBar(quickIterCount); // Sincroniza la barra con los movimientos reales
	}

	// Reconstruir el arreglo con los menores, pivote, mayores
	let k = left;
	for (let v of menores) arr[k++] = v;
	let pivotIdx = k;
	arr[k++] = pivot;
	for (let v of mayores) arr[k++] = v;

	// Animar el pivote en su lugar
	verQuickPivot(pivotIdx, pivotIdx, null, arr, pivotIdx, false, null, false, true);
	await esperar(700 + velocidadCustom);
	quickIterCount++;
	progressBar(quickIterCount); // Movimiento visual del pivote final
	// Limpiar cualquier residuo naranja
	dibujar(arr);
	// Guardar snapshot para navegación
	estados.push([...arr]);
	snapShots = estados.length;
	iteracion = snapShots - 1;
	// progressBar(iteracion); // Ya se actualiza arriba
	return pivotIdx;
// Animación de movimiento de barra a izquierda o derecha durante la partición
function verQuickPartitionMove(arr, idx, destino, pivot, isFirstPivot, mid, lado) {
	limpiarMain();
	for (let i = 0; i < arr.length; i++) {
		const contenedor = document.createElement("div");
		contenedor.classList.add("cnt");
		contenedor.style.height = arr[i] * 2 + "px";
		// Solo el pivote actual (pivot) es naranja
		if (i === pivot) {
			contenedor.classList.add("div-seleccionado");
		}
		if (i === idx) {
			if (lado === 'izq') {
				contenedor.classList.add("div-azul");
				contenedor.style.animationName = "desplazamiento-inverso";
			
			} else {
				contenedor.classList.add("div-rojo");
				contenedor.style.animationName = "desplazamiento";
				
			}
		}

		contenedor.innerHTML = arr[i];
		main.appendChild(contenedor);
	}
}
}



// Mueve el primer pivote al centro visualmente
function verQuickPivotMove(pivotIdx, midIdx, arr, left, right) {
	limpiarMain();
	for (let i = 0; i < arr.length; i++) {
		const contenedor = document.createElement("div");
		contenedor.classList.add("cnt");
		contenedor.style.height = arr[i] * 2 + "px";
		if (i === midIdx) {
			contenedor.classList.add("div-seleccionado"); 
			contenedor.style.animationName = "desplazamiento-inverso";
		} else if (i === pivotIdx) {
			contenedor.style.animationName = "desplazamiento";
		}
		contenedor.innerHTML = arr[i];
		main.appendChild(contenedor);
		
	}
}

// Dibuja el arreglo con el pivote en naranja
function dibujarPivot(arr, pivotIdx, isFirstPivot, mid, isFinal) {
	limpiarMain();
	for (let i = 0; i < arr.length; i++) {
		const contenedor = document.createElement("div");
		contenedor.classList.add("cnt");
		contenedor.style.height = arr[i] * 2 + "px";
		if (i === pivotIdx || (isFirstPivot && i === mid && isFinal)) {
			contenedor.classList.add("div-seleccionado");
		}
		contenedor.innerHTML = arr[i];
		main.appendChild(contenedor);
	}
}

// Dibuja el arreglo con el pivote naranja y el elemento actual azul
function verQuickPivot(indice, pivot, swap, arr, pivotIdx, isFirstPivot, mid, isSwap, isFinal) {
	limpiarMain();
	for (let i = 0; i < arr.length; i++) {
		const contenedor = document.createElement("div");
		contenedor.classList.add("cnt");
		contenedor.style.height = arr[i] * 2 + "px";
		// Solo el pivote actual en naranja
		if (i === pivotIdx || (isFirstPivot && i === mid && isFinal)) {
			contenedor.classList.add("div-seleccionado"); // pivote naranja
			pivotes.push(arr[i]);
		} else if (isSwap && (i === indice || i === swap)) {
			contenedor.classList.add("div-azul"); // azul para swap
		} else if (i === indice && !isSwap) {
			contenedor.classList.add("div-azul"); // azul para actual
		}
		if(pivotes.length >0 ){
			//Pivotes[0] siempre será el primer pivote elegido
			for(let k = 0; k < pivotes.length; k++){
				if(arr[i] == pivotes[0]){
					contenedor.classList.add("div-pivote-primero");
					contenedor.style.height = arr[i] * 2 + "px"
					contenedor.innerHTML = arr[i];
				}else if(pivotes[k] > pivotes[0] && arr[i] == pivotes[k]){
					contenedor.classList.add("div-pivote-mayor");
					contenedor.style.height = pivotes[k] * 2 + "px"
					contenedor.innerHTML = pivotes[k];
				}
				else if(pivotes[k]< pivotes[0] && arr[i] == pivotes[k]){
					contenedor.classList.add("div-pivote-menor");
					contenedor.style.height = pivotes[k] * 2 + "px"
					contenedor.innerHTML = pivotes[k];
				}
			}
		}
		contenedor.innerHTML = arr[i];
		main.appendChild(contenedor);
	}
}

function Random() {
	for (let i = 0; i < numerosQuick.length; i++) {
		let valorAleatorio = Math.floor(Math.random() * 250) + 1;
		numerosQuick[i] = valorAleatorio;
	}
}

function desordenar() {
	for (let i = numerosQuick.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[numerosQuick[i], numerosQuick[j]] = [numerosQuick[j], numerosQuick[i]];
	}
}


function dibujar() {
	limpiarMain();
	for (let i = 0; i < numerosQuick.length; i++) {
		const contenedor = document.createElement("div");
		contenedor.classList.add("cnt");
		contenedor.style.height = numerosQuick[i] * 2 + "px";
		contenedor.innerHTML = numerosQuick[i];
		main.appendChild(contenedor);
	}
}

// Dibuja un snapshot específico
function dibujarSnapshot(idx) {
	limpiarMain();
	let arr = estados[idx];
	for (let i = 0; i < arr.length; i++) {
		const contenedor = document.createElement("div");
		contenedor.classList.add("cnt");
		contenedor.style.height = arr[i] * 2 + "px";
		contenedor.innerHTML = arr[i];
		main.appendChild(contenedor);
	}
}

function limpiarMain() {
	main.innerHTML = "";
}


function progressBar(valor) {
	// Progreso real basado en iteraciones, como en burbuja.js
	let total = totalIteraciones > 0 ? totalIteraciones : 1;
	const porcentaje = (valor / total) * 100;
	const divPorcentaje = document.querySelector(".progressBar");
	divPorcentaje.style.width = porcentaje + "%";
	divPorcentaje.style.maxWidth = "100%";
}

// --- Barra de progreso sincronizada con el tiempo real ---
let idProgressBarTime = null;
let tiempoInicioAnimacion = 0;

// Sobrescribir Iniciar para animar la barra de progreso por tiempo real
// Variable global para guardar el tiempo real de animación
let tiempoAnimacionReal = 0;


function progressBarTime(percent) {
	const divPorcentaje = document.querySelector(".progressBar");
	divPorcentaje.style.width = percent + "%";
	divPorcentaje.style.maxWidth = "100%";
}

function limpiartodo() {
	progressBarTime(0);
	tiempoSecond = 0;
	tiempoAnimacion = 0;
	document.querySelector("#tiempoText").innerHTML = "Tiempo: 0 s";
}

async function esperar(ms) {
	await new Promise(resolve => setTimeout(resolve, ms));
	while (pausado) {
		await new Promise(res => continuar = res);
	}
}

// --- Iniciar sincronizado con barra de tiempo real ---
async function Iniciar(boton1, boton2, boton3, boton4, input) {
	if (enAnimacion) return;
	enAnimacion = true;
	limpiartodo();
	boton1.disabled = true;
	boton2.disabled = true;
	boton3.disabled = true;
	input.disabled = true;
	boton4.disabled = false;
	estados = [];
	// --- Contar movimientos visuales antes de animar ---
	totalIteraciones = contarMovimientosVisualesQuick(numerosQuick);
	quickIterCount = 0;
	progressBar(quickIterCount);
	// Si ya está ordenado, no hacer nada
	if (estaOrdenado(numerosQuick)) {
		boton1.disabled = false;
		boton2.disabled = false;
		boton3.disabled = false;
		input.disabled = false;
		boton4.disabled = true;
		enAnimacion = false;
		return;
	}
	tiempoInicioAnimacion = Date.now(); // Inicializa el tiempo justo antes de animar
	// Mostrar tiempo en tiempo real durante la animación
	let idIntervaloTiempo = setInterval(() => {
		let elapsed = Math.floor((Date.now() - tiempoInicioAnimacion) / 1000);
		document.querySelector("#tiempoText").innerHTML = "Tiempo: " + elapsed + " s";
	}, 200);
	await quickSortAnim(numerosQuick, 0, numerosQuick.length - 1, true);
	clearInterval(idIntervaloTiempo);
	progressBar(totalIteraciones); // Llenar barra al 100% al finalizar
	let elapsed = Math.floor((Date.now() - tiempoInicioAnimacion) / 1000);
	document.querySelector("#tiempoText").innerHTML = "Tiempo: " + elapsed + " s";
	boton1.disabled = false;
	boton2.disabled = false;
	boton3.disabled = false;
	input.disabled = false;
	boton4.disabled = true;
	enAnimacion = false;
	pivotes = []
	
}

//---------------------INICIALIZADORES----------------------//

let botonDesordenar = document.querySelector("#sortBtn");
let botonStart = document.querySelector("#startBtn");
let botonAleatorio = document.querySelector("#randomBtn");
let stopBoton = document.querySelector("#stopBtn");
let inputVelo = document.querySelector("#velotxt");
let inputDatos = document.querySelector("#datostxt");
let txtDatos = document.querySelector("#txtDatos");
let progressBarDiv = document.querySelector(".progressBar");
let progressBarBackDiv = document.querySelector(".progressBarBack");


botonDesordenar.addEventListener("click", () => {
	if (enAnimacion) return;
	desordenar();
	inicializadores();
});

inputVelo.addEventListener("change", () => {
	velocidadCustom = -(parseInt(inputVelo.value) * 3.5);
});

inputDatos.addEventListener("change", () => {
	if (enAnimacion) return;
	let cantidadDatos = inputDatos.value;
	if (numerosQuick.length >= cantidadDatos) {
		numerosQuick.length = cantidadDatos;
	} else {
		let lenghAnterior = numerosQuick.length;
		numerosQuick.length = cantidadDatos;
		for (let k = 0; k < numerosQuick.length; k++) {
			if (k > (lenghAnterior - 1)) {
				numerosQuick[k] = Math.floor(Math.random() * 250) + 1;
			}
		}
	}
	inicializadores();
});

botonStart.addEventListener("click", () => {
	Iniciar(botonStart, botonAleatorio, botonDesordenar, stopBoton, inputDatos);
});

botonAleatorio.addEventListener("click", () => {
	if (enAnimacion) return;
	Random();
	limpiartodo();
	inicializadores();
});

stopBoton.addEventListener("click", function () {
	if (!enAnimacion) return;
	if (pausado) {
		stopBoton.innerHTML = "Parar";
		pausado = false;
		tiempoSecond = relevoTiempo;
		idTimeo3 = setInterval(() => {
			document.querySelector("#tiempoText").innerHTML = tiempoSecond + " segundos";
			tiempoSecond++;
		}, 1000);
		continuar();
	} else {
		pausado = true;
		stopBoton.innerHTML = "Continuar";
		clearInterval(idTimeo3);
		relevoTiempo = tiempoSecond;
	}
});

txtDatos.addEventListener("keydown", (e) => {
	if (enAnimacion) return;
	if (e.key === "Enter" && numerosQuick.length < 12 && txtDatos.value !== "") {
		let val = parseInt(txtDatos.value);
		if (!isNaN(val)) {
			let pos = Math.floor(Math.random() * (numerosQuick.length + 1));
			numerosQuick.splice(pos, 0, val);
			txtDatos.value = "";
			inicializadores();
		}
	}
});

// Navegación de snapshots con barra de progreso y botones
function porcentajeClick(evento, div) {
	if (enAnimacion) return;
	let widthContainer = evento.clientX - div.getBoundingClientRect().left;
	let widthBar = div.offsetWidth;
	const porcentaje = (widthContainer / widthBar) * 100;
	let index = Math.floor((porcentaje / 100) * (snapShots - 1));
	if (index < 0) index = 0;
	if (index >= snapShots) index = snapShots - 1;
	iteracion = index;
	progressBar(iteracion); // Solo para navegación manual
	dibujarSnapshot(iteracion);
}

progressBarDiv.addEventListener("click", (e) => porcentajeClick(e, progressBarDiv));
progressBarBackDiv.addEventListener("click", (e) => porcentajeClick(e, progressBarBackDiv));


function inicializadores() {
	totalIteraciones = contarIteracionesQuick(numerosQuick);
	quickIterCount = 0;
	ordenados = Array(numerosQuick.length).fill(false);
	precomputarQuick();
	iteracion = 0;
	progressBar(quickIterCount);
	dibujarSnapshot(iteracion);
}

// Dibujar barras al cargar la página
window.addEventListener('DOMContentLoaded', () => {
	inicializadores();
});


//MODAL
const modal2 = new Popzy({
  templateId: 'modal-quicksort',
  footer: true,
  destroyOnClose: false,
  closeMethods: ['overlay', 'button', 'escape'],
});

function abrirModal2(){
    
    modal2.open();
}
