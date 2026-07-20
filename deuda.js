class Deuda {
  constructor(canvasAncho) {
    // Aparecen en un punto X al azar en el techo de la pantalla
    this.x = random(40, canvasAncho - 40);
    this.y = -30; // Arrancan arriba de todo, afuera del canvas
    
    // Caen hacia abajo de manera incesante
    this.velocidadY = random(1.5, 3.5); 
    this.activa = true;

    // Las tres palabras de la consigna al azar
    let palabras = ["DEUDAS", "COMPRAS", "IMPUESTOS"];
    this.texto = random(palabras);
  }

  actualizar() {
    // Ahora avanzan hacia abajo sumando en Y
    this.y += this.velocidadY;
  }

  dibujar() {
    if (!this.activa) return;

    push();
    fill(255, 50, 50); // Rojo alerta
    textSize(16);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    
    stroke(0);
    strokeWeight(3); // Borde negro para legibilidad
    
    text(this.texto, this.x, this.y);
    pop();
  }

  verificarColision(personaje) {
    if (!this.activa || personaje.estado === "DERROTADO") return false;

    // Colisión: revisamos la distancia de la palabra que cae respecto al Chapa
    let distanciaX = abs(this.x - personaje.x);
    
    // Si el personaje está parado en la base, calculamos su rango corporal en Y
    let distanciaY = abs(this.y - (personaje.y - 50)); 

    // Ajustamos la caja para cuando te caigan encima de la cabeza o el cuerpo
    if (distanciaX < 45 && this.y >= (personaje.y - 90) && this.y <= personaje.y) {
      this.activa = false; 
      return true;
    }
    return false;
  }
}