class Casa {

  constructor(imagen) {
    this.imagen = imagen;
  }

  dibujar() {

    if (!this.imagen) {
      return;
    }

    imageMode(CORNER);

    // Estos valores mantienen la corrección
    // que ya tenías para ocultar el borde blanco.
    let offsetX = -60;
    let offsetY = -1;

    let anchoExtra = 70;
    let altoExtra = 1;

    image(
      this.imagen,
      offsetX,
      offsetY,
      width + anchoExtra,
      height + altoExtra
    );
  }
}