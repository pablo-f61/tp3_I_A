// ============================================================
// LA GRAN CIUDAD
// INFORMÁTICA APLICADA I
// ============================================================
//
// sketch.js
//
// Este archivo controla:
// - Estados y pantallas
// - Nombre del jugador
// - Créditos
// - Instrucciones
// - Ciudad
// - Casa
// - Oficina
// - Game Over
// - Tabla de puntajes
// - Tiempo
// - Puntaje
// - Interacción del mouse y teclado
//
// Las clases Ciudad, Casa, Oficina, Personaje, Deuda,
// Disparo, Interfaz y TablaPuntajes se encuentran en
// los otros archivos del proyecto.
//
// ============================================================


// ============================================================
// VARIABLES DEL JUEGO
// ============================================================

let saludMental = 100;

let deudasLiquidadas = 0;

let pesosDisponibles = 30;


// ============================================================
// TIEMPO Y ESTADO DE LA PARTIDA
// ============================================================

let tiempoSobrevivido = 0;
let tiempoInicio = 0;
let juegoTerminado = false;
let motivoFin = "";

let momentoDerrota = 0;


// ============================================================
// CANVAS
// ============================================================

let lienzoCanvas;


// ============================================================
// FONDOS Y ESCENAS
// ============================================================

let imagenEscena1;

let ciudad;
let casa;
let oficina;

let imgOficina;
let imgCasaInterior;


// ============================================================
// PERSONAJE
// ============================================================

let personaje;

let imgPersonajeMano;
let imgPersonajeSentado;
let imgPersonajeTrabajando;

let fotoPiso;
let fotoDisparo;

let fotosCaminante = [];
let fotosCaminanteCaido = [];


// ============================================================
// BANQUERO
// ============================================================

let imgBanquero;

let banqueroX = 400;

let banqueroVelocidad = 3;

let proximoAmague = 0;

let banqueroLimiteIzquierdo = 50;

let banqueroLimiteDerecho = 430;


// ============================================================
// VELERO
// ============================================================

let imgVelero;


// ============================================================
// INTERFAZ
// ============================================================

let interfaz;

let imgInstrucciones;


// ============================================================
// ENTIDADES
// ============================================================

let deudas = [];

let disparos = [];


// ============================================================
// PARTÍCULAS
// ============================================================

let particulasDinero = [];


// ============================================================
// PUNTAJE
// ============================================================

let puntosPorLiquidacion = 100;

let puntosPorTrabajo = 10;

let puntosPorDescanso = 10;

let puntuacion = 0;

let ultimoTickTrabajo = -1;

let ultimoTickDescanso = -1;


// ============================================================
// JUGADOR
// ============================================================

let nombreJugador = "";

let tablaPuntajes;


// ============================================================
// INPUT DE NOMBRE
// ============================================================

let inputNombre;

let botonNombre;


// ============================================================
// CONFIGURACIÓN
// ============================================================

let sueloY = 460;


// ============================================================
// ESTADOS DEL JUEGO
// ============================================================
//
// 1 = Nombre
// 2 = Instrucciones
// 3 = Ciudad
// 4 = Casa
// 5 = Oficina
// 6 = Game Over
// 8 = Tabla de puntajes
// 9 = Créditos
//
// ============================================================

let estado = 1;

let escenaActual = 3;

// ----------------------------------------------------------
// TIEMPO DE JUEGO
// ----------------------------------------------------------

let tiempoLimite = 180; // 180 segundos = 3 minutos


// ============================================================
// PRELOAD
// ============================================================

function preload() {

  // ----------------------------------------------------------
  // ESCENARIOS
  // ----------------------------------------------------------

  imagenEscena1 =
    loadImage(
      'img/escena1.png'
    );


  imgCasaInterior =
    loadImage(
      'img/casa-1.png'
    );


  imgInstrucciones =
    loadImage(
      'img/instrucciones.png'
    );


  imgOficina =
    loadImage(
      'img/ofi-1.png'
    );


  // ----------------------------------------------------------
  // BANQUERO
  // ----------------------------------------------------------

  imgBanquero =
    loadImage(
      'img/banquero.png'
    );


  // ----------------------------------------------------------
  // VELERO
  // ----------------------------------------------------------

  imgVelero =
    loadImage(
      'img/velero.png'
    );


  // ----------------------------------------------------------
  // PERSONAJE
  // ----------------------------------------------------------

  imgPersonajeMano =
    loadImage(
      'img/man-1.png'
    );


  imgPersonajeTrabajando =
    loadImage(
      'img/senta-2.png'
    );


  imgPersonajeSentado =
    loadImage(
      'img/sentado.png'
    );


  fotoPiso =
    loadImage(
      'img/piso.png'
    );


  fotoDisparo =
    loadImage(
      'img/disparo.png'
    );


  // ----------------------------------------------------------
  // ANIMACIÓN NORMAL
  // ----------------------------------------------------------

  fotosCaminante = [];


  for (
    let i = 1;
    i <= 8;
    i++
  ) {

    fotosCaminante.push(
      loadImage(
        `img/c_${i}.png`
      )
    );
  }


  // ----------------------------------------------------------
  // ANIMACIÓN AGACHADO
  // ----------------------------------------------------------

  fotosCaminanteCaido = [];


  for (
    let i = 1;
    i <= 5;
    i++
  ) {

    fotosCaminanteCaido.push(
      loadImage(
        `img/cai_${i}.png`
      )
    );
  }
}


// ============================================================
// SETUP
// ============================================================

