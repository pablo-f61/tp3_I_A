class Interfaz {
  constructor() {
    this.colorVerde = color(46, 204, 113); 

    this.btnX = 300 - 60; 
    this.btnY = 345;
    this.btnAncho = 120;
    this.btnAlto = 35;
  }

  mostrarInstrucciones(img) {
    background(20);
    
    if (img) {
      image(img, 0, 0, width, height);
    }
    
    if (this.mouseSobreBoton()) {
      fill(39, 174, 96); 
      cursor(HAND); 
    } else {
      fill(this.colorVerde);
      cursor(ARROW); 
    }
    
    rect(this.btnX, this.btnY, this.btnAncho, this.btnAlto, 5); 

    fill(10);
    textSize(14);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text("JUGAR", this.btnX + this.btnAncho / 2, this.btnY + this.btnAlto / 2);
  }

  mouseSobreBoton() {
    return (mouseX >= this.btnX && mouseX <= this.btnX + this.btnAncho &&
            mouseY >= this.btnY && mouseY <= this.btnY + this.btnAlto);
  }
}