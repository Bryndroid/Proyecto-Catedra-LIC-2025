'use strict'
//ARRAY CONTENEDOR
let numerosBurbuja  =[1,16,22,34,44444,512,69,80 ,44444,512,69,80];
//LIENZO
let main = document.getElementById("graphic-content");
//VARIABLES DE CONTROL
let cadena = "";
var idTimeou;
var idTimeo2;
var idTimeo3;
var velocidadCustom = 0;
var valorCustom = 0;
var valorDiv = 0;
var divGrafica;
var totalIteraciones = 0;
var iteracion = 0;
var tiempoSecond = 0;
var  relevoTiempo = 0;
let pausado = false;
let estados = [];
let snapShots = 0;
let continuar; //resolverá la promesa cuando se reanude
//---------------------------- BURBUJA --------------------------//
//Metodo de ordenamiento para ver el total de iteracioness
function BurbujaIteraciones(){
    totalIteraciones = 0;
    const copiaArray = [...numerosBurbuja];
    let n, i, k, aux;
    n = copiaArray.length;
  
    for (k = 1; k < n; k++) {
        for (i = 0; i < (n - k); i++) {
            if (copiaArray[i] > copiaArray[i + 1]) {
              aux = copiaArray[i];
              copiaArray[i] = copiaArray[i+1];
              copiaArray[i+1] = aux;
              totalIteraciones++;
            }
        }
    }
}
//Burbuja para visualizar
async function Burbuja() {
    iteracion = 0;
    let n, i, k, aux;
    n = numerosBurbuja.length;
    //k = 1 n = 12
    // Algoritmo de burbuja
    for (k = 1; k < n; k++) {
        for (i = 0; i < (n - k); i++) {
            verBurbuja(i, i+1, "selección");
            await esperar(300 + velocidadCustom);
            if (numerosBurbuja[i] > numerosBurbuja[i + 1]) {
                verBurbuja(i, i+1);
                 await esperar(500 + velocidadCustom);
                aux = numerosBurbuja[i];
                numerosBurbuja[i] = numerosBurbuja[i + 1];
               numerosBurbuja[i + 1] = aux;
               iteracion++;
               progressBar(iteracion);
               await esperar(300 + velocidadCustom);
              
            }
            //Para volverlo todo a normalito uwu onichan daiski
           dibujar();
        }
    }
    
}
//FUNCION PARA DARLE COLOR UNICO AL DIV DE ACUERDO A SU ROL: SI ES INDICE MENOR O MAYOR O SI ES UN RECORRIDO DEL ARRAY
function verBurbuja(indiceMayor, indiceMenor, bandera){
    limpiarMain();
    for(let i= 0; i< numerosBurbuja.length; i++){
        
        const contenedor = document.createElement("div");
        contenedor.classList.add("cnt");
        contenedor.style.height = numerosBurbuja[i] *2 + "px"; 
        //La bandera ya me indica un div DISTINTO   
        if(i == indiceMayor && bandera != "selección"){
            contenedor.classList.add("div-azul");
        }else if (i == indiceMenor && bandera != "selección"){
            contenedor.classList.add("div-verde");
        }
        //Para que vea si se ha seleccionado algo
        else if(bandera == "selección"){
            if(i == indiceMayor){
                contenedor.classList.add("div-seleccionado");
            }else if(i == indiceMenor){
                contenedor.classList.add("div-seleccionado");
            }
        }
        contenedor.innerHTML = numerosBurbuja[i];
        main.appendChild(contenedor);    
    }
}
//Función para randomizar el array de valores hasta X * 250
function Random(){
    for(let i = 0; i< numerosBurbuja.length; i++){
        let valorAleatorio = Math.floor(Math.random() * 250) + 1;
        numerosBurbuja[i] = valorAleatorio;
    }
 
}
//Funcion para obtener el Contenedor de acuerdo al valor (NUNCA COLOCCAR OTRA COSA QUE NO SEA UN VALOR NUMERICCO DENTRO DEL CONTENEDOR .CNT)
function obtenerDiv(valor){
    let arrayDiv  = document.querySelectorAll(".cnt")
     for( let i  =0; i< numerosBurbuja.length; i++){
        if(valor  == arrayDiv[i].innerHTML){
            return arrayDiv[i];
        }
     }
}
//Timer personalizado de promesa: Espera un tiempo que el setTimeout hará para ejecutar el código CUANDO SE RESUELVE LA PROMESA ES CUANDO PASA X (X = ms) tiempo
//La promesa se resuelve cuando se invoca a Resolve();
async function esperar(ms) {
    await new Promise(resolve => setTimeout(resolve, ms));

    while (pausado) {
        await new Promise(res => continuar = res); //Promesa pendiente cuando se ha pausado el lagoritmo (SE RESUELVE CUANDO SE HACE continuar(), ya que obtiene el res)
    }
}
//--------------------------------------------------------------DOM---------------------------------//
function dibujar(){
    limpiarMain();
     for(let i  =0; i< numerosBurbuja.length; i++){
        const contenedor = document.createElement("div");
        contenedor.classList.add("cnt");
        contenedor.addEventListener("click", (evento)=>{
            divModal.style.display = "block";
            valorDiv = parseInt(evento.currentTarget.innerHTML);
        }); 
        contenedor.style.height = numerosBurbuja[i] *2 + "px"; //altura proporcional
        contenedor.innerHTML = numerosBurbuja[i];
        main.appendChild(contenedor);
       
    }
   
}
function limpiartodo(){
    if(iteracion == 0)
    progressBar(iteracion);
    tiempoSecond = 0;
    document.querySelector("#tiempoText").innerHTML = tiempoSecond + " segundos"
}
function limpiarMain(){
    main.innerHTML = "";
}
function desordenar(){
    for (let i = numerosBurbuja.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); //posición entre 0 e i
        //Intercambiar elementos
        [numerosBurbuja[i], numerosBurbuja[j]] = [numerosBurbuja[j], numerosBurbuja[i]];
    }
}
function progressBar(valor){
    const porcentaje  = (valor / totalIteraciones) * 100;
    const divPorcentaje = document.querySelector(".progressBar");
    divPorcentaje.style.width = porcentaje + "%";

}

