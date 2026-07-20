

class Personaje1 {
  constructor(x, y, imagenesNormal, imagenesAgachado, imgDisparo, imgPiso) {
    this.x = x;
    this.y = y; 
    
    // Guardamos todos los sets de imágenes nuevos que cargaste
    this.imagenesNormal = imagenesNormal;
    this.imagenesAgachado = imagenesAgachado;
    this.imgDisparo = imgDisparo;
    this.imgPiso = imgPiso;
    
    // NUEVO: El estado inicial del Chapa es NORMAL
    
    this.estado = "NORMAL"; // Puede ser: "NORMAL", "AGACHADO", "DISPARANDO", "DERROTADO"
    this.estadoBase = "NORMAL"; // Guarda si el personaje está sano ("NORMAL") o herido ("AGACHADO")
    this.frameActual = 0;
    this.factorAnimacion = 0.09; 
    this.sueloY = 460; 
    this.direccion = 1; // Conserva el giro (1 derecha, -1 izquierda)
    this.vivo = true; 

    // Variables de física sedosa de ayer
    this.vx = 0;             
    this.aceleracion = 0.4;  
    this.friccion = 0.82;    
    this.limiteVelocidad = 3; 
  }

actualizar() {
    // Si está derrotado en el piso, se congela todo
    if (this.estado === "DERROTADO") {
      this.vx = 0;
      this.frameActual = 0;
      return;
    }

    // --- NUEVO: CONTROL DE DISPARO CON ESPACIADORA (Código 32) ---
    if (keyIsDown(32)) { 
      // Si mantenés apretado espacio, se agacha y apunta
      this.estado = "DISPARANDO";
    } else {
      // Si SOLTÁS espacio, vuelve a su estado base (que puede ser NORMAL o AGACHADO)
      // Nota: Si todavía no creamos 'this.estadoBase' en tu constructor, 
      // por ahora inicializalo en el constructor como: this.estadoBase = "NORMAL";
      if (this.estado === "DISPARANDO") {
        this.estado = this.estadoBase || "NORMAL"; 
      }
    }

    // 1. CONTROL DE TECLAS PARA MOVIMIENTO (Solo si no está disparando)
    if (this.estado !== "DISPARANDO") {
      if (keyIsDown(RIGHT_ARROW) || keyIsDown(39)) {
        this.vx += this.aceleracion;
        this.direccion = 1; 
      } else if (keyIsDown(LEFT_ARROW) || keyIsDown(37)) {
        this.vx -= this.aceleracion;
        this.direccion = -1; 
      }
    }



    // Aplicamos física de fricción
    this.vx *= this.friccion;
    this.vx = constrain(this.vx, -this.limiteVelocidad, this.limiteVelocidad);
    this.x += this.vx;

    // Límites de la pantalla
    this.x = constrain(this.x, 30, 570);
    this.y = this.sueloY; 

    // 2. CONTROL DE ANIMACIÓN SEGÚN EL ESTADO
    let velocidadActual = abs(this.vx);

    if (this.estado === "NORMAL") {
      // Camina con el set de 8 imágenes
      if (velocidadActual > 0.15) {
        this.frameActual += velocidadActual * this.factorAnimacion;
        if (this.frameActual >= this.imagenesNormal.length) this.frameActual = 0;
      } else {
        this.frameActual = 0; 
      }
    } 
    else if (this.estado === "AGACHADO") {
      // Camina herido con tu nuevo set de 5 imágenes
      if (velocidadActual > 0.15) {
        this.frameActual += velocidadActual * this.factorAnimacion;
        // Ojo acá: frena en 5 que es el largo de tus fotos caídas
        if (this.frameActual >= this.imagenesAgachado.length) this.frameActual = 0;
      } else {
        this.frameActual = 0; 
      }
    }
    else if (this.estado === "DISPARANDO") {
      // Estado de un solo cuadro levantando el brazo, frena la velocidad
      this.vx = 0;
      this.frameActual = 0;
    }
  }

  dibujar() {
    if (!this.vivo) return;

    let miEscala = 20; 
    let anchoCaminante = 13 * miEscala;  
    let altoCaminante = 10 * miEscala;  
    let anchoCaminante1 = 20* miEscala;
    // Preparar el dibujo con el giro intacto
    push(); 
    translate(this.x, this.y);
    scale(this.direccion, 1); // ¡Acá se conserva el giro para ABSOLUTAMENTE TODOS los estados!
    
    // 3. ELEGIMOS QUÉ IMAGEN TIRARLE AL LIENZO SEGÚN EL ESTADO
    if (this.estado === "NORMAL") {
      let indice = floor(this.frameActual);
      image(this.imagenesNormal[indice], -anchoCaminante / 2, -altoCaminante, anchoCaminante, altoCaminante);
    } 
    else if (this.estado === "AGACHADO") {
      let indice = floor(this.frameActual);
      image(this.imagenesAgachado[indice], -anchoCaminante / 2, -altoCaminante, anchoCaminante, altoCaminante);
    } 
    else if (this.estado === "DISPARANDO") {
      image(this.imgDisparo, -anchoCaminante1 / 2, -altoCaminante, anchoCaminante1, altoCaminante);
    } 
    else if (this.estado === "DERROTADO") {
      image(this.imgPiso, -anchoCaminante / 2, -altoCaminante, anchoCaminante1, altoCaminante);
    }
    
    pop(); 
  }
}



