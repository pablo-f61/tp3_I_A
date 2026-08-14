class Oficina {
  constructor(imgOficina) {
    this.img = imgOficina;
  }

  dibujar() {
    // Dibuja la imagen cubriendo todo el lienzo desde la esquina superior izquierda
    // Podés usar width y height para que se adapte automáticamente al tamaño del canvas
    image(this.img, 0, 0, 600, 410);
  }
}
