class Disparo {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.velocidadY = -5; // Va hacia arriba velozmente
    this.ancho = 15;
    this.alto = 20;
    this.activo = true;
  }

  actualizar() {
    this.y += this.velocidadY;
    
    // Si sale de la pantalla por arriba, se desactiva
    if (this.y < -20) {
      this.activo = false;
    }
  }

  dibujar() {
    if (!this.activo) return;

    push();
    fill(46, 204, 113); // Verde plata
    textSize(20);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    
    stroke(0);
    strokeWeight(2);
    
    text("$", this.x, this.y);
    pop();
  }

  // Verifica si el disparo le pegó a una deuda que cae
  verificarImpacto(deuda) {
    if (!this.activo || !deuda.activa) return false;

    // Caja de colisión simple entre el signo $ y la palabra
    let distanciaX = abs(this.x - deuda.x);
    let distanciaY = abs(this.y - deuda.y);

    if (distanciaX < 40 && distanciaY < 25) {
      this.activo = false; // Se gasta el disparo
      deuda.activa = false; // Se destruye la deuda
      return true;
    }
    return false;
  }
}