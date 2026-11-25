class Disparo {

  constructor(x, y) {

    this.x = x;
    this.y = y;

    // Movimiento hacia arriba
    this.velocidadY = -5;

    this.ancho = 15;
    this.alto = 20;

    this.activo = true;
  }


  // ========================================================
  // ACTUALIZAR
  // ========================================================

  actualizar() {

    if (!this.activo) {
      return;
    }

    this.y += this.velocidadY;


    // Sale por arriba
    if (this.y < -20) {
      this.activo = false;
    }
  }


  // ========================================================
  // DIBUJAR
  // ========================================================

  dibujar() {

    if (!this.activo) {
      return;
    }

    push();

    fill(
      46,
      204,
      113
    );

    textSize(20);

    textStyle(BOLD);

    textAlign(
      CENTER,
      CENTER
    );

    stroke(0);

    strokeWeight(2);

    text(
      "$",
      this.x,
      this.y
    );

    pop();
  }


  // ========================================================
  // IMPACTO
  // ========================================================

  verificarImpacto(deuda) {

    if (
      !this.activo ||
      !deuda.activa
    ) {
      return false;
    }


    let distanciaX =
      abs(
        this.x - deuda.x
      );

    let distanciaY =
      abs(
        this.y - deuda.y
      );


    if (
      distanciaX < 40 &&
      distanciaY < 25
    ) {

      this.activo = false;

      deuda.activa = false;

      return true;
    }


    return false;
  }


  // ========================================================
  // IMPACTO CONTRA BANQUERO
  // ========================================================

  verificarImpactoBanquero() {
    if (!this.activo) {
      return false;
    }

    // El banquero se dibuja con imageMode(CORNER) en (banqueroX, 50) con tamaño 120x120
    let tocoX = this.x > banqueroX && this.x < banqueroX + 120;
    let tocoY = this.y > 50 && this.y < 50 + 120;

    if (tocoX && tocoY) {
      // Desactivamos el signo "$" para que desaparezca al chocar
      this.activo = false;

      // Reacción física: invierte dirección y pega un sacudón hacia el costado
      banqueroVelocidad *= -1;
      banqueroX += banqueroVelocidad * 10;
      banqueroX = constrain(banqueroX, banqueroLimiteIzquierdo, banqueroLimiteDerecho);

      // Reacción visual: activa el temblor y el tinte rojo por 15 cuadros
      banqueroGolpeado = 15;

      // Prolonga el tiempo límite en 10 segundos
      tiempoLimite += 10;

      return true;
    }

    return false;
  }
}