function setup() {

  // ----------------------------------------------------------
  // CANVAS
  // ----------------------------------------------------------

  lienzoCanvas =
    createCanvas(
      600,
      410
    );


  // ----------------------------------------------------------
  // ESCENARIOS
  // ----------------------------------------------------------

  ciudad =
    new Ciudad(
      imagenEscena1,
      imgVelero
    );


  casa =
    new Casa(
      imgCasaInterior
    );


  oficina =
    new Oficina(
      imgOficina
    );


  // ----------------------------------------------------------
  // INTERFAZ
  // ----------------------------------------------------------

  interfaz =
    new Interfaz();


  // ----------------------------------------------------------
  // PERSONAJE
  // ----------------------------------------------------------

  personaje =
    new Personaje(
      300,
      sueloY,
      fotosCaminante,
      fotosCaminanteCaido,
      fotoDisparo,
      fotoPiso,
      imgPersonajeMano,
      imgPersonajeSentado
    );


  personaje.imgPersonajeTrabajando =
    imgPersonajeTrabajando;


  // ----------------------------------------------------------
  // TABLA DE PUNTAJES
  // ----------------------------------------------------------

  tablaPuntajes =
    new TablaPuntajes();


  // ----------------------------------------------------------
  // BANQUERO
  // ----------------------------------------------------------

  banqueroX = 400;

  banqueroVelocidad = 3;

  proximoAmague =
    frameCount +
    random(
      120,
      240
    );


  // ----------------------------------------------------------
  // PANTALLA INICIAL
  // ----------------------------------------------------------

  crearInputNombre();
}


// ============================================================
// POSICIONAR INPUT DE NOMBRE
// ============================================================

function posicionarInputNombre() {

  if (
    !lienzoCanvas ||
    !inputNombre ||
    !botonNombre
  ) {

    return;
  }


  let rectCanvas =
    lienzoCanvas.elt.getBoundingClientRect();


  let scrollX =
    window.scrollX ||
    window.pageXOffset ||
    0;


  let scrollY =
    window.scrollY ||
    window.pageYOffset ||
    0;


  let centroX =
    rectCanvas.left +
    scrollX +
    rectCanvas.width / 2;


  inputNombre.position(
    centroX - 90,
    rectCanvas.top +
    scrollY +
    205
  );


  botonNombre.position(
    centroX - 60,
    rectCanvas.top +
    scrollY +
    250
  );
}


// ============================================================
// CREAR INPUT DE NOMBRE
// ============================================================

function crearInputNombre() {

  eliminarInputNombre();


  inputNombre =
    createInput("");


  inputNombre.attribute(
    "maxlength",
    "12"
  );


  inputNombre.attribute(
    "placeholder",
    "TU NOMBRE"
  );


  inputNombre.style(  
    "font-size",
    "18px"
  );


  inputNombre.style(
    "text-align",
    "center"
  );


  inputNombre.style(
    "width",
    "180px"
  );


  botonNombre =
    createButton(
      "JUGAR"
    );


  botonNombre.style(
    "font-size",
    "16px"
  );


  botonNombre.style(
    "width",
    "120px"
  );


  posicionarInputNombre();


  botonNombre.mousePressed(
    confirmarNombre
  );


  inputNombre.elt.addEventListener(
    "keydown",
    function(event) {

      if (
        event.key === "Enter"
      ) {

        confirmarNombre();
      }
    }
  );
}


// ============================================================
// REPOSICIONAR AL CAMBIAR TAMAÑO
// ============================================================

function windowResized() {

  posicionarInputNombre();
}


// ============================================================
// ELIMINAR INPUT
// ============================================================

function eliminarInputNombre() {

  if (inputNombre) {

    inputNombre.remove();

    inputNombre = null;
  }


  if (botonNombre) {

    botonNombre.remove();

    botonNombre = null;
  }
}


// ============================================================
// CONFIRMAR NOMBRE
// ============================================================

function confirmarNombre() {

  if (!inputNombre) {

    return;
  }


  let nombre =
    inputNombre.value()
      .trim()
      .toUpperCase();


  if (
    nombre.length === 0
  ) {

    inputNombre.value("");

    return;
  }


  nombreJugador =
    nombre;


  eliminarInputNombre();


  // ----------------------------------------------------------
  // DESPUÉS DEL NOMBRE VAMOS A CRÉDITOS
  // ----------------------------------------------------------

  estado = 9;
}


// ============================================================
// INICIAR JUEGO
// ============================================================

function iniciarJuego() {

  // ----------------------------------------------------------
  // TIEMPO DE ESTA PARTIDA
  // ----------------------------------------------------------

  tiempoSobrevivido = 0;

  tiempoInicio =
    millis();

  juegoTerminado = false;

  motivoFin = "";


  // ----------------------------------------------------------
  // VARIABLES DE ESTA PARTIDA
  // ----------------------------------------------------------

  saludMental = 100;

  deudasLiquidadas = 0;

  puntuacion = 0;

  pesosDisponibles = 50;


  // ----------------------------------------------------------
  // ENTIDADES
  // ----------------------------------------------------------

  deudas = [];

  disparos = [];

  particulasDinero = [];


  // ----------------------------------------------------------
  // REINICIAR BANQUERO
  // ----------------------------------------------------------

  banqueroX = 400;

  banqueroVelocidad = 3;

  proximoAmague =
    frameCount +
    random(
      120,
      240
    );


  // ----------------------------------------------------------
  // REINICIAR PERSONAJE
  // ----------------------------------------------------------

  if (personaje) {

    personaje.x = 300;

    personaje.y =
      sueloY;

    personaje.vx = 0;

    personaje.estado =
      "NORMAL";

    personaje.estadoBase =
      "NORMAL";

    personaje.frameActual = 0;

    personaje.direccion = 1;

    personaje.vivo = true;

    personaje.danioActivo = false;
  }


  // ----------------------------------------------------------
  // ESCENA INICIAL
  // ----------------------------------------------------------

  escenaActual = 3;

  estado = 3;
}


