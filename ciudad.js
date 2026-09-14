class Ciudad {
  constructor(imagenFondo, imagenVelero) {
    this.imagenFondo = imagenFondo;
    this.imgVelero = imagenVelero;

    // Posición amarrado sobre el agua al fondo
    this.veleroBaseX = 450; // Ajustá X para ubicarlo cerca del agua/muelle
    this.veleroBaseY = 275; // Ajustá Y para que coincida con el nivel del río
    
    // Dimensiones escaladas para que mantenga la perspectiva lejana
    this.anchoVelero = 70;  
    this.altoVelero = 65;
  }

  dibujar() {
    // 1. Dibujar la ciudad
    if (this.imagenFondo) {
      image(this.imagenFondo, 0, 0, width, height);
    }

    // 2. Efecto de oscilación amarrado
    if (this.imgVelero) {
      push();
      
      // Cálculo de oscilación vertical (arriba/abajo) y rotación (bamboleo)
      let desfasajeY = sin(frameCount * 0.05) * 1; // Flota 3px arriba y abajo
      let anguloRotacion = sin(frameCount * 0.03) * 0.05; // Balanceo suave en radianes

      // Trasladamos el origen al punto del velero para rotarlo desde su centro
      translate(this.veleroBaseX, this.veleroBaseY + desfasajeY);
      rotate(anguloRotacion);

      // Dibujamos el velero centrado en el punto de origen
      imageMode(CENTER);
      image(this.imgVelero, 0, 0, this.anchoVelero, this.altoVelero);

      pop();
    }
  }
}