async function Iniciar(boton1, boton2, boton3, boton4, input) {
    limpiartodo();
    //Contador
    idTimeo3 = setInterval(()=>{
        document.querySelector("#tiempoText").innerHTML = tiempoSecond + " segundos";
        tiempoSecond++;
    }, 1000);
    boton1.disabled =  true;
    boton2.disabled = true;
    boton3.disabled = true;
    input.disabled = true;
    boton4.disabled = false;
    console.log(totalIteraciones  + "dentro de iniciar")
    await Burbuja();
    clearInterval(idTimeo3);
     boton1.disabled =  false;
     boton2.disabled = false;
     boton3.disabled = false;
     input.disabled = false;
     boton4.disabled = true;
}
//-------------------------------------INICIALIZADORES-----------------------------//
let botonDesordenar = document.querySelector("#sortBtn");
let botonStart = document.querySelector("#startBtn");
let botonAleatorio =document.querySelector("#randomBtn");
let stopBoton =  document.querySelector("#stopBtn");
let inputVelo = document.querySelector("#velotxt");
let inputDatos = document.querySelector("#datostxt");
let txtDatos = document.querySelector("#txtDatos");
//---------------INPUTS---------
botonDesordenar.addEventListener("click",()=>{
    desordenar();
    //Siempre limpiar los timeOut por rendimiento y por bugs xd
    clearTimeout(idTimeou);
    clearTimeout(idTimeo2);
   inicializadores();
});

inputVelo.addEventListener("change", ()=>{
    velocidadCustom = parseInt(inputVelo.value) *3.5;

})
inputDatos.addEventListener("change", ()=>{
    let cantidadDatos = inputDatos.value;
    if(numerosBurbuja.length >= cantidadDatos){
       numerosBurbuja.length = cantidadDatos;
    }else{
        let lenghAnterior = numerosBurbuja.length;
        numerosBurbuja.length = cantidadDatos;
        for(let k = 0; k < numerosBurbuja.length; k++){
            if(k > (lenghAnterior - 1)){
                //Ingreso un valor random
                numerosBurbuja[k] = Math.floor(Math.random() * 250) + 1;
            }
        }
    }
   inicializadores();
});
botonStart.addEventListener("click",()=>{
    //Aca se va a agregar el codigo bueno de visualización
    Iniciar(botonStart,botonAleatorio,botonDesordenar,stopBoton, inputDatos);
});

botonAleatorio.addEventListener("click", ()=>{
    Random();
    limpiartodo();
    clearTimeout(idTimeou);
    clearTimeout(idTimeo2);
    inicializadores();
});

stopBoton.addEventListener("click",  function(){
    if(pausado){
        stopBoton.innerHTML = "Parar";
        pausado = false;
        tiempoSecond = relevoTiempo;
        idTimeo3 = setInterval(()=>{
            document.querySelector("#tiempoText").innerHTML = tiempoSecond + " segundos";
            tiempoSecond++;
        },1000);
        //Resuelvo la promesa para que continue
        continuar();
    }else{
        pausado = true;
        stopBoton.innerHTML = "Continuar";
        clearInterval(idTimeo3);
        relevoTiempo = tiempoSecond;
    }
});


/* pararBoton.addEventListener("click",()=>{
    if (pausado) {
        pausado = false;
        if (continuar) {
            continuar(); // despierta el bucle donde estaba
            continuar = null;
        }
    }
}); */
//----------------------FUNCIONES  IMPORTANTES------------------
function CambiarValor(valorAnterior, valorNuevo){
    for(let i = 0; i < numerosBurbuja.length; i++){
        if(numerosBurbuja[i] == valorAnterior){
            numerosBurbuja[i] = valorNuevo;
            return;
        }
    }
    inicializadores();
}
function precomputarBurbuja() {
    estados = [];
    let copia = [...numerosBurbuja];
    estados = [ [...copia] ]; //Guardo un ARRAY de numeros burbuja en CADA estado 

    let n = copia.length;
    for (let k = 1; k < n; k++) {
        for (let i = 0; i < (n - k); i++) {
            if (copia[i] > copia[i + 1]) {
                [copia[i], copia[i+1]] = [copia[i+1], copia[i]];
            }
            estados.push([...copia]); // guardar snapshot en cada paso
        }
    }
    snapShots = estados.length;
}
function porcentajeClick(evento, div){
    //Obtener EXACTAMENTE dónde hizo click en EL DIV CONTAINER
    let widthContainer = evento.clientX - div.getBoundingClientRect().left;
    let widthBar =  div.offsetWidth;
    const porcentaje = (widthContainer / widthBar) *100;
    // Calcular en qué snapshot deberíamos estar redondeando hacia ABAJO
    let index = Math.floor((porcentaje / 100) * (snapShots - 1));
    numerosBurbuja = [...estados[index]];
    console.log(totalIteraciones  + "dentro de porcentajeClick");
    iteracion = Math.floor((porcentaje / 100) * totalIteraciones);
    progressBar(iteracion);
    dibujar();

}
txtDatos.addEventListener("blur", ()=>{
    if(numerosBurbuja.length <12)
    {
        numerosBurbuja.push(parseInt(txtDatos.value));
        inicializadores();
    }
})
function inicializadores(){
    BurbujaIteraciones();
    precomputarBurbuja();
    dibujar();
}
inicializadores();