// ============================================================
// ACTUALIZAR TIEMPO
// ============================================================

function actualizarTiempo() {

  if (juegoTerminado) return;


  tiempoSobrevivido = floor(
    (millis() - tiempoInicio) / 1000
  );


  // --------------------------------------------------------
  // TIEMPO AGOTADO → EL PERSONAJE CAE
  // --------------------------------------------------------

  if (
    tiempoSobrevivido >= tiempoLimite &&
    !juegoTerminado &&
    personaje.estado !== "DERROTADO"
  ) {

    motivoFin = "tiempo";

    personaje.y =
      personaje.sueloY + 40;

    personaje.estado =
      "DERROTADO";

    personaje.vx = 0;

    momentoDerrota =
      millis();
  }


  // --------------------------------------------------------
  // DESPUÉS DE LA CAÍDA → GAME OVER
  // --------------------------------------------------------

  if (
    personaje.estado === "DERROTADO" &&
    momentoDerrota > 0 &&
    millis() - momentoDerrota >= 1000 &&
    !juegoTerminado
  ) {

    terminarJuego();
  }
}

// ============================================================
// ACTUALIZAR BANQUERO
// ============================================================

function actualizarBanquero() {

  // ----------------------------------------------------------
  // MOVIMIENTO NORMAL
  // ----------------------------------------------------------

  banqueroX +=
    banqueroVelocidad;


  // ----------------------------------------------------------
  // LÍMITE IZQUIERDO
  // ----------------------------------------------------------

  if (
    banqueroX <=
    banqueroLimiteIzquierdo
  ) {

    banqueroX =
      banqueroLimiteIzquierdo;

    banqueroVelocidad =
      abs(
        banqueroVelocidad
      );
  }


  // ----------------------------------------------------------
  // LÍMITE DERECHO
  // ----------------------------------------------------------

  if (
    banqueroX >=
    banqueroLimiteDerecho
  ) {

    banqueroX =
      banqueroLimiteDerecho;

    banqueroVelocidad =
      -abs(
        banqueroVelocidad
      );
  }


  // ----------------------------------------------------------
  // AMAGUE
  // ----------------------------------------------------------

  if (
    frameCount >=
    proximoAmague
  ) {

    banqueroVelocidad *=
      -1;


    proximoAmague =
      frameCount +
      random(
        120,
        240
      );
  }
}


// ============================================================
// DIBUJAR BANQUERO
// ============================================================

function dibujarBanquero() {

  if (!imgBanquero) {

    return;
  }


  push();


  imageMode(
    CORNER
  );


  image(
    imgBanquero,
    banqueroX,
    50,
    120,
    120
  );


  pop();
}


// ============================================================
// DRAW
// ============================================================

function draw() {

  // ==========================================================
  // ESTADO 1 — NOMBRE
  // ==========================================================

  if (
    estado === 1
  ) {

    dibujarPantallaNombre();

    return;
  }


  // ==========================================================
  // ESTADO 9 — CRÉDITOS
  // ==========================================================

  if (
    estado === 9
  ) {

    pantallaCreditos();

    return;
  }


  // ==========================================================
  // ESTADO 2 — INSTRUCCIONES
  // ==========================================================

  if (
    estado === 2
  ) {

    background(0);


    if (imgInstrucciones) {

      image(
        imgInstrucciones,
        0,
        0,
        width,
        height
      );
    }


    interfaz.mostrarInstrucciones(
      imgInstrucciones
    );


    return;
  }


  // ==========================================================
  // ESTADO 8 — TABLA DE PUNTAJES
  // ==========================================================

  if (
    estado === 8
  ) {

    dibujarTablaPuntajes();

    return;
  }


  // ==========================================================
  // ACTUALIZAR TIEMPO
  // ==========================================================

 actualizarTiempo();


if (juegoTerminado) {
  dibujarPantallaFinal();
}

  // ==========================================================
  // ESTADO 3 — CIUDAD
  // ==========================================================

  if (
    estado === 3
  ) {

    escenaActual = 3;


    background(
      90,
      140,
      170
    );


    ciudad.dibujar();


    // --------------------------------------------------------
    // BANQUERO
    // --------------------------------------------------------

    if (
      !juegoTerminado
    ) {

      actualizarBanquero();
    }


    dibujarBanquero();


    // --------------------------------------------------------
    // PERSONAJE
    // --------------------------------------------------------

    personaje.actualizar();

    personaje.dibujar();


    // --------------------------------------------------------
    // GASTOS
    // --------------------------------------------------------

    actualizarCiudad();


    // --------------------------------------------------------
    // OSCURECIMIENTO
    // --------------------------------------------------------

    dibujarOscurecimiento();


    // --------------------------------------------------------
    // MARCADOR
    // --------------------------------------------------------

    dibujarMarcadorPantalla();


    // --------------------------------------------------------
    // PARTÍCULAS
    // --------------------------------------------------------

    dibujarParticulas();


    // --------------------------------------------------------
    // TRANSICIONES
    // --------------------------------------------------------

    if (
      !juegoTerminado
    ) {

      verificarTransicionesCiudad();
    }
  }


  // ==========================================================
  // ESTADO 4 — CASA
  // ==========================================================

  else if (
    estado === 4
  ) {

    escenaActual = 4;


    background(0);

    casa.dibujar();


    personaje.actualizar();

    actualizarCasa();


    push();


    let escala = 2.5;


    translate(
      personaje.x *
      (1 - escala),

      personaje.y *
      (1.3 - escala)
    );


    scale(
      escala
    );


    personaje.dibujar();


    pop();


    dibujarMarcadorPantalla();

    dibujarParticulas();


    if (
      !juegoTerminado &&
      personaje.x >= 550
    ) {

      estado = 3;

      personaje.x = 80;

      personaje.vx = 0;
    }
  }


  // ==========================================================
  // ESTADO 5 — OFICINA
  // ==========================================================

  else if (
    estado === 5
  ) {

    escenaActual = 5;


    background(0);

    oficina.dibujar();


    personaje.actualizar();

    actualizarOficina();


    push();


    let escala = 3.5;


    translate(
      personaje.x *
      (1 - escala),

      personaje.y *
      (1.4 - escala)
    );


    scale(
      escala
    );


    personaje.dibujar();


    pop();


    dibujarMarcadorPantalla();

    dibujarParticulas();


    if (
      !juegoTerminado &&
      personaje.x <= 40
    ) {

      estado = 3;

      personaje.x = 520;

      personaje.vx = 0;
    }
  }


  // ==========================================================
  // ESTADO 6 — GAME OVER
  // ==========================================================

  else if (
    estado === 6
  ) {

    dibujarEscenaFinal();

    dibujarPantallaFinal();
  }
}


