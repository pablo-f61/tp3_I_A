// =================================================================
// ⏱️ 1. VARIABLES GLOBALES DE TIEMPO Y ESTADO
// =================================================================
let tiempoTotal = 180;        // Duración total de la partida: 3 minutos (180 seg)
let tiempoRestante = tiempoTotal; 
let tiempoInicio;             // Guarda el timestamp con millis() al iniciar
let juegoTerminado = false;   // Controla si la partida sigue en curso

// Máquina de Estados principal (Controla qué pantalla se dibuja):
// 2 = Instrucciones / 3 = Ciudad / 4 = Casa / 5 = Oficina / 6 = Game Over / 7 = Ganaste
let estado = 2; 
let escenaActual = 3;         // Guarda la última ubicación (Casa, Oficina o Ciudad) para el fondo del Game Over

// =================================================================
// 🖼️ 2. FONDOS, ENTIDADES Y RECURSOS GRÁFICOS
// =================================================================
let imagenEscena1, imgCasaInterior, imgOficina, imgInstrucciones;
let ciudad, casa, oficina, interfaz, personaje;

// Sprites e imágenes del personaje y proyectiles
let imgPersonajeMano, imgPersonajeSentado, imgPersonajeTrabajando;
let fotoPiso, fotoDisparo;
let fotosCaminante = [];        // Array para la animación de caminar
let fotosCaminanteCaido = [];   // Array para la animación de derrota

// Listas dinámicas para la física del juego
let deudas = [];    // Guarda los enemigos que caen
let disparos = [];  // Guarda los proyectiles lanzados

let sueloY = 460;   // Altura base del suelo para el personaje

// =================================================================
// 💰 VARIABLES DEL JUEGO Y OBJETIVOS
// =================================================================
let saludFinanciera = 100; 
let pesosDisponibles = 50; 

let deudasLiquidadas = 0;   // Contador de deudas eliminadas
let deudasParaGanar = 50;   // Meta necesaria para ganar


// =================================================================
// 📥 4. CARGA PREVIA DE ARCHIVOS (PRELOAD)
// =================================================================
function preload() {
  // Carga de imágenes fijas de escenarios e interfaz
  imagenEscena1 = loadImage('img/escena1.png');
  imgCasaInterior = loadImage('img/casa-1.png');
  imgInstrucciones = loadImage("img/instrucciones.png");
  imgOficina = loadImage("img/ofi-1.png");
  
  // Carga de imágenes de poses del personaje
  imgPersonajeMano = loadImage('img/man-1.png'); 
  imgPersonajeTrabajando = loadImage('img/senta-2.png');
  imgPersonajeSentado = loadImage('img/sentado.png'); 
  fotoPiso = loadImage('img/piso.png');
  fotoDisparo = loadImage('img/disparo.png');

  // Carga cíclica de frames para animaciones mediante bucles FOR
  fotosCaminante = []; 
  for (let i = 1; i <= 8; i++) {
    fotosCaminante.push(loadImage(`img/c_${i}.png`));
  }

  fotosCaminanteCaido = [];
  for (let i = 1; i <= 5; i++) {
    fotosCaminanteCaido.push(loadImage(`img/cai_${i}.png`));
  }
}


// =================================================================
// ⚙️ 5. CONFIGURACIÓN INICIAL (SETUP)
// =================================================================
function setup() {
  createCanvas(600, 410);

  // Instanciación de las clases principales del juego
  ciudad = new Ciudad(imagenEscena1);
  casa = new Casa(imgCasaInterior);
  oficina = new Oficina(imgOficina); 
  interfaz = new Interfaz();
  
  // Creación del jugador enviando todas sus animaciones al constructor
  personaje = new Personaje1(
    300, sueloY, 
    fotosCaminante, fotosCaminanteCaido, 
    fotoDisparo, fotoPiso, 
    imgPersonajeMano, imgPersonajeSentado
  );

  personaje.imgPersonajeTrabajando = imgPersonajeTrabajando;
}


