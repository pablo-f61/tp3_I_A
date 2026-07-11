class Interfaz {
  constructor() {
    this.colorVerde = color(46, 204, 113); 
    this.colorFondoCard = color(15, 25, 22, 220); 

    // Propiedades del botón "JUGAR" para poder detectar el clic después
    this.btnX = 300 - 60; // Centrado (Ancho/2)
    this.btnY = 345;
    this.btnAncho = 120;
    this.btnAlto = 35;
  }

  mostrarInstrucciones() {
    background(10); 
    
    // --- TÍTULO PRINCIPAL ---
    fill(this.colorVerde);
    textSize(22);
    textAlign(LEFT, TOP);
    textStyle(BOLD);
    text("MECÁNICAS DE JUEGO", 40, 30);
    
    stroke(this.colorVerde);
    strokeWeight(2);
    line(30, 65, 560, 65);
    noStroke();

  // --- LAS TRES COLUMNAS ---
    let anchoCard = 130;
    let altoCard = 240;
    let yCard = 70;
    // Aumentamos un poquito el espacio a 50 para que se distribuyan perfecto en el canvas de 600
    let espacio = 50; 
    let margenIzquierdo = 45; // Margen para que el bloque completo quede centrado

    // Columna 0 (Izquierda) - LOS ENEMIGOS
    this.dibujarCard(margenIzquierdo + (anchoCard + espacio) * 0, yCard, anchoCard, altoCard, "📄", "LOS ENEMIGOS", "Las palabras 'DEUDAS', 'COMPRAS' e 'IMPUESTOS' caen incesantemente. Cada impacto disminuye tu salud financiera.");

    // Columna 1 (Centro) - LA DEFENSA[cite: 1]
    this.dibujarCard(margenIzquierdo + (anchoCard + espacio) * 1, yCard, anchoCard, altoCard, "🪙", "LA DEFENSA", "Disparas dinero para destruir los gastos. Defenderte consume tus recursos; debes equilibrar el gasto.");

    // Columna 2 (Derecha) - LA RECARGA[cite: 1]
    this.dibujarCard(margenIzquierdo + (anchoCard + espacio) * 2, yCard, anchoCard, altoCard, "🏢", "LA RECARGA", "Cuando tus balas se agotan, debes moverte hacia el edificio 'TRABAJO' en la base para recargar.");
  

    // --- DIBUJO DEL BOTÓN "JUGAR" ---
    // Cambia de color si el mouse está arriba (Feedback visual de UX!)
    if (this.mouseSobreBoton()) {
      fill(39, 174, 96); // Verde un toque más oscuro al pasar el mouse
      cursor(HAND); // Cambia el cursor a la manito
    } else {
      fill(this.colorVerde);
      cursor(ARROW); // Cursor normal
    }
    
    rect(this.btnX, this.btnY, this.btnAncho, this.btnAlto, 5); // Botón redondeado

    // Texto del botón
    fill(10);
    textSize(14);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    // Dibujamos el texto justo en el centro del botón
    text("JUGAR", this.btnX + this.btnAncho / 2, this.btnY + this.btnAlto / 2);
  }

  dibujarCard(x, y, ancho, alto, emoji, titulo, descripcion) {
    fill(this.colorFondoCard);
    rect(x, y, ancho, alto, 8);

    fill(this.colorVerde);
    let centroIconoX = x + ancho / 2;
    let centroIconoY = y + 45;
    ellipse(centroIconoX, centroIconoY, 45, 45);

    fill(10); 
    textSize(20);
    textAlign(CENTER, CENTER);
    text(emoji, centroIconoX, centroIconoY);

    fill(255);
    textSize(12);
    textStyle(BOLD);
    text(titulo, centroIconoX, y + 95);

    fill(170);
    textSize(10);
    textStyle(NORMAL);
    textAlign(CENTER, TOP);
    text(descripcion, centroIconoX, y + 120, ancho - 20, alto - 135);
  }

  // Función auxiliar para saber si el mouse está posicionado adentro del botón
  mouseSobreBoton() {
    return (mouseX >= this.btnX && mouseX <= this.btnX + this.btnAncho &&
            mouseY >= this.btnY && mouseY <= this.btnY + this.btnAlto);
  }
}