// ============================================================
// PANTALLA DE NOMBRE
// ============================================================

function dibujarPantallaNombre() {

  background(
    15,
    15,
    20
  );


  push();


  textAlign(
    CENTER,
    CENTER
  );


  fill(
    0,
    255,
    55
  );


  textSize(34);

textFont("Special Elite");

  text(
    "LA GRAN CIUDAD",
    width / 2,
    90
  );


  fill(255);


  textSize(18);

  textStyle(NORMAL);


  text(
    "INGRESÁ TU NOMBRE",
    width / 2,
    150
  );


  fill(
    130
  );


  textSize(12);


  text(
    "Tu récord quedará guardado",
    width / 2,
    330
  );


  pop();
}


// ============================================================
// PANTALLA DE CRÉDITOS
// ============================================================

function pantallaCreditos() {

  background(
    20,
    24,
    30
  );


  push();


  // ----------------------------------------------------------
  // TÍTULO
  // ----------------------------------------------------------

  textFont("Special Elite");

  textAlign(
    CENTER,
    CENTER
  );


  fill(
    217,
    143,
    30
  );


  textSize(32);


  text(
    "CRÉDITOS",
    width / 2,
    60
  );


  // ----------------------------------------------------------
  // UNIVERSIDAD
  // ----------------------------------------------------------

  fill(
    242,
    230,
    206
  );


  textSize(18);


  text(
    "Universidad Nacional de las Artes (UNA)",
    width / 2,
    110
  );


  // ----------------------------------------------------------
  // CARRERA
  // ----------------------------------------------------------

  textSize(16);


  text(
    "Artes Multimediales",
    width / 2,
    140
  );


  // ----------------------------------------------------------
  // MATERIA
  // ----------------------------------------------------------

  fill(
    180,
    185,
    190
  );


  textSize(14);


  text(
    "Materia: Informática Aplicada I",
    width / 2,
    180
  );


  //-----------------------------------------------------------
  //TÍTULO DEL JUEGO
  //-----------------------------------------------------------

   fill(
    242,
    230,
    206
  );


  textSize(14);


  text(
    "LA GRAN CIUDAD",
    width / 2,
    210
  );

  // ----------------------------------------------------------
  // AUTORES
  // ----------------------------------------------------------

  fill(
    242,
    230,
    206
  );


  textSize(13);


  text(
    "Autores: Pablo Adrián Ferrando, Martin Ratti & Iván Gianfrancesco",
    width / 2,
    245
  );


  // ----------------------------------------------------------
  // DOCENTES
  // ----------------------------------------------------------

  fill(
    217,
    143,
    30
  );


  text(
    "Profesor Titular: Lic. David Bedoian",
    width / 2,
    280
  );


  text(
    "Ayudante de Cátedra: Lic. Stanko Iván Luburic",
    width / 2,
    305
  );


  // ----------------------------------------------------------
  // BOTÓN VOLVER
  // ----------------------------------------------------------

  fill(
    0,
    255,
    55
  );


  rect(
    width / 2 - 70,
    350,
    140,
    40,
    5
  );


  fill(0);


  textSize(14);


  text(
    "JUGAR",
    width / 2,
    370
  );


  pop();
}


// ============================================================
// ACTUALIZAR CIUDAD
// ============================================================

