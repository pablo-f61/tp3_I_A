// ⏱️ VARIABLES DE TIEMPO Y ESTADO DE JUEGO
let tiempoTotal = 180; 
let tiempoRestante = tiempoTotal;
let tiempoInicio;
let juegoTerminado = false;

// Fondos y Escenas
let imagenEscena1;
let ciudad;
let casa;
let oficina; 
let imgOficina;
let imgCasaInterior;
let personaje;

// Asset del Velero
let imgVelero;

// Sprites del personaje
let imgPersonajeMano;
let imgPersonajeSentado;
let imgPersonajeTrabajando; 
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
let pesosDisponibles = 30; 

// Máquina de estados
let estado = 2;
let escenaActual = 3; // 3 = Ciudad, 4 = Casa, 5 = Oficina

function preload() {
  imagenEscena1 = loadImage('img/escena1.png');
  imgCasaInterior = loadImage('img/casa-1.png');
  imgInstrucciones = loadImage("img/instrucciones.png");
  imgOficina = loadImage("img/ofi-1.png");
  imgVelero = loadImage('img/velero.png'); // ⛵ Carga del velero
  
  imgPersonajeMano = loadImage('img/man-1.png'); 
  imgPersonajeTrabajando = loadImage('img/senta-2.png');
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

  ciudad = new Ciudad(imagenEscena1, imgVelero); // ⛵ Instancia con el velero
  casa = new Casa(imgCasaInterior);
  oficina = new Oficina(imgOficina); 
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

  personaje.imgPersonajeTrabajando = imgPersonajeTrabajando;
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
  escenaActual = 3;
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
    escenaActual = 3;
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
        juegoTerminado = true;
        estado = 7;
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
        saludFinanciera -= 20;
        if (saludFinanciera === 40) {
          personaje.estadoBase = "AGACHADO";
          personaje.estado = "AGACHADO";
        } else if (saludFinanciera <= 0) {
          saludFinanciera = 0;
          personaje.estado = "DERROTADO";
          personaje.estadoBase = "DERROTADO";
          personaje.y = sueloY; 
          juegoTerminado = true;
          estado = 6;
        }
      }

      if (deudas[i].y > height + 50) {
        deudas.splice(i, 1);
      }
    }

    // Disparos e impactos
    for (let k = disparos.length - 1; k >= 0; k--) {
      disparos[k].actualizar();
      disparos[k].dibujar();

      for (let j = deudas.length - 1; j >= 0; j--) {
        if (disparos[k].verificarImpacto(deudas[j])) {
          deudasLiquidadas += 1; 
          deudas.splice(j, 1);   

          // 🏆 CONDICIÓN DE VICTORIA
          if (deudasLiquidadas >= 10) {
            juegoTerminado = true;
            estado = 7; 
          }
          break;                  
        }
      }

      if (disparos[k] && (!disparos[k].activo || disparos[k].y < -20)) {
        disparos.splice(k, 1);
      }
    }

    // 🌆 EFECTO DE OSCURECIMIENTO
    let oscuridad = map(tiempoRestante, tiempoTotal, 0, 0, 180);
    fill(0, oscuridad);
    noStroke();
    rect(0, 0, width, height);

    dibujarMarcadorPantalla();

    // Transiciones desde la Ciudad:
    if (personaje.x <= 40) {
      estado = 4; // A la Casa
      personaje.x = 520; 
    } else if (personaje.x >= 550) {
      estado = 5; // A la Oficina
      personaje.x = 60; 
    }

  } else if (estado === 4) {
    // 🏠 PANTALLA 4: LA CASA
    escenaActual = 4;
    background(0);
    casa.dibujar();
    personaje.actualizar();

    // Detección del sillón
    let cercaDelSillon = (personaje.x >= 60 && personaje.x <= 280);

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

    push();
    let escala = 2.5; 
    translate(personaje.x * (1 - escala), personaje.y * (1.3 - escala));
    scale(escala);
    personaje.dibujar();
    pop();

    if (!juegoTerminado) {
      let tiempoTranscurrido = floor((millis() - tiempoInicio) / 1000);
      tiempoRestante = tiempoTotal - tiempoTranscurrido;

      if (tiempoRestante <= 0) {
        tiempoRestante = 0;
        juegoTerminado = true;
        estado = 7;
      }
    }

    dibujarMarcadorPantalla();

    if (personaje.x >= 550) {
      estado = 3;
      personaje.x = 80;
    }

  } else if (estado === 5) {
    // 🏢 PANTALLA 5: LA OFICINA
    escenaActual = 5;
    background(0);
    oficina.dibujar();
    
    personaje.actualizar();

    let cercaDelEscritorio = (personaje.x >= 200 && personaje.x <= 420);

    if (cercaDelEscritorio && personaje.estado !== "TRABAJANDO" && personaje.estado !== "DERROTADO") {
      push();
      fill(0, 255, 255);
      stroke(0);
      strokeWeight(2);
      textSize(10);
      textAlign(CENTER);
      text("Presioná 'M' para Trabajar", personaje.x, personaje.y -82);
      pop();
    }

    let limitePesos = 50; 

    if (personaje.estado === "TRABAJANDO") {
      if (pesosDisponibles < limitePesos) {
        if (frameCount % 30 === 0) { 
          pesosDisponibles += 5;
        }
      }
    }
    
    push();
    let escala = 3.5; 
    translate(personaje.x * (1 - escala), personaje.y * (1.4 - escala));
    scale(escala);
    personaje.dibujar();
    pop();

    if (!juegoTerminado) {
      let tiempoTranscurrido = floor((millis() - tiempoInicio) / 1000);
      tiempoRestante = tiempoTotal - tiempoTranscurrido;

      if (tiempoRestante <= 0) {
        tiempoRestante = 0;
        juegoTerminado = true;
        estado = 7;
      }
    }

    if (personaje.x <= 40) {
      estado = 3;
      personaje.x = 520; 
    }

    dibujarMarcadorPantalla();

  } else if (estado === 6 || estado === 7) {
    // ☠️/🏆 PANTALLAS FINALES (GAME OVER O GANASTE)

    // 1. Dibujar el fondo donde estaba el personaje
    if (escenaActual === 4) {
      background(0);
      casa.dibujar();
    } else if (escenaActual === 5) {
      background(0);
      oficina.dibujar();
    } else {
      background(90, 140, 170);
      ciudad.dibujar();
    }

    // 2. Corregir pose y posición según si ganó o perdió
    if (estado === 6) {
      personaje.estado = "DERROTADO";
      personaje.estadoBase = "DERROTADO";
    } else if (estado === 7) {
      personaje.estado = "NORMAL";
      personaje.estadoBase = "NORMAL";
      personaje.y = sueloY; // Se asegura de estar parado erguido
    }

    // 3. Dibujar al personaje respetando escala de la habitación
    push();
    if (escenaActual === 4) {
      let escala = 2.5;
      translate(personaje.x * (1 - escala), personaje.y * (1.3 - escala));
      scale(escala);
    } else if (escenaActual === 5) {
      let escala = 3.5;
      translate(personaje.x * (1 - escala), personaje.y * (1.4 - escala));
      scale(escala);
    }
    personaje.dibujar(estado);
    pop();

    // 4. Cartel y botones encima
    dibujarPantallaFinal(); 
  }
}

