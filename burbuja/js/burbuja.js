'use strict'
    //Estructuras
    let numerosBurbuja  =[1,16,22,34,44444,512,69,80 ,44444,512,69,80 ,44444,512,69,80 ,44444,512,69,80]
    let main = document.getElementById("burb");
    let cadena = "";
    let lista = document.querySelector("#lista");  
    var idTimeou;
    var idTimeo2;
    var idTimeo3;
    let pausado = false;
    let continuar; //resolverá la promesa cuando se reanude
    //DOM
   function dibujar(){
    limpiarMain();
     for(let i  =0; i< numerosBurbuja.length; i++){
         const contenedor = document.createElement("div");
        contenedor.classList.add("cnt");
        contenedor.style.height = numerosBurbuja[i] *2 + "px"; //altura proporcional
        contenedor.innerHTML = numerosBurbuja[i];
        main.appendChild(contenedor);
        lista.innerHTML = "";
        cadena ="";
        numerosBurbuja.forEach((valor)=>{ 
            cadena += "<li> "+ valor + " </li>";
        })
        lista.innerHTML = cadena;
        }
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
   //Metodo de ordenamiento
async function Burbuja() {
    let n, i, k, aux;
    n = numerosBurbuja.length;
    //k = 1 n = 12
    // Algoritmo de burbuja
    for (k = 1; k < n; k++) {
        for (i = 0; i < (n - k); i++) {
            verBurbuja(i,i+1, "selección");
            await esperar(300);
            if (numerosBurbuja[i] > numerosBurbuja[i + 1]) {
                verBurbuja(i, i+1);
                 await esperar(500);
                aux = numerosBurbuja[i];
                numerosBurbuja[i] = numerosBurbuja[i + 1];
               numerosBurbuja[i + 1] = aux;
               await esperar(300);
              
            }
            dibujar();
        }
    }

    
}
async function esperar(ms) {
    
    await new Promise(resolve => setTimeout(resolve, ms));

    while (pausado) {
        await new Promise(res => continuar = res); //Promesa pendiente cuando se ha pausado el lagoritmo (SE RESUELVE CUANDO SE HACE continuar(), ya que obtiene el res)
    }
}
async function Iniciar(boton1, boton2,boton3) {
    boton1.disabled =  true;
    boton2.disabled = true;
    boton3.disabled = true
    await Burbuja();
     boton1.disabled =  false;
     boton2.disabled = false;
     boton3.disabled = false;
}
function Random(){
    for(let i = 0; i< numerosBurbuja.length; i++){
        let valorAleatorio = Math.floor(Math.random() * 250) + 1;
        numerosBurbuja[i] = valorAleatorio;
    }
}
   //Vaina
   let boton2 = document.querySelector("#btn2");
   let boton1 = document.querySelector("#btn1");
   let boton3 =document.querySelector("#btn3");
   let stopBoton =  document.querySelector("#btn4");
   let pararBoton  = document.querySelector("#btn5");
   boton2.addEventListener("click",()=>{
        desordenar();
        clearTimeout(idTimeou);
        clearTimeout(idTimeo2);
        dibujar()
   });
   boton1.addEventListener("click",()=>{
    //Aca se va a agregar el codigo bueno de visualización
        Iniciar(boton1,boton2,boton3);
        dibujar();
   })
   boton3.addEventListener("click", ()=>{
        Random();
        clearTimeout(idTimeou);
        clearTimeout(idTimeo2);
        dibujar();
   })
   stopBoton.addEventListener("click",  function(){
     pausado = true;
   })
   pararBoton.addEventListener("click",()=>{
        if (pausado) {
            pausado = false;
            if (continuar) {
                continuar(); // despierta el bucle donde estaba
                continuar = null;
            }
        }
   })
   //Cuando ya se renderize todo  se va a aplicar esta función
function verBurbuja(indiceMayor, indiceMenor, bandera){
    limpiarMain();
 for(let i= 0; i< numerosBurbuja.length; i++){
      
         const contenedor = document.createElement("div");
        contenedor.classList.add("cnt");
        contenedor.style.height = numerosBurbuja[i] *2 + "px"; 
        if(i == indiceMayor &&bandera != "selección"){
            contenedor.classList.add("div-azul");
        }else if (i == indiceMenor &&bandera != "selección"){
            contenedor.classList.add("div-verde");
        }
        //Para que vea si se ha seleccionado algo
        else if(bandera == "selección" && i == indiceMayor){
            contenedor.classList.add("div-seleccionado");
        }else if(bandera == "selección" && i == indiceMenor){
            contenedor.classList.add("div-seleccionado");
        }
        contenedor.innerHTML = numerosBurbuja[i];
        main.appendChild(contenedor);
        //Para que se pueda ver también en la lista de array
        lista.innerHTML = "";
        cadena ="";
        numerosBurbuja.forEach((valor)=>{ 
            cadena += "<li> "+ valor + " </li>";
        })
        lista.innerHTML = cadena; 
 }
}
function obtenerDiv(valor){
    let arrayDiv  = document.querySelectorAll(".cnt")
     for( let i  =0; i< numerosBurbuja.length; i++){
        if(valor  == arrayDiv[i].innerHTML){
            return arrayDiv[i];
        }
     }
}
//Declaraciones
 dibujar();
