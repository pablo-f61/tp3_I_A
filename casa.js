class Casa {
  constructor(imagen) {
    this.imagen = imagen;
  }

  dibujar() {
    if (this.imagen) {
      imageMode(CORNER);
      
      // 🎯 VALORES EXACTOS PARA ELIMINAR EL MARCO BLANCO DE LA ILUSTRACIÓN:
      // Se estira fuera de la pantalla (-X y -Y) para ocultar el sobrante blanco
      let offsetX = -60;  // Corre a la izquierda para comerse el blanco de la derecha
      let offsetY = -40;  // Sube para comerse la franja blanca superior
      let anchoExtra = 130; 
      let altoExtra = 80;

      image(
        this.imagen, 
        offsetX, 
        offsetY, 
        width + anchoExtra, 
        height + altoExtra
      );
    }
  }
}