function mousePressed() {
  if (estado === 2 && interfaz.mouseSobreBoton()) {
    cursor(ARROW); 
    iniciarJuego();
    estado = 3;
  }
  
  if (estado === 6 || estado === 7) {
    if (
      mouseX >= width / 2 - 100 &&
      mouseX <= width / 2 + 100 &&
      mouseY >= 235 &&
      mouseY <= 280
    ) {
      iniciarJuego();
      estado = 3;
    }

    if (
      mouseX >= width / 2 - 100 &&
      mouseX <= width / 2 + 100 &&
      mouseY >= 295 &&
      mouseY <= 340
    ) {
      estado = 2;
    }
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

  if (estado === 5) {
    if ((key === 'm' || key === 'M') && personaje.estado !== "DERROTADO") {
      if (personaje.estado === "TRABAJANDO") {
        personaje.x = 220; 
        personaje.levantarseDeTrabajar();
      } else if (personaje.x >= 200 && personaje.x <= 420) {
        personaje.x = 320; 
        personaje.trabajar();
      }
    }
  }

  if (estado === 3) {
    if (keyCode === 32 && pesosDisponibles > 0 && personaje.estado !== "DERROTADO") {
      disparos.push(new Disparo(personaje.x, personaje.y - 80));
      pesosDisponibles -= 5;
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

function dibujarPantallaFinal() {
  push();

  fill(0, 0, 0, 150);
  noStroke();
  rect(0, 0, width, height);

  textAlign(CENTER, CENTER);

  if (estado === 6) {
    fill(255, 30, 30);
    textSize(42);
    textStyle(BOLD);
    text("GAME OVER", width / 2, 100);

    fill(255);
    textSize(15);
    textStyle(NORMAL);
    text("EL SISTEMA TE DEJÓ SIN NADA", width / 2, 150);

  } else {
    fill(0, 255, 55);
    textSize(42);
    textStyle(BOLD);
    text("¡GANASTE!", width / 2, 100);

    fill(255);
    textSize(15);
    textStyle(NORMAL);
    text("SOBREVIVISTE AL SISTEMA", width / 2, 150);
  }

  fill(0, 255, 255);
  textSize(13);
  text(`DEUDAS LIQUIDADAS: ${deudasLiquidadas}`, width / 2, 190);

  fill(0, 255, 55);
  rect(width / 2 - 100, 235, 200, 45, 5);

  fill(0);
  textSize(13);
  text("VOLVER A JUGAR", width / 2, 258);

  fill(255, 30, 30);
  rect(width / 2 - 100, 295, 200, 45, 5);

  fill(255);
  text("SALIR", width / 2, 318);

  pop();
}