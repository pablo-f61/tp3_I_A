class Deuda {

  constructor(
    canvasAncho,
    spawnX = null,
    spawnY = -30
  ) {

    // ======================================================
    // POSICIÓN
    // ======================================================

    if (spawnX !== null) {

      this.x =
        constrain(
          spawnX,
          40,
          canvasAncho - 40
        );

    } else {

      this.x =
        random(
          40,
          canvasAncho - 40
        );
    }


    this.y =
      spawnY;


    // ======================================================
    // VELOCIDAD
    // ======================================================

    this.velocidadY =
      random(
        1.5,
        3.5
      );


    // ======================================================
    // ESTADO
    // ======================================================

    this.activa = true;


    // ======================================================
    // TEXTO
    // ======================================================

    let palabras = [

      "DEUDAS",

      "COMPRAS",

      "IMPUESTOS"

    ];


    this.texto =
      random(
        palabras
      );
  }


  // ========================================================
  // ACTUALIZAR
  // ========================================================

  actualizar() {

    if (!this.activa) {
      return;
    }


    this.y +=
      this.velocidadY;
  }


  // ========================================================
  // DIBUJAR
  // ========================================================

  dibujar() {

    if (!this.activa) {
      return;
    }


    push();


    fill(
      255,
      50,
      50
    );


    textSize(16);

    textStyle(BOLD);


    textAlign(
      CENTER,
      CENTER
    );


    stroke(0);

    strokeWeight(3);


    text(
      this.texto,
      this.x,
      this.y
    );


    pop();
  }


  // ========================================================
  // COLISIÓN CON PERSONAJE
  // ========================================================

  verificarColision(personaje) {

    if (
      !this.activa ||
      personaje.estado === "DERROTADO"
    ) {

      return false;
    }


    let distanciaX =
      abs(
        this.x -
        personaje.x
      );


    // ------------------------------------------------------
    // GOLPE
    // ------------------------------------------------------
    //
    // El gasto desaparece inmediatamente al tocar
    // al personaje.
    //
    // No se genera ningún destello rojo.
    // ------------------------------------------------------

    if (
      distanciaX < 45 &&
      this.y >= personaje.y - 90 &&
      this.y <= personaje.y
    ) {

      this.activa = false;

      return true;
    }


    return false;
  }
}