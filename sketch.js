// ⏱️ VARIABLES DE TIEMPO Y ESTADO DE JUEGO
let tiempoTotal = 120; // 2 minutos en segundos
let tiempoRestante = tiempoTotal;
let tiempoInicio;
let juegoTerminado = false;

// Fondos y Escenas
let imagenEscena1;
let ciudad;
let casa;
let imgCasaInterior;
let personaje;

// Sprites del personaje
let imgPersonajeMano;
let imgPersonajeSentado;
let fotoPiso;
let fotoDisparo;
let fotosCaminante = []; 
let fotosCaminanteCaido = [];

// Entidades del juego
let deudas = [];
let disparos = [];
let interfaz;
let imgInstrucciones; 
let sueloY = 460; 

// VARIABLES DEL JUEGO:
let saludFinanciera = 100; 
let deudasLiquidadas = 0;  
let pesosDisponibles = 50; 

// Máquina de estados: 2 = Instrucciones, 3 = Ciudad, 4 = Casa
let estado = 2; 

function preload() {
  imagenEscena1 = loadImage('img/escena1.png');
  imgCasaInterior = loadImage('img/casa-1.png');
  imgInstrucciones = loadImage("img/instrucciones.png");
  
  imgPersonajeMano = loadImage('img/man-1.png'); 
  imgPersonajeSentado = loadImage('img/sentado.png'); 
  fotoPiso = loadImage('img/piso.png');
  fotoDisparo = loadImage('img/disparo.png');

  fotosCaminante = []; 
  for (let i = 1; i <= 8; i++) {
    fotosCaminante.push(loadImage(`img/c_${i}.png`));
  }

  fotosCaminanteCaido = [];
  for (let i = 1; i <= 5; i++) {
    fotosCaminanteCaido.push(loadImage(`img/cai_${i}.png`));
  }
}

function setup() {
  createCanvas(600, 410);

  ciudad = new Ciudad(imagenEscena1);
  casa = new Casa(imgCasaInterior);
  interfaz = new Interfaz();
  
  personaje = new Personaje1(
    300, sueloY, 
    fotosCaminante, 
    fotosCaminanteCaido, 
    fotoDisparo, 
    fotoPiso, 
    imgPersonajeMano, 
    imgPersonajeSentado
  );
}

function iniciarJuego() {
  tiempoRestante = tiempoTotal;
  tiempoInicio = millis(); 
  juegoTerminado = false;
  
  saludFinanciera = 100;
  deudasLiquidadas = 0;
  pesosDisponibles = 50;
  deudas = [];
  disparos = [];
  
  if (personaje) {
    personaje.x = 300;
    personaje.y = sueloY;
    personaje.estado = "NORMAL";
    personaje.estadoBase = "NORMAL";
  }

  estado = 2;
}