function actualizarCiudad() {

  // ----------------------------------------------------------
  // CREAR GASTOS DESDE EL BANQUERO
  // ----------------------------------------------------------

  if (
    !juegoTerminado &&
    frameCount % 120 === 0 &&
    personaje.estado !== "DERROTADO"
  ) {

    let puntoSalidaX =
      banqueroX + 60;


    deudas.push(
      new Deuda(
        width,
        puntoSalidaX,
        170
      )
    );
  }


  // ----------------------------------------------------------
  // ACTUALIZAR GASTOS
  // ----------------------------------------------------------

  for (
    let i = deudas.length - 1;
    i >= 0;
    i--
  ) {

    deudas[i].actualizar();

    deudas[i].dibujar();


    // --------------------------------------------------------
    // COLISIÓN
    // --------------------------------------------------------

    if (
      deudas[i].verificarColision(
        personaje
      )
    ) {

      saludMental -= 20;


      saludMental =
        max(
          0,
          saludMental
        );


      // ------------------------------------------------------
      // SALUD BAJA
      // ------------------------------------------------------

      if (
        saludMental > 0 &&
        saludMental <= 40
      ) {

        personaje.estadoBase =
          "AGACHADO";

        personaje.estado =
          "AGACHADO";
      }


      // ------------------------------------------------------
      // GAME OVER
      // ------------------------------------------------------

      if (
        saludMental <= 0
      ) {

        saludMental = 0;

        terminarJuego();
      }
    }


    // --------------------------------------------------------
    // ELIMINAR FUERA DE PANTALLA
    // --------------------------------------------------------

    if (
      deudas[i].y >
      height + 50
    ) {

      deudas.splice(
        i,
        1
      );
    }
  }


  // ----------------------------------------------------------
  // DISPAROS
  // ----------------------------------------------------------

  for (
    let k = disparos.length - 1;
    k >= 0;
    k--
  ) {

    disparos[k].actualizar();

    disparos[k].dibujar();


    for (
      let j = deudas.length - 1;
      j >= 0;
      j--
    ) {

      if (
        disparos[k].verificarImpacto(
          deudas[j]
        )
      ) {

        deudasLiquidadas += 1;

        puntuacion +=
          puntosPorLiquidacion;
if (
  puntuacion >= 5000 &&
  !juegoTerminado
) {

  motivoFin = "victoria";

  juegoTerminado = true;

  estado = 6;
}

        deudas.splice(
          j,
          1
        );


        break;
      }
    }


    if (
      !disparos[k].activo ||
      disparos[k].y < -20
    ) {

      disparos.splice(
        k,
        1
      );
    }
  }
}


// ============================================================
// ACTUALIZAR CASA
// ============================================================

function actualizarCasa() {

  let cercaDelSillon =
    personaje.x >= 60 &&
    personaje.x <= 280;


  // ----------------------------------------------------------
  // INDICACIÓN DE DESCANSO
  // ----------------------------------------------------------

  if (
    saludMental <= 40 &&
    personaje.estado !== "SENTADO" &&
    personaje.estado !== "DERROTADO"
  ) {

    dibujarFlecha(
      90,
      70,
      "DESCANSÁ"
    );
  }


  // ----------------------------------------------------------
  // TEXTO DEL SILLÓN
  // ----------------------------------------------------------

  if (
    cercaDelSillon &&
    personaje.estado !== "SENTADO" &&
    personaje.estado !== "DERROTADO"
  ) {

    push();


    fill(
      255,
      255,
      0
    );


    stroke(0);

    strokeWeight(2);


    textSize(10);

    textAlign(
      CENTER
    );


    text(
      "Presioná 'S' para descansar",
      personaje.x,
      personaje.y - 260
    );


    pop();
  }


  // ----------------------------------------------------------
  // RECUPERACIÓN DE SALUD
  // ----------------------------------------------------------

  if (
    personaje.estado === "SENTADO"
  ) {

    if (
      frameCount % 30 === 0
    ) {

      if (
        saludMental < 100
      ) {

        saludMental =
          min(
            100,
            saludMental + 5
          );


        // ----------------------------------------------------
        // PARTÍCULA DE CEREBRO
        // ----------------------------------------------------

        crearParticula(
          personaje.x,
          personaje.y - 100,
          "🧠",
          0,
          -1.5
        );


        if (
          saludMental > 50
        ) {

          personaje.estadoBase =
            "NORMAL";
        }
      }
    }
  }
}


// ============================================================
// ACTUALIZAR OFICINA
// ============================================================

function actualizarOficina() {

  let cercaDelEscritorio =
    personaje.x >= 200 &&
    personaje.x <= 420;


  // ----------------------------------------------------------
  // FLECHA TRABAJÁ
  // ----------------------------------------------------------

  if (
    pesosDisponibles < 40 &&
    personaje.estado !== "TRABAJANDO" &&
    personaje.estado !== "DERROTADO"
  ) {

    dibujarFlecha(
      310,
      120,
      "TRABAJÁ"
    );
  }


  // ----------------------------------------------------------
  // TEXTO DEL ESCRITORIO
  // ----------------------------------------------------------

  if (
    cercaDelEscritorio &&
    personaje.estado !== "TRABAJANDO" &&
    personaje.estado !== "DERROTADO"
  ) {

    push();


    fill(
      0,
      255,
      255
    );


    stroke(0);

    strokeWeight(2);


    textSize(10);

    textAlign(
      CENTER
    );


    text(
      "Presioná 'M' para trabajar",
      personaje.x,
      personaje.y - 82
    );


    pop();
  }


  // ----------------------------------------------------------
  // LÍMITE DE PESOS
  // ----------------------------------------------------------

  let limitePesos = 50;


  // ----------------------------------------------------------
  // GENERAR PESOS TRABAJANDO
  // ----------------------------------------------------------

  if (
    personaje.estado === "TRABAJANDO"
  ) {

    if (
      pesosDisponibles <
      limitePesos &&
      frameCount % 30 === 0
    ) {

      pesosDisponibles += 5;


      pesosDisponibles =
        min(
          limitePesos,
          pesosDisponibles
        );


      crearParticula(
        personaje.x,
        personaje.y - 100,
        "+$",
        0,
        -1.5
      );
    }
  }
}


// ============================================================
// DIBUJAR FLECHA INDICADORA
// ============================================================

function dibujarFlecha(
  x,
  y,
  textoFlecha
) {

  push();


  // ----------------------------------------------------------
  // DESPLAZAMIENTO VERTICAL
  // ----------------------------------------------------------

  let desfasajeY = 55;

  let yAjustada =
    y + desfasajeY;


  let movimiento =
    sin(
      frameCount * 0.08
    ) * 5;


  // ----------------------------------------------------------
  // CUERPO DE LA FLECHA
  // ----------------------------------------------------------

  fill(
    255,
    220,
    0
  );


  stroke(0);

  strokeWeight(3);


  rect(
    x - 5,
    yAjustada + movimiento,
    10,
    30,
    3
  );


  // ----------------------------------------------------------
  // PUNTA
  // ----------------------------------------------------------

  triangle(
    x - 18,
    yAjustada + 20 + movimiento,

    x + 18,
    yAjustada + 20 + movimiento,

    x,
    yAjustada + 55 + movimiento
  );


  // ----------------------------------------------------------
  // TEXTO
  // ----------------------------------------------------------

  fill(255);

  noStroke();


  textAlign(
    CENTER,
    CENTER
  );


  textSize(11);

  textStyle(BOLD);


  text(
    textoFlecha,
    x,
    yAjustada - 15 + movimiento
  );


  pop();
}


