class Personaje1 {
  constructor(x, y, imagenesNormal, imagenesAgachado, imgDisparo, imgPiso, imgMano, imgSentado) {
    this.x = x;
    this.y = y; 
    
    this.imagenesNormal = imagenesNormal;
    this.imagenesAgachado = imagenesAgachado;
    this.imgDisparo = imgDisparo;
    this.imgPiso = imgPiso;
    this.imgMano = imgMano;
    this.imgSentado = imgSentado;
    
    this.estado = "NORMAL"; 
    this.estadoBase = "NORMAL"; 
    
    this.frameActual = 0;
    this.factorAnimacion = 0.09; 
    this.sueloY = 460; 
    this.direccion = 1; 
    this.vivo = true; 

    this.vx = 0;             
    this.aceleracion = 0.6;  
    this.friccion = 0.82;    
    this.limiteVelocidad = 3; 
  }

  actualizar() {
    if (this.estado === 'SENTADO' || this.estado === 'DERROTADO' || this.estado === 'MANO_ARRIBA') {
      this.vx = 0;
      this.frameActual = 0;
      return;
    }

    if (keyIsDown(32)) { 
      this.estado = "DISPARANDO";
    } else {
      if (this.estado === "DISPARANDO") {
        this.estado = this.estadoBase || "NORMAL"; 
      }
    }

    if (this.estado !== "DISPARANDO") {
      if (keyIsDown(RIGHT_ARROW) || keyIsDown(39)) {
        this.vx += this.aceleracion;
        this.direccion = 1; 
      } else if (keyIsDown(LEFT_ARROW) || keyIsDown(37)) {
        this.vx -= this.aceleracion;
        this.direccion = -1; 
      }
    }

    this.vx *= this.friccion;
    this.vx = constrain(this.vx, -this.limiteVelocidad, this.limiteVelocidad);
    this.x += this.vx;

    this.x = constrain(this.x, 30, 570);
    this.y = this.sueloY; 

    let velocidadActual = abs(this.vx);

    if (this.estado === "NORMAL" || this.estado === "AGACHADO") {
      let listaAnimacion = (this.estado === "NORMAL") ? this.imagenesNormal : this.imagenesAgachado;
      
      if (velocidadActual > 0.15) {
        this.frameActual += velocidadActual * this.factorAnimacion;
        if (this.frameActual >= listaAnimacion.length) this.frameActual = 0;
      } else {
        this.frameActual = 0; 
      }
    } else if (this.estado === "DISPARANDO") {
      this.vx = 0;
      this.frameActual = 0;
    }
  }

  dibujar(estadoJuego) {
    if (!this.vivo) return;

    let miEscala = 20; 
    let anchoCaminante = 13 * miEscala;  
    let altoCaminante = 10 * miEscala;  
    let anchoCaminante1 = 20 * miEscala;

    push(); 
    translate(this.x, this.y);
    scale(this.direccion, 1); 
    
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
      let anchoPiso = 20 * miEscala;
      let altoPiso = 10 * miEscala;
      image(this.imgPiso, -anchoPiso / 2, -altoPiso, anchoPiso, altoPiso);
    }
    else if (this.estado === "MANO_ARRIBA" && this.imgMano) {
      image(this.imgMano, -anchoCaminante / 2, -altoCaminante, anchoCaminante, altoCaminante);
    }
    else if (this.estado === "SENTADO" && this.imgSentado) {
      let anchoSentado = 3 * miEscala;  
      let altoSentado = 5 * miEscala;
      let offsetX = 0;
      let offsetY = 25;

      image(this.imgSentado, (-anchoSentado / 2) + offsetX, (-altoSentado) + offsetY, anchoSentado, altoSentado);
    }
    
    pop(); 
  }

  sentarse() {
    this.estado = "SENTADO";
    this.x = 110; 
    this.y = 270;
  }

  levantarse() {
    this.estado = this.estadoBase || "NORMAL";
    this.y = this.sueloY;
  }

  levantarMano() {
    this.estado = "MANO_ARRIBA";
  }
}