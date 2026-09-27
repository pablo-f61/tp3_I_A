class Oficina {

  constructor(imagen) {

    this.imagen =
      imagen;
  }


  // ==========================================================
  // DIBUJAR
  // ==========================================================

  dibujar() {

    if (
      !this.imagen
    ) {

      return;
    }


    imageMode(CORNER);


    image(
      this.imagen,
      0,
      0,
      width,
      height
    );
  }
}