// ============================================================
// CREAR PARTÍCULA
// ============================================================

function crearParticula(
  x,
  y,
  texto,
  vx,
  vy
) {

  particulasDinero.push({

    x: x,

    y: y,

    texto: texto,

    vx: vx,

    vy: vy,

    vida: 60

  });
}


// ============================================================
// DIBUJAR PARTÍCULAS
// ============================================================

function dibujarParticulas() {

  for (
    let i = particulasDinero.length - 1;
    i >= 0;
    i--
  ) {

    let particula =
      particulasDinero[i];


    particula.x +=
      particula.vx;


    particula.y +=
      particula.vy;


    particula.vy +=
      0.01;


    particula.vida--;


    push();


    // --------------------------------------------------------
    // COLOR DEL CEREBRO
    // --------------------------------------------------------

    if (
      particula.texto === "🧠"
    ) {

      fill(
        255,
        50,
        100,
        map(
          particula.vida,
          0,
          60,
          0,
          255
        )
      );

    }

    // --------------------------------------------------------
    // COLOR DEL DINERO
    // --------------------------------------------------------

    else {

      fill(
        0,
        255,
        55,
        map(
          particula.vida,
          0,
          60,
          0,
          255
        )
      );
    }


    stroke(0);

    strokeWeight(2);


    textSize(16);

    textStyle(BOLD);


    textAlign(
      CENTER,
      CENTER
    );


    text(
      particula.texto,
      particula.x,
      particula.y
    );


    pop();


    // --------------------------------------------------------
    // ELIMINAR PARTÍCULA
    // --------------------------------------------------------

    if (
      particula.vida <= 0
    ) {

      particulasDinero.splice(
        i,
        1
      );
    }
  }
}


// ============================================================
// TRANSICIONES DE CIUDAD
// ============================================================

function verificarTransicionesCiudad() {

  // ----------------------------------------------------------
  // IR A CASA
  // ----------------------------------------------------------

  if (
    personaje.x <= 40
  ) {

    estado = 4;

    personaje.x = 520;

    personaje.vx = 0;
  }


  // ----------------------------------------------------------
  // IR A OFICINA
  // ----------------------------------------------------------

  else if (
    personaje.x >= 550
  ) {

    estado = 5;

    personaje.x = 60;

    personaje.vx = 0;
  }
}


// ============================================================
// TERMINAR JUEGO
// ============================================================


function terminarJuego() {

  if (juegoTerminado) return;


  juegoTerminado = true;


  saludMental = 0;


  personaje.estado =
    "DERROTADO";


  personaje.estadoBase =
    "DERROTADO";


  personaje.vx = 0;


  personaje.y =
    personaje.sueloY + 40;


  // ----------------------------------------------------------
  // GUARDAR RÉCORD
  // ----------------------------------------------------------

  if (
    tablaPuntajes &&
    nombreJugador
  ) {

    tablaPuntajes.registrarJugador(
      nombreJugador,
      puntuacion,
      tiempoSobrevivido
    );
  }


  estado = 6;
}

// ============================================================
// OSCURECIMIENTO
// ============================================================

function dibujarOscurecimiento() {

  if (
    saludMental <= 40
  ) {

    let intensidad =
      map(
        saludMental,
        40,
        0,
        0,
        100
      );


    fill(
      120,
      0,
      0,
      intensidad
    );


    noStroke();


    rect(
      0,
      0,
      width,
      height
    );
  }
}


// ============================================================
// MARCADOR EN PANTALLA
// ============================================================

function dibujarMarcadorPantalla() {

  push();


  // ----------------------------------------------------------
  // FONDO
  // ----------------------------------------------------------

  fill(
    0,
    0,
    0,
    160
  );


  noStroke();


  rect(
    15,
    10,
    175,
    90,
    4
  );


  // ----------------------------------------------------------
  // TEXTO
  // ----------------------------------------------------------

  textSize(9);

  textStyle(BOLD);

  textAlign(
    LEFT,
    TOP
  );


  // ----------------------------------------------------------
  // SALUD MENTAL
  // ----------------------------------------------------------

  fill(
    0,
    255,
    255
  );


  text(
    `SALUD MENTAL: ${saludMental}%`,
    20,
    15
  );


  // ----------------------------------------------------------
  // PESOS
  // ----------------------------------------------------------

  fill(
    0,
    255,
    55
  );


  text(
    `PESOS: $${pesosDisponibles}`,
    20,
    30
  );


  // ----------------------------------------------------------
  // DEUDAS
  // ----------------------------------------------------------

  fill(
    255,
    15,
    250
  );


  text(
    `LIQUIDADAS: ${deudasLiquidadas}`,
    20,
    45
  );


  // ----------------------------------------------------------
  // PUNTAJE
  // ----------------------------------------------------------

  fill(
    255,
    150,
    0
  );


  text(
    `PUNTAJE: ${puntuacion}`,
    20,
    60
  );


  // ----------------------------------------------------------
  // TIEMPO
  // ----------------------------------------------------------

  let minutos =
    floor(
      tiempoSobrevivido / 60
    );


  let segundos =
    tiempoSobrevivido % 60;


  let textoTiempo =
    nf(
      minutos,
      2
    ) +
    ":" +
    nf(
      segundos,
      2
    );


  fill(
    255,
    220,
    0
  );


  text(
    `VIVO: ${textoTiempo}`,
    20,
    75
  );


  pop();
}


