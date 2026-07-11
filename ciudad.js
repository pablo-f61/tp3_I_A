class Ciudad {
  constructor(sueloY) {
    this.tamanioBloque = 20;
    this.sueloY = sueloY; 

    // --- EDIFICIO 1: EL BANCO (El más alto - 9 filas) ---
    this.bancoMatrix = [
      [0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0],
      [1, 1, 1, 1, 1], 
      [1, 0, 1, 0, 1],
      [1, 1, 1, 1, 1], 
      [1, 0, 1, 0, 1],
      [1, 1, 1, 1, 1],
      [1, 0, 1, 0, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 0, 1, 1]
    ];

    // --- EDIFICIO 2: EL TRABAJO (Altura mediana - 7 filas) ---
    this.trabajoMatrix = [
      [0, 1, 0, 1, 0],
      [1, 1, 1, 1, 1], 
      [1, 0, 1, 0, 1],
      [1, 1, 1, 1, 1], 
      [1, 0, 1, 0, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 0, 1, 1]
    ];

    // --- EDIFICIO 3: LA CASA (El más bajo / Refugio - 5 filas) ---
    this.casaMatrix =[
      [0, 1, 1, 1, 0], 
      [1, 1, 1, 1, 1],
      [1, 0, 1, 0, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 0, 1, 1]
    ]; 
  }

  dibujar() {
    stroke(0); 
    
    // --- 1. DIBUJAR EDIFICIOS ---
    // El Banco a la izquierda (X=60)
    this.dibujarEdificio2D(this.bancoMatrix, 60);
    // El Trabajo al centro (X=250)[cite: 1]
    this.dibujarEdificio2D(this.trabajoMatrix, 250);
    // La Casa a la derecha (X=440)
    this.dibujarEdificio2D(this.casaMatrix, 440);

    // --- 2. CARTELES / NOMBRES DE LOS EDIFICIOS ---
    this.dibujarCartel("BANCO", 60, this.bancoMatrix.length);
    this.dibujarCartel("TRABAJO", 250, this.trabajoMatrix.length); //[cite: 1]
    this.dibujarCartel("CASA", 440, this.casaMatrix.length);

    // --- 3. LA CALLE ---
    fill(120, 145, 138); 
    noStroke();
    rect(0, this.sueloY, width, height - this.sueloY); 
  }

  // Función auxiliar para renderizar cada matriz
  dibujarEdificio2D(matrix, posX) {
    let altoTotal = matrix.length * this.tamanioBloque;
    let inicioY = this.sueloY - altoTotal; 

    for (let fila = 0; fila < matrix.length; fila++) {
      for (let col = 0; col < matrix[fila].length; col++) {
        if (matrix[fila][col] === 1) {
          let x = posX + (col * this.tamanioBloque);
          let y = inicioY + (fila * this.tamanioBloque);

          if (col === matrix[fila].length - 1) {
            fill(70, 60, 55); 
            quad(x + this.tamanioBloque, y, 
                 x + this.tamanioBloque + 8, y - 4, 
                 x + this.tamanioBloque + 8, y + this.tamanioBloque - 4, 
                 x + this.tamanioBloque, y + this.tamanioBloque);
          }

          // Fachada principal del bloque
          fill(100, 190, 180); 
          rect(x, y, this.tamanioBloque, this.tamanioBloque);
        }
      }
    }
  }

  // Nueva función para poner los nombres flotando arriba de los techos
  dibujarCartel(texto, posX, filasEdificio) {
    let anchoEdificio = 5 * this.tamanioBloque; // 100px
    let centroX = posX + (anchoEdificio / 2);
    let techoY = this.sueloY - (filasEdificio * this.tamanioBloque);

    // Estilo de texto arcade retro
    fill(255, 230, 100); // Letras amarillas brillantes
    noStroke();
    textAlign(CENTER, BOTTOM);
    textSize(12);
    textStyle(BOLD);
    
    // Dibujamos el texto 12 píxeles por encima del techo
    text(texto, centroX, techoY - 12);
  }
}