function draw() {
  if (estado === 2) {

    // 📜 PANTALLA 2: INSTRUCCIONES

    background(0);

    if (imgInstrucciones) {
      image(imgInstrucciones, 0, 0, width, height);
    }
    interfaz.mostrarInstrucciones(imgInstrucciones);
    
  } else if (estado === 3) {
    // 🎮 PANTALLA 3: LA CIUDAD (EXTERIOR)
    background(90, 140, 170);
    ciudad.dibujar();
    
    personaje.actualizar();
    personaje.dibujar(estado);

    // ⏱️ Lógica de tiempo
    if (!juegoTerminado) {
      let tiempoTranscurrido = floor((millis() - tiempoInicio) / 1000);
      tiempoRestante = tiempoTotal - tiempoTranscurrido;

      if (tiempoRestante <= 0) {
        tiempoRestante = 0;
        saludFinanciera = 0;
        personaje.estado = "DERROTADO";
        personaje.y = 280;
        juegoTerminado = true;
      }
    }

    // Lluvia de deudas

    if (frameCount % 120 === 0 && personaje.estado !== "DERROTADO") {
      deudas.push(new Deuda(width));
    }

    for (let i = deudas.length - 1; i >= 0; i--) {
      deudas[i].actualizar();
      deudas[i].dibujar();

      if (deudas[i].verificarColision(personaje)) {
        saludFinanciera -= 50;
        
        if (saludFinanciera === 50) {
          personaje.estadoBase = "AGACHADO";
          personaje.estado = "AGACHADO";
        } else if (saludFinanciera <= 0) {
          saludFinanciera = 0;
          personaje.estado = "DERROTADO";
          personaje.y = sueloY; 
          juegoTerminado = true;
        }
      }

      if (deudas[i].y > height + 50) {
        deudas.splice(i, 1);
      }
    }

    for (let k = disparos.length - 1; k >= 0; k--) {
      disparos[k].actualizar();
      disparos[k].dibujar();

      for (let j = deudas.length - 1; j >= 0; j--) {
        if (disparos[k].verificarImpacto(deudas[j])) {
          deudasLiquidadas += 1; 
          deudas.splice(j, 1);   
          break;                  
        }
      }

      if (disparos[k] && (!disparos[k].activo || disparos[k].y < -20)) {
        disparos.splice(k, 1);
      }
    }

   // 🌆 EFECTO DE OSCURECIMIENTO PROGRESIVO
    let oscuridad = map(tiempoRestante, tiempoTotal, 0, 0, 180);
    fill(0, oscuridad);
    noStroke();
    rect(0, 0, width, height);

    dibujarMarcadorPantalla();

    if (personaje.x <= 60) {
      estado = 4; 
      personaje.x = 500; 
    }

  } else if (estado === 4) {
    background(0);
  
    casa.dibujar();
    personaje.actualizar();

  // 🛋️ DETECCIÓN DEL SILLÓN
    let cercaDelSillon = (personaje.x >= 60 && personaje.x <= 280);
  
    // Si está cerca y parado, muestra mensaje sutil

    if (cercaDelSillon && personaje.estado !== "SENTADO" && personaje.estado !== "DERROTADO") {
      push();
      fill(255, 255, 0);
      stroke(0);
      strokeWeight(2);
      textSize(10);
      textAlign(CENTER);
      text("Presioná 'S' para descansar", personaje.x, personaje.y - 260);
      pop();
    }

    if (personaje.estado === "SENTADO") {
      if (frameCount % 30 === 0) {
        if (saludFinanciera < 100) {
          saludFinanciera = min(100, saludFinanciera + 5);
          
          if (saludFinanciera > 50) {
            personaje.estadoBase = "NORMAL";
          }
        }
      }
    }

  // 🎨 DIBUJO DEL PERSONAJE CON EL ESCALADO MANTENIDO INTACTO
    push();
    let escala = 2.5; 
    translate(personaje.x * (1 - escala), personaje.y * (1.3 - escala));
    scale(escala);
    personaje.dibujar();
    pop();

    // ⏱️ El tiempo sigue corriendo adentro

    if (!juegoTerminado) {
      let tiempoTranscurrido = floor((millis() - tiempoInicio) / 1000);
      tiempoRestante = tiempoTotal - tiempoTranscurrido;

      if (tiempoRestante <= 0) {
        tiempoRestante = 0;
        saludFinanciera = 0;
        personaje.estado = "DERROTADO";
        personaje.y = 500;
        juegoTerminado = true;
      }
    }

  // 🚪 SALIR DE LA CASA (Salida por la derecha)

    if (personaje.x >= 550) {
      estado = 3;
      personaje.x = 100;
    }

  // 📊 HUD

    dibujarMarcadorPantalla();
  }
}

function mousePressed() {
  if (estado === 2 && interfaz.mouseSobreBoton()) {
    cursor(ARROW); 
    estado = 3;             
    tiempoInicio = millis(); 
  }
}

function keyPressed() {
  if (key === 'r' || key === 'R') {
    iniciarJuego();
  }

  if (estado === 4) {
    if (key === 's' || key === 'S') {
      if (personaje.estado === "SENTADO") {
        personaje.x = 180; 
        personaje.levantarse();
      } else if (personaje.x >= 60 && personaje.x <= 280) {
        personaje.sentarse();
      }
    }
  }

  if (estado === 3) {
    if (keyCode === 32 && pesosDisponibles > 0 && personaje.estado !== "DERROTADO") {
      disparos.push(new Disparo(personaje.x, personaje.y - 80));
      pesosDisponibles -= 1;
    }
  }
}

function dibujarMarcadorPantalla() {
  push();
  fill(0, 0, 0, 160); 
  noStroke();
  rect(15, 10, 140, 70, 4); 
  
  textSize(9);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  
  fill(0, 255, 255);
  text(`SALUD FINANCIERA: ${saludFinanciera}%`, 20, 15);
  
  fill(0, 255, 55);
  text(`PESOS: $${pesosDisponibles}`, 20, 30);
  
  fill(255, 15, 250);
  text(`LIQUIDADAS: ${deudasLiquidadas}`, 20, 45);

  let minutos = floor(tiempoRestante / 60);
  let segundos = tiempoRestante % 60;
  let textoTiempo = nf(minutos, 2) + ":" + nf(segundos, 2);

  fill(255, 220, 0);
  text(`TIEMPO: ${textoTiempo}`, 20, 60);

  pop();
}