// =================================================================
// 🔄 6. REINICIO Y RESETEO DE VARIABLES (INICIAR JUEGO)
// =================================================================
function iniciarJuego() {
  // Reseteo del reloj y variables de estado
  tiempoRestante = tiempoTotal;
  tiempoInicio = millis(); 
  juegoTerminado = false;
  
  // Reseteo de contadores y arreglos
  saludFinanciera = 100;
  deudasLiquidadas = 0;
  pesosDisponibles = 50;
  deudas = [];
  disparos = [];
  
  // Reseteo de ubicación y pose del jugador
  if (personaje) {
    personaje.x = 300;
    personaje.y = sueloY;
    personaje.estado = "NORMAL";
    personaje.estadoBase = "NORMAL";
  }

  estado = 2; // Vuelve al menú de instrucciones
}


// =================================================================
// 🎨 7. BUCLE PRINCIPAL DE DIBUJO (DRAW)
// =================================================================
function draw() {

  // ---------------------------------------------------------------
  // 📜 PANTALLA 2: INSTRUCCIONES
  // ---------------------------------------------------------------
  if (estado === 2) {
    background(0);
    if (imgInstrucciones) {
      image(imgInstrucciones, 0, 0, width, height);
    }
    interfaz.mostrarInstrucciones(imgInstrucciones);
    
  // ---------------------------------------------------------------
  // 🎮 PANTALLA 3: LA CIUDAD (Escenario de Acción/Disparo)
  // ---------------------------------------------------------------
  } else if (estado === 3) {
    escenaActual = 3;
    background(90, 140, 170);
    ciudad.dibujar();
    
    personaje.actualizar();
    personaje.dibujar(estado);

    // ⏱️ Actualización del cronómetro
    if (!juegoTerminado) {
      let tiempoTranscurrido = floor((millis() - tiempoInicio) / 1000);
      tiempoRestante = tiempoTotal - tiempoTranscurrido;

      if (tiempoRestante <= 0) {
        tiempoRestante = 0;
        juegoTerminado = true;
        estado = 6; // Derrotado, se terminó su tiempo
      }
    }

    // 🌧️ Generación continua de Deudas (cada 120 frames = ~2 segundos)
    if (frameCount % 120 === 0 && personaje.estado !== "DERROTADO") {
      deudas.push(new Deuda(width));
    }

    // 💥 Gestión de Deudas (Colisión con el personaje)
    for (let i = deudas.length - 1; i >= 0; i--) {
      deudas[i].actualizar();
      deudas[i].dibujar();
   
      if (deudas[i].verificarColision(personaje)) {
        saludFinanciera -= 20; // Pierde vida al ser impactado
        
        if (saludFinanciera === 40) {
          personaje.estadoBase = "AGACHADO";
          personaje.estado = "AGACHADO";
        } else if (saludFinanciera <= 0) {
          saludFinanciera = 0;
          personaje.estado = "DERROTADO";
          personaje.estadoBase = "DERROTADO";
          personaje.y = sueloY; 
          juegoTerminado = true;
          estado = 6; // Game Over
        }
      }

      // Eliminar deudas que salen de pantalla por abajo
      if (deudas[i].y > height + 50) {
        deudas.splice(i, 1);
      }
    }


    // 🎯 Gestión de Disparos e Impactos contra Deudas
    for (let k = disparos.length - 1; k >= 0; k--) {
      disparos[k].actualizar();
      disparos[k].dibujar();

      for (let j = deudas.length - 1; j >= 0; j--) {
        if (disparos[k].verificarImpacto(deudas[j])) {
          deudasLiquidadas += 1; 
          deudas.splice(j, 1);   
          
          // 🏆 CONDICIÓN DE VICTORIA: Llegar a 50 deudas liquidadas
          if (deudasLiquidadas >= 10) {
            juegoTerminado = true;
            estado = 7; // ¡GANASTE!
          }
          break;                  
        }
      }

      // Eliminar disparos inactivos o fuera de pantalla
      if (disparos[k] && (!disparos[k].activo || disparos[k].y < -20)) {
        disparos.splice(k, 1);
      }
    }

    // 🌆 Filtro de oscurecimiento progresivo según avanza el tiempo
    let oscuridad = map(tiempoRestante, tiempoTotal, 0, 0, 180);
    fill(0, oscuridad);
    noStroke();
    rect(0, 0, width, height);

    dibujarMarcadorPantalla();

    // 🚪 Puertas de cambio de escenario (Límites de la pantalla)
    if (personaje.x <= 40) {
      estado = 4; // Entrar a la Casa (Lado izquierdo)
      personaje.x = 520; 
    } else if (personaje.x >= 550) {
      estado = 5; // Entrar a la Oficina (Lado derecho)
      personaje.x = 60; 
    }

  // ---------------------------------------------------------------
  // 🏠 PANTALLA 4: LA CASA (Recuperación de Salud)
  // ---------------------------------------------------------------
  } else if (estado === 4) {
    escenaActual = 4;
    background(0);
    casa.dibujar();
    personaje.actualizar();

    // 🛋️ Zona Interactiva: Sillón
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

    // Recupera Salud Financiera gradualmente estando sentado
    if (personaje.estado === "SENTADO") {
      if (frameCount % 30 === 0 && saludFinanciera < 100) {
        saludFinanciera = min(100, saludFinanciera + 5);
        if (saludFinanciera > 50) personaje.estadoBase = "NORMAL";
      }
    }

    // Dibujado del personaje con cambio de escala para el interior
    push();
    let escala = 2.5; 
    translate(personaje.x * (1 - escala), personaje.y * (1.3 - escala));
    scale(escala);
    personaje.dibujar();
    pop();

    // Control de tiempo en interiores
    if (!juegoTerminado) {
      let tiempoTranscurrido = floor((millis() - tiempoInicio) / 1000);
      tiempoRestante = tiempoTotal - tiempoTranscurrido;
      if (tiempoRestante <= 0) {
        tiempoRestante = 0;
        juegoTerminado = true;
        estado = 6;
      }
    }

    dibujarMarcadorPantalla();

    // Salida hacia la ciudad
    if (personaje.x >= 550) {
      estado = 3;
      personaje.x = 80;
    }

  // ---------------------------------------------------------------
  // 🏢 PANTALLA 5: LA OFICINA (Recuperación de Dinero / Pesos)
  // ---------------------------------------------------------------
  } else if (estado === 5) {
    escenaActual = 5;
    background(0);
    oficina.dibujar();
    personaje.actualizar();

    // 💻 Zona Interactiva: Escritorio
    let cercaDelEscritorio = (personaje.x >= 200 && personaje.x <= 420);

    if (cercaDelEscritorio && personaje.estado !== "TRABAJANDO" && personaje.estado !== "DERROTADO") {
      push();
      fill(0, 255, 255);
      stroke(0);
      strokeWeight(2);
      textSize(10);
      textAlign(CENTER);
      text("Presioná 'M' para Trabajar", personaje.x, personaje.y - 82);
      pop();
    }

    // Genera Pesos gradualmente si el personaje trabaja
    let limitePesos = 50; 
    if (personaje.estado === "TRABAJANDO" && pesosDisponibles < limitePesos) {
      if (frameCount % 30 === 0) pesosDisponibles += 5;
    }
    
    // Dibujado escalado para la oficina
    push();
    let escala = 3.5; 
    translate(personaje.x * (1 - escala), personaje.y * (1.4 - escala));
    scale(escala);
    personaje.dibujar();
    pop();

    // Control de tiempo en interiores
    if (!juegoTerminado) {
      let tiempoTranscurrido = floor((millis() - tiempoInicio) / 1000);
      tiempoRestante = tiempoTotal - tiempoTranscurrido;
      if (tiempoRestante <= 0) {
        tiempoRestante = 0;
        juegoTerminado = true;
        estado = 7;
      }
    }

    // Salida hacia la ciudad
    if (personaje.x <= 40) {
      estado = 3;
      personaje.x = 520; 
    }

    dibujarMarcadorPantalla();

  // ---------------------------------------------------------------
  // 🏆 / 💀 PANTALLAS FINALIZADORAS (ESTADOS 6 Y 7: DERROTA / VICTORIA)
  // ---------------------------------------------------------------
  } else if (estado === 6 || estado === 7) {
    // 1. Dibujar el fondo según la última ubicación registrada
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

    // 2. Aplicar la pose correspondiente
    if (estado === 6) {
      personaje.estado = "DERROTADO";
      //personaje.estadoBase = "DERROTADO";
    } else {
      //personaje.estado = "NORMAL";
      //personaje.estadoBase = "NORMAL";
      personaje.estado = "DERROTADO";
    }

    // 3. Dibujar al personaje respetando la perspectiva de la habitación
    push();
    if (escenaActual === 4) {
      let escala = 2.5;
      personaje.y = 490; // Bajamos la posición Y para tocar el piso de la casa
      translate(personaje.x * (1 - escala), personaje.y * (1.3 - escala));
      scale(escala);
    } else if (escenaActual === 5) {
      let escala = 3.5;
      personaje.y = 490;
      translate(personaje.x * (1 - escala), personaje.y * (1.4 - escala));
      scale(escala);
    }else {
      // 🌆 LA CIUDAD (Escala Normal)
      personaje.y = sueloY; // Usa la Y nativa de la ciudad
    }
    personaje.dibujar(estado);
    pop();

    // 4. Cartel de Game Over/Victoria y botones sobrepuestos
    dibujarPantallaFinal(); 
  }
}