// ============================================================
// ESCENA FINAL
// ============================================================

function dibujarEscenaFinal() {

  // ----------------------------------------------------------
  // CASA
  // ----------------------------------------------------------

  if (
    escenaActual === 4
  ) {

    background(0);

    casa.dibujar();
  }


  // ----------------------------------------------------------
  // OFICINA
  // ----------------------------------------------------------

  else if (
    escenaActual === 5
  ) {

    background(0);

    oficina.dibujar();
  }


  // ----------------------------------------------------------
  // CIUDAD
  // ----------------------------------------------------------

  else {

    background(
      90,
      140,
      170
    );


    ciudad.dibujar();

    dibujarBanquero();
  }


  // ----------------------------------------------------------
  // PERSONAJE
  // ----------------------------------------------------------

  push();


  if (
    escenaActual === 4
  ) {

    let escala = 2.5;


    translate(
      personaje.x *
      (1 - escala),

      personaje.y *
      (1.3 - escala)
    );


    scale(
      escala
    );
  }


  else if (
    escenaActual === 5
  ) {

    let escala = 3.5;


    translate(
      personaje.x *
      (1 - escala),

      personaje.y *
      (1.4 - escala)
    );


    scale(
      escala
    );
  }


  personaje.dibujar();


  pop();
}


// ============================================================
// PANTALLA FINAL
// ============================================================

function dibujarPantallaFinal() {

  push();




  // ----------------------------------------------------------
  // TEXTO
  // ----------------------------------------------------------

  textAlign(
    CENTER,
    CENTER
  );


  fill(
    255,
    30,
    30
  );


  textSize(42);

  textStyle(BOLD);

text(
  motivoFin === "victoria"
    ? "¡GANASTE!"
    : "GAME OVER",
  width / 2,
  70
);

  fill(255);


  textSize(15);

  textStyle(NORMAL);


  text(
    `${nombreJugador}`,
    width / 2,
    115
  );


  fill(
    255,
    220,
    0
  );


  textSize(15);


  text(
    `TIEMPO SOBREVIVIDO: ${formatearTiempo(tiempoSobrevivido)}`,
    width / 2,
    145
  );


  fill(
    0,
    255,
    55
  );


  text(
    `PUNTAJE: ${puntuacion}`,
    width / 2,
    170
  );


  fill(255);


  textSize(11);


  text(
    "Los récords se guardan automáticamente.",
    width / 2,
    195
  );


  // ----------------------------------------------------------
  // VOLVER A JUGAR
  // ----------------------------------------------------------

  fill(
    0,
    255,
    55
  );


  rect(
    width / 2 - 100,
    220,
    200,
    40,
    5
  );


  fill(0);


  textSize(13);


  text(
    "VOLVER A JUGAR",
    width / 2,
    240
  );


  // ----------------------------------------------------------
  // TABLA
  // ----------------------------------------------------------

  fill(
    0,
    200,
    255
  );


  rect(
    width / 2 - 100,
    270,
    200,
    40,
    5
  );


  fill(0);


  text(
    "TABLA DE PUNTAJES",
    width / 2,
    290
  );


  // ----------------------------------------------------------
  // CAMBIAR JUGADOR
  // ----------------------------------------------------------

  fill(
    255,
    30,
    30
  );


  rect(
    width / 2 - 100,
    320,
    200,
    40,
    5
  );


  fill(255);


  text(
    "CAMBIAR JUGADOR",
    width / 2,
    340
  );


  pop();
}


// ============================================================
// FORMATEAR TIEMPO
// ============================================================

function formatearTiempo(
  segundosTotales
) {

  let minutos =
    floor(
      segundosTotales / 60
    );


  let segundos =
    segundosTotales % 60;


  return (
    nf(
      minutos,
      2
    ) +
    ":" +
    nf(
      segundos,
      2
    )
  );
}


// ============================================================
// TABLA DE PUNTAJES
// ============================================================

function dibujarTablaPuntajes() {

  background(
    10,
    10,
    15
  );


  push();


  textAlign(
    CENTER,
    CENTER
  );


  // ----------------------------------------------------------
  // TÍTULO
  // ----------------------------------------------------------

  fill(
    0,
    255,
    55
  );


  textSize(28);

  textStyle(BOLD);


  text(
    "TABLA DE PUNTAJES",
    width / 2,
    35
  );


  // ----------------------------------------------------------
  // ENCABEZADOS
  // ----------------------------------------------------------

  fill(
    255,
    220,
    0
  );


  textSize(12);


  text(
    "POS.",
    70,
    75
  );


  text(
    "JUGADOR",
    230,
    75
  );


  text(
    "PUNTAJE",
    370,
    75
  );


  text(
    "TIEMPO",
    500,
    75
  );


  // ----------------------------------------------------------
  // OBTENER TABLA
  // ----------------------------------------------------------

  let tabla =
    tablaPuntajes
      ? tablaPuntajes.obtenerTabla()
      : [];


  let cantidad =
    min(
      tabla.length,
      10
    );


  // ----------------------------------------------------------
  // DIBUJAR JUGADORES
  // ----------------------------------------------------------

  for (
    let i = 0;
    i < cantidad;
    i++
  ) {

    let jugador =
      tabla[i];


    let y =
      105 +
      i * 28;


    fill(
      40,
      40,
      50
    );


    rect(
      35,
      y - 12,
      530,
      24,
      3
    );


    fill(255);


    textSize(11);


    text(
      i + 1,
      70,
      y
    );


    text(
      jugador.nombre,
      230,
      y
    );


    fill(
      0,
      255,
      55
    );


    text(
      jugador.puntuacion,
      370,
      y
    );


    fill(
      255,
      220,
      0
    );


    text(
      formatearTiempo(
        jugador.tiempo
      ),
      500,
      y
    );
  }


  // ----------------------------------------------------------
  // SI NO HAY PUNTAJES
  // ----------------------------------------------------------

  if (
    cantidad === 0
  ) {

    fill(150);


    textSize(14);


    text(
      "TODAVÍA NO HAY PUNTAJES",
      width / 2,
      150
    );
  }


  // ----------------------------------------------------------
  // BOTÓN VOLVER
  // ----------------------------------------------------------

  fill(
    255,
    30,
    30
  );


  rect(
    width / 2 - 100,
    370,
    200,
    30,
    5
  );


  fill(255);


  textSize(12);


  text(
    "VOLVER",
    width / 2,
    385
  );


  pop();
}


