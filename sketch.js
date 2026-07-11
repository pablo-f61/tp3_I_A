let ciudad;
let personaje;
let interfaz;
let imgInstrucciones; // Declarada arriba
let sueloY = 320;

// Máquina de estados: 2 = Instrucciones, 3 = Juego
let estado = 2; 

// ¡IMPORTANTE! El preload va SIEMPRE antes del setup
function preload(){
  // Corrección: es loadImage (con 'I' mayúscula y 'age' al final)
  imgInstrucciones = loadImage("img/instrucciones.png"); 
}

function setup() {
  createCanvas(600, 400);
  
  ciudad = new Ciudad(sueloY);
  personaje = new Personaje1(sueloY);
  interfaz = new Interfaz();
}

function draw() {
  if (estado === 2) {
    // Le pasamos la imagen cargada a la interfaz para que la dibuje
    interfaz.mostrarInstrucciones(imgInstrucciones);
  } else if (estado === 3) {
    background(90, 140, 170);
    ciudad.dibujar();
    personaje.actualizar();
    personaje.dibujar();
  }
}

function mousePressed() {
  if (estado === 2 && interfaz.mouseSobreBoton()) {
    cursor(ARROW); 
    estado = 3;    
  }
}



class Interfaz {
  constructor() {
    this.colorVerde = color(46, 204, 113); 

    // Mantenemos el botón abajo en el centro
    this.btnX = 300 - 60; 
    this.btnY = 345;
    this.btnAncho = 120;
    this.btnAlto = 35;
  }

  mostrarInstrucciones(imagen) {
    // 1. Dibujamos la imagen de fondo ocupando todo el canvas (600x400)
    image(imagen, 0, 0, width, height);
    
    // 2. Dibujamos el botón "JUGAR" encima de la imagen
    if (this.mouseSobreBoton()) {
      fill(39, 174, 96); // Feedback visual
      cursor(HAND); 
    } else {
      fill(this.colorVerde);
      cursor(ARROW); 
    }
    
    rect(this.btnX, this.btnY, this.btnAncho, this.btnAlto, 5); 

    // Texto del botón
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