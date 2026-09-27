class Ciudad {

  constructor(imagenFondo, imagenVelero) {

    this.imagenFondo = imagenFondo;
    this.imgVelero = imagenVelero;

    // Posición del velero
    this.veleroBaseX = 450;
    this.veleroBaseY = 275;

    // Tamaño del velero
    this.anchoVelero = 70;
    this.altoVelero = 65;
  }

  dibujar() {

    // ======================================================
    // FONDO
    // ======================================================

    if (this.imagenFondo) {

      imageMode(CORNER);

      image(
        this.imagenFondo,
        0,
        0,
        width,
        height
      );
    }


    // ======================================================
    // VELERO
    // ======================================================

    if (this.imgVelero) {

      push();

      // Movimiento vertical suave
      let desfasajeY =
        sin(frameCount * 0.05) * 1;

      // Balanceo
      let anguloRotacion =
        sin(frameCount * 0.03) * 0.05;


      translate(
        this.veleroBaseX,
        this.veleroBaseY + desfasajeY
      );

      rotate(anguloRotacion);


      imageMode(CENTER);

      image(
        this.imgVelero,
        0,
        0,
        this.anchoVelero,
        this.altoVelero
      );

      pop();
    }
  }
}