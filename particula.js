class Particula {

  constructor(x, y, texto, tipo = "DINERO") {

    this.x = x;
    this.y = y;

    this.texto = texto;

    this.tipo = tipo;

    this.velocidadY = random(-1.8, -1.1);

    this.velocidadX = random(-0.4, 0.4);

    this.vida = 255;

    this.tamaño = 16;

  }


  actualizar() {

    this.x += this.velocidadX;

    this.y += this.velocidadY;

    this.velocidadY *= 0.98;

    this.vida -= 4;

  }


  dibujar() {

    if (this.vida <= 0) {
      return;
    }

    push();

    textAlign(
      CENTER,
      CENTER
    );

    textStyle(BOLD);

    textSize(this.tamaño);


    // DINERO

    if (this.tipo === "DINERO") {

      fill(
        46,
        204,
        113,
        this.vida
      );

      stroke(
        0,
        this.vida
      );

    }


    // SALUD

    else if (this.tipo === "SALUD") {

      fill(
        0,
        255,
        255,
        this.vida
      );

      stroke(
        0,
        this.vida
      );

    }


    strokeWeight(2);

    text(
      this.texto,
      this.x,
      this.y
    );

    pop();

  }


  terminada() {

    return this.vida <= 0;

  }

}