// =================================================================
// 🖱️ 8. EVENTOS DE MOUSE (INTERFACES Y BOTONES)
// =================================================================
function mousePressed() {
  // Clic para iniciar desde las Instrucciones
  if (estado === 2 && interfaz.mouseSobreBoton()) {
    cursor(ARROW); 
    iniciarJuego();
    estado = 3;
  }
  
  // Clics en la pantalla de Game Over / Victoria
  if (estado === 6 || estado === 7) {
    // Botón: VOLVER A JUGAR
    if (mouseX >= width / 2 - 100 && mouseX <= width / 2 + 100 &&
        mouseY >= 235 && mouseY <= 280) {
      iniciarJuego();
      estado = 3;
    }

    // Botón: SALIR (Volver al Menú de Instrucciones)
    if (mouseX >= width / 2 - 100 && mouseX <= width / 2 + 100 &&
        mouseY >= 295 && mouseY <= 340) {
      estado = 2;
    }
  }
}


// =================================================================
// ⌨️ 9. EVENTOS DE TECLADO (ACCIONES DEL JUGADOR)
// =================================================================
function keyPressed() {
  // Tecla 'R': Reinicio rápido
  if (key === 'r' || key === 'R') {
    iniciarJuego();
  }

  // Interacciones en LA CASA (Estado 4)
  if (estado === 4 && (key === 's' || key === 'S')) {
    if (personaje.estado === "SENTADO") {
      personaje.x = 180; 
      personaje.levantarse();
    } else if (personaje.x >= 60 && personaje.x <= 280) {
      personaje.sentarse();
    }
  }

  // Interacciones en LA OFICINA (Estado 5)
  if (estado === 5 && (key === 'm' || key === 'M') && personaje.estado !== "DERROTADO") {
    if (personaje.estado === "TRABAJANDO") {
      personaje.x = 220; 
      personaje.levantarseDeTrabajar();
    } else if (personaje.x >= 200 && personaje.x <= 420) {
      personaje.x = 320; 
      personaje.trabajar();
    }
  }

  // Disparo en LA CIUDAD (Estado 3) - Tecla Espacio (keyCode 32)
  if (estado === 3 && keyCode === 32 && pesosDisponibles > 0 && personaje.estado !== "DERROTADO") {
    disparos.push(new Disparo(personaje.x, personaje.y - 80));
    pesosDisponibles -= 5; // Consume pesos como munición
  }
}


// =================================================================
// 📊 10. FUNCIONES AUXILIARES DE INTERFAZ (HUD)
// =================================================================

// Dibujo de la tarjeta superior izquierda de estado (HUD)
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

// Dibujo del popup de menú final (Victoria o Derrota)
function dibujarPantallaFinal() {
  push();

  // Velo oscuro semitransparente sobre el fondo
  fill(0, 0, 0, 150);
  noStroke();
  rect(0, 0, width, height);

  textAlign(CENTER, CENTER);

  // Cartel principal
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

  // Resumen del jugador
  fill(0, 255, 255);
  textSize(13);
  text(`DEUDAS LIQUIDADAS: ${deudasLiquidadas}`, width / 2, 190);

  // Botón "Volver a Jugar"
  fill(0, 255, 55);
  rect(width / 2 - 100, 235, 200, 45, 5);
  fill(0);
  textSize(13);
  text("VOLVER A JUGAR", width / 2, 258);

  // Botón "Salir"
  fill(255, 30, 30);
  rect(width / 2 - 100, 295, 200, 45, 5);
  fill(255);
  text("SALIR", width / 2, 318);

  pop();
}