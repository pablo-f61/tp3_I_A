class Personaje1 {
  constructor(sueloY) {
    this.x = 300; 
    this.sueloY = sueloY; // 320
    this.altoPersonaje = 40; 
    
    // Posición inicial Y: en el medio de la calle
    this.y = this.sueloY + 20; 
    
    this.velocidad = 4; 
    this.radioCabeza = 10;
    
    this.vidas = 3;
    this.vivo = true;
  }

  actualizar() {
    if (!this.vivo) return;

    // --- Movimiento Horizontal (X) ---
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
      this.x -= this.velocidad;
    }
    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
      this.x += this.velocidad;
    }

    // --- Movimiento Vertical (Y) ---
    if (keyIsDown(UP_ARROW) || keyIsDown(87)) { // Flecha Arriba o W
      this.y -= this.velocidad;
    }
    if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) { // Flecha Abajo o S
      this.y += this.velocidad;
    }

  // ... Tu código actual de movimiento (teclas izquierda/derecha, gravedad, saltos) ...

  // Supongamos que la altura del techo de la vereda es Y = 320. 
  // Si el personaje está más arriba de 320 (es decir, un valor de Y menor), está en la zona del edificio:
  if (this.y < 320) { 
    // Choque contra el edificio: no lo dejamos pasar de 195 a la izquierda
    this.x = constrain(this.x, 195, 585);
  } else {
    // Está abajo en la vereda: ¡vía libre para caminar hasta el fondo!
    this.x = constrain(this.x, 15, 585);
  }
    
    // Límite vertical: El personaje se mueve dentro de la calle (entre 320 y 380 para no salirse abajo)
    this.y = constrain(this.y, this.sueloY, height - 20);
  }

  dibujar() {
    if (!this.vivo) return;

    noStroke(); 

    // 1. Cabeza (Relativa a this.x y this.y)
    let centroCabezaY = this.y - 15; // La cabeza va un poco más arriba de la base Y del personaje
    fill(250, 150, 110);
    ellipse(this.x, centroCabezaY, this.radioCabeza * 0.9);

    // 2. Cuerpo y Extremidades (Ahora TODOS los rectángulos usan this.y)
    fill(20); 
    
    // Bloque Tronco Central (Antes fijo en 295, ahora acompaña a this.y)
    rect(this.x - 4, this.y - 10, 8, 20);
    
    // Bloque Piernas (Antes fijo en 305)
    rect(this.x - 3, this.y, 6, 20);
    
    // Bloque Brazos / Detalle (Antes fijo en 299)
    rect(this.x - 8, this.y - 6, 6, 9);
  }
}