// ============================================================
// MOUSE PRESSED
// ============================================================

function mousePressed() {

  // ==========================================================
  // ESTADO 9 — CRÉDITOS
  // ==========================================================
  //
  // Botón:
  //
  // X = 230 a 370
  // Y = 350 a 390
  //
  // Canvas = 600 x 410
  //
  // ==========================================================

  if (
    estado === 9
  ) {

    if (
      mouseX >= width / 2 - 70 &&
      mouseX <= width / 2 + 70 &&
      mouseY >= 350 &&
      mouseY <= 390
    ) {

      // Volvemos a instrucciones.

      estado = 2;

      return;
    }
  }


  // ==========================================================
  // ESTADO 2 — INSTRUCCIONES
  // ==========================================================

  if (
    estado === 2
  ) {

    if (
      interfaz.mouseSobreBoton()
    ) {

      cursor(ARROW);


      iniciarJuego();


      return;
    }
  }


  // ==========================================================
  // ESTADO 6 — GAME OVER
  // ==========================================================

  if (
    estado === 6
  ) {

    // --------------------------------------------------------
    // VOLVER A JUGAR
    // --------------------------------------------------------

    if (
      mouseX >= width / 2 - 100 &&
      mouseX <= width / 2 + 100 &&
      mouseY >= 220 &&
      mouseY <= 260
    ) {

      iniciarJuego();


      return;
    }


    // --------------------------------------------------------
    // TABLA
    // --------------------------------------------------------

    if (
      mouseX >= width / 2 - 100 &&
      mouseX <= width / 2 + 100 &&
      mouseY >= 270 &&
      mouseY <= 310
    ) {

      estado = 8;


      return;
    }


    // --------------------------------------------------------
    // CAMBIAR JUGADOR
    // --------------------------------------------------------

    if (
      mouseX >= width / 2 - 100 &&
      mouseX <= width / 2 + 100 &&
      mouseY >= 320 &&
      mouseY <= 360
    ) {

      nombreJugador = "";


      crearInputNombre();


      estado = 1;


      return;
    }
  }


  // ==========================================================
  // ESTADO 8 — TABLA
  // ==========================================================

  if (
    estado === 8
  ) {

    if (
      mouseX >= width / 2 - 100 &&
      mouseX <= width / 2 + 100 &&
      mouseY >= 370 &&
      mouseY <= 400
    ) {

      estado = 6;


      return;
    }
  }
}


// ============================================================
// KEY PRESSED
// ============================================================

function keyPressed() {

  // ==========================================================
  // R = REINICIAR
  // ==========================================================

  if (
    key === 'r' ||
    key === 'R'
  ) {

    if (
      nombreJugador
    ) {

      iniciarJuego();
    }
  }


  // ==========================================================
  // CASA
  // ==========================================================

  if (
    estado === 4
  ) {

    if (
      key === 's' ||
      key === 'S'
    ) {

      // ------------------------------------------------------
      // LEVANTARSE
      // ------------------------------------------------------

      if (
        personaje.estado === "SENTADO"
      ) {

        personaje.x = 180;


        personaje.levantarse();
      }


      // ------------------------------------------------------
      // SENTARSE
      // ------------------------------------------------------

      else if (
        personaje.x >= 60 &&
        personaje.x <= 280
      ) {

        personaje.sentarse();
      }
    }
  }


  // ==========================================================
  // OFICINA
  // ==========================================================

  if (
    estado === 5
  ) {

    if (
      key === 'm' ||
      key === 'M'
    ) {

      // ------------------------------------------------------
      // DEJAR DE TRABAJAR
      // ------------------------------------------------------

      if (
        personaje.estado === "TRABAJANDO"
      ) {

        personaje.x = 220;


        personaje.levantarseDeTrabajar();
      }


      // ------------------------------------------------------
      // EMPEZAR A TRABAJAR
      // ------------------------------------------------------

      else if (
        personaje.x >= 200 &&
        personaje.x <= 420 &&
        personaje.estado !== "DERROTADO"
      ) {

        personaje.x = 320;


        personaje.trabajar();
      }
    }
  }


  // ==========================================================
  // CIUDAD — DISPARO
  // ==========================================================

  if (
    estado === 3
  ) {

    if (
      keyCode === 32 &&
      pesosDisponibles >= 1 &&
      personaje.estado !== "DERROTADO" &&
      !juegoTerminado
    ) {

      disparos.push(
        new Disparo(
          personaje.x,
          personaje.y - 80
        )
      );


      pesosDisponibles -= 1;


      pesosDisponibles =
        max(
          0,
          pesosDisponibles
        );
    }
  }
}