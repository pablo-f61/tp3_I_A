let imagenEscena1;
let ciudad;
let personaje;
let fotosCaminante = []; 
let fotosCaminanteCaido = [];
let deudas = [];
let disparos = [];
let fotoPiso;
let fotoDisparo;
let interfaz;
let imgInstrucciones; 
let sueloY = 280; // Tu variable de control

// VARIABLES DEL JUEGO:
let saludFinanciera = 100; 
let deudasLiquidadas = 0;  
let pesosDisponibles = 50; 

// Máquina de estados: 2 = Instrucciones, 3 = Juego
let estado = 2; 

function preload(){
  imagenEscena1 = loadImage('img/escena1.png');
  imgInstrucciones = loadImage("img/instrucciones.png"); 
  
  fotosCaminante = []; 
  for (let i = 1; i <= 8; i++) {
    fotosCaminante.push(loadImage(`img/c_${i}.png`));
  }

  fotosCaminanteCaido = [];
  for (let i = 1; i <= 5; i++) {
    fotosCaminanteCaido.push(loadImage(`img/cai_${i}.png`));
  }

  fotoPiso = loadImage(`img/piso.png`);
  fotoDisparo = loadImage(`img/disparo.png`);
}

function setup() {
  createCanvas(600, 400);
  
  ciudad = new Ciudad(imagenEscena1);
  interfaz = new Interfaz();
  
  // Tu inicialización con los valores correctos para tu lienzo
  personaje = new Personaje1(300, 460, fotosCaminante, fotosCaminanteCaido, fotoDisparo, fotoPiso);
}

function draw() {
  if (estado === 2) {
    interfaz.mostrarInstrucciones(imgInstrucciones);
    
  } else if (estado === 3) {
    background(90, 140, 170);
    ciudad.dibujar();
    
    personaje.actualizar();
    personaje.dibujar();

    // 1. Generar deudas (lluvia)
    if (frameCount % 120 === 0 && personaje.estado !== "DERROTADO") {
      deudas.push(new Deuda(width));
    }

    // 2. BUCLE DE DEUDAS (Independiente)
    for (let i = deudas.length - 1; i >= 0; i--) {
      deudas[i].actualizar();
      deudas[i].dibujar();

      // Chequear colisiones de deudas con el personaje
      if (deudas[i].verificarColision(personaje)) {
        saludFinanciera -= 50;
        
        if (saludFinanciera === 50) {
          personaje.estadoBase = "AGACHADO";
          personaje.estado = "AGACHADO";
        } else if (saludFinanciera <= 0) {
          saludFinanciera = 0;
          personaje.estado = "DERROTADO";
        }
      }

      // Limpieza de deudas: Evaluamos en Y porque caen
      if (deudas[i].y > height + 50) {
        deudas.splice(i, 1);
      }
    }

    // 3. BUCLE DE DISPAROS (Separado del de las deudas, usando variable 'k')
    for (let k = disparos.length - 1; k >= 0; k--) {
      disparos[k].actualizar();
      disparos[k].dibujar();

      // Chequear si este disparo le pegó a alguna de las deudas
      for (let j = deudas.length - 1; j >= 0; j--) {
        if (disparos[k].verificarImpacto(deudas[j])) {
          deudasLiquidadas += 1; 
          deudas.splice(j, 1);   
          break;                 
        }
      }

      // Limpieza de disparos inactivos o fuera de pantalla
      if (disparos[k] && (!disparos[k].activo || disparos[k].y < -20)) {
        disparos.splice(k, 1);
      }
    }

    // Dibujamos tu HUD achicado a la derecha
    dibujarMarcadorPantalla();
  } 
}

function mousePressed() {
  if (estado === 2 && interfaz.mouseSobreBoton()) {
    cursor(ARROW); 
    estado = 3;    
  }
}

// Evento para instanciar la bala/peso solo una vez por click en la barra
function keyPressed() {
  if (estado === 3) {
    if (keyCode === 32 && pesosDisponibles > 0 && personaje.estado !== "DERROTADO") {
      // Instanciamos el disparo arriba del personaje (ajustá el -80 según veas su altura)
      disparos.push(new Disparo(personaje.x, personaje.y - 80));
      pesosDisponibles -= 1; // Descuenta munición
    }
  }
}

function dibujarMarcadorPantalla() {
  push();
  fill(0, 0, 0, 160); // Subí un poco la opacidad a 160 para que sea legible sobre el fondo
  noStroke();
  rect(445, 10, 140, 55, 4);
  
  textSize(9);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  
  fill(0, 255, 255);
  text(`SALUD FINANCIERA: ${saludFinanciera}%`, 450, 15);
  
  fill(0, 255, 55);
  text(`PESOS: $${pesosDisponibles}`, 450, 32);
  
  fill(255, 15, 250);
  text(`LIQUIDADAS: ${deudasLiquidadas}`, 450, 49);
  pop();
}