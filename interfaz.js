class Interfaz {

  constructor() {

    this.colorVerde =
      color(
        46,
        204,
        113
      );


    this.btnX =
      300 - 60;

    this.btnY =
      345;

    this.btnAncho =
      120;

    this.btnAlto =
      35;

  }


  mostrarInstrucciones(img) {

    background(20);


    if (img) {

      imageMode(CORNER);

      image(
        img,
        0,
        0,
        width,
        height
      );

    }


    if (this.mouseSobreBoton()) {

      fill(
        39,
        174,
        96
      );

      cursor(HAND);

    }

    else {

      fill(
        this.colorVerde
      );

      cursor(ARROW);

    }


    rect(
      this.btnX,
      this.btnY,
      this.btnAncho,
      this.btnAlto,
      5
    );


    fill(10);

    textSize(14);

    textStyle(BOLD);

    textAlign(
      CENTER,
      CENTER
    );

    text(
      "JUGAR",
      this.btnX + this.btnAncho / 2,
      this.btnY + this.btnAlto / 2
    );

  }


  // ========================================================
  // HUD (MARCADOR EN PANTALLA)
  // ========================================================

  dibujarHUD(
    saludMental,
    pesosDisponibles,
    deudasLiquidadas,
    puntuacion,
    tiempoRestante
  ) {

    push();

    // ------------------------------------------------------
    // BARRA SUPERIOR (FONDO)
    // ------------------------------------------------------

    noStroke();

    fill(
      18,
      22,
      28,
      230
    );

    rect(
      0,
      0,
      width,
      32
    );

    // Borde inferior con el color ámbar característico
    stroke(
      217,
      143,
      30,
      110
    );

    strokeWeight(1.5);

    line(
      0,
      32,
      width,
      32
    );


    // ------------------------------------------------------
    // TIPOGRAFÍA GENERAL
    // ------------------------------------------------------

    textFont("Special Elite");

    textSize(11);

    textStyle(BOLD);

    textAlign(
      LEFT,
      CENTER
    );

    let yCentro = 16;


    // ------------------------------------------------------
    // 1. SALUD MENTAL (Barra de progreso + Texto)
    // ------------------------------------------------------

    noStroke();

    fill(
      242,
      230,
      206
    );

    text(
      "SALUD:",
      12,
      yCentro
    );

    let barraX = 64;
    let barraY = 10;
    let barraAncho = 55;
    let barraAlto = 12;

    // Contenedor de la barra
    fill(
      35,
      40,
      50
    );

    stroke(
      60,
      68,
      80
    );

    strokeWeight(1);

    rect(
      barraX,
      barraY,
      barraAncho,
      barraAlto,
      2
    );

    // Relleno dinámico según salud mental
    let porcentaje =
      constrain(
        saludMental,
        0,
        100
      );

    let anchoRelleno =
      map(
        porcentaje,
        0,
        100,
        0,
        barraAncho
      );

    if (porcentaje > 40) {
      fill(
        0,
        229,
        255
      ); // Cian
    } else if (porcentaje > 20) {
      fill(
        255,
        193,
        7
      ); // Ámbar advertencia
    } else {
      // Peligro crítico con parpadeo suave
      let parpadeo =
        (frameCount % 30 < 15)
          ? 255
          : 180;

      fill(
        255,
        59,
        48,
        parpadeo
      );
    }

    noStroke();

    if (anchoRelleno > 0) {
      rect(
        barraX,
        barraY,
        anchoRelleno,
        barraAlto,
        2
      );
    }

    // Porcentaje numérico
    fill(
      242,
      230,
      206
    );

    textSize(10);

    text(
      `${floor(porcentaje)}%`,
      barraX + barraAncho + 6,
      yCentro
    );

    // Separador
    this._dibujarSeparador(166);


    // ------------------------------------------------------
    // 2. PESOS DISPONIBLES
    // ------------------------------------------------------

    textSize(11);

    fill(
      180,
      185,
      190
    );

    text(
      "PESOS:",
      178,
      yCentro
    );

    fill(
      46,
      204,
      113
    ); // Verde billete

    text(
      `$${pesosDisponibles}`,
      230,
      yCentro
    );

    // Separador
    this._dibujarSeparador(268);


    // ------------------------------------------------------
    // 3. DEUDAS LIQUIDADAS
    // ------------------------------------------------------

    fill(
      180,
      185,
      190
    );

    text(
      "DEUDAS:",
      280,
      yCentro
    );

    fill(
      255,
      107,
      129
    ); // Magenta / coral vibrante

    text(
      `${deudasLiquidadas}`,
      344,
      yCentro
    );

    // Separador
    this._dibujarSeparador(370);


    // ------------------------------------------------------
    // 4. TIEMPO RESTANTE (CUENTA REGRESIVA)
    // ------------------------------------------------------

    let segundosTotales =
      max(
        0,
        floor(tiempoRestante)
      );

    let minutos =
      floor(
        segundosTotales / 60
      );

    let segundos =
      segundosTotales % 60;

    let textoTiempo =
      nf(minutos, 2) +
      ":" +
      nf(segundos, 2);

    fill(
      180,
      185,
      190
    );

    text(
      "TIEMPO:",
      382,
      yCentro
    );

    if (segundosTotales <= 15) {
      let parpadeo =
        (frameCount % 30 < 15)
          ? 255
          : 180;

      fill(
        255,
        59,
        48,
        parpadeo
      ); // Peligro crítico con parpadeo suave
    } else if (segundosTotales <= 30) {
      fill(
        255,
        193,
        7
      ); // Ámbar advertencia
    } else {
      fill(
        242,
        230,
        206
      ); // Crema marfil
    }

    text(
      textoTiempo,
      440,
      yCentro
    );

    // Separador
    this._dibujarSeparador(486);


    // ------------------------------------------------------
    // 5. PUNTAJE
    // ------------------------------------------------------

    fill(
      180,
      185,
      190
    );

    text(
      "PTS:",
      498,
      yCentro
    );

    fill(
      217,
      143,
      30
    ); // Ámbar / oro

    text(
      `${puntuacion}`,
      532,
      yCentro
    );

    pop();
  }


  // ========================================================
  // SEPARADOR VISUAL DEL HUD
  // ========================================================

  _dibujarSeparador(x) {

    stroke(
      255,
      255,
      255,
      35
    );

    strokeWeight(1);

    line(
      x,
      8,
      x,
      24
    );

  }


  mouseSobreBoton() {

    return (

      mouseX >= this.btnX &&

      mouseX <=
      this.btnX + this.btnAncho &&

      mouseY >= this.btnY &&

      mouseY <=
      this.btnY + this.btnAlto

    );

  }

}