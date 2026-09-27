class Personaje {

  constructor(
    x,
    y,
    imagenesNormal,
    imagenesAgachado,
    imgDisparo,
    imgPiso,
    imgMano,
    imgSentado
  ) {

    this.x = x;
    this.y = y;


    // ======================================================
    // IMÁGENES
    // ======================================================

    this.imagenesNormal =
      imagenesNormal;

    this.imagenesAgachado =
      imagenesAgachado;

    this.imgDisparo =
      imgDisparo;

    this.imgPiso =
      imgPiso;

    this.imgMano =
      imgMano;

    this.imgSentado =
      imgSentado;

    this.imgPersonajeTrabajando =
      null;


    // ======================================================
    // ESTADO
    // ======================================================

    this.estado = "NORMAL";
    this.estadoBase = "NORMAL";

    this.vivo = true;


    // ======================================================
    // ANIMACIÓN
    // ======================================================

    this.frameActual = 0;
    this.factorAnimacion = 0.09;


    // ======================================================
    // MOVIMIENTO
    // ======================================================

    this.sueloY = 460;

    this.direccion = 1;

    this.vx = 0;

    this.aceleracion = 0.6;

    this.friccion = 0.82;

    this.limiteVelocidad = 3;
  }


  // ========================================================
  // ACTUALIZAR
  // ========================================================

  actualizar() {

    // ------------------------------------------------------
    // ESTADOS SIN MOVIMIENTO
    // ------------------------------------------------------

    if (
      this.estado === "SENTADO" ||
      this.estado === "TRABAJANDO" ||
      this.estado === "DERROTADO" ||
      this.estado === "MANO_ARRIBA"
    ) {

      this.vx = 0;

      this.frameActual = 0;

      return;
    }


    // ------------------------------------------------------
    // DISPARANDO
    // ------------------------------------------------------

    if (keyIsDown(32)) {

      this.estado = "DISPARANDO";

    }

    else {

      if (
        this.estado === "DISPARANDO"
      ) {

        this.estado =
          this.estadoBase ||
          "NORMAL";
      }
    }


    // ------------------------------------------------------
    // MOVIMIENTO
    // ------------------------------------------------------

    if (
      this.estado !== "DISPARANDO"
    ) {

      if (
        keyIsDown(RIGHT_ARROW) ||
        keyIsDown(39)
      ) {

        this.vx +=
          this.aceleracion;

        this.direccion = 1;
      }


      else if (
        keyIsDown(LEFT_ARROW) ||
        keyIsDown(37)
      ) {

        this.vx -=
          this.aceleracion;

        this.direccion = -1;
      }
    }


    // ------------------------------------------------------
    // FRICCIÓN
    // ------------------------------------------------------

    this.vx *=
      this.friccion;


    // ------------------------------------------------------
    // VELOCIDAD MÁXIMA
    // ------------------------------------------------------

    this.vx =
      constrain(
        this.vx,
        -this.limiteVelocidad,
        this.limiteVelocidad
      );


    // ------------------------------------------------------
    // POSICIÓN
    // ------------------------------------------------------

    this.x +=
      this.vx;


    this.x =
      constrain(
        this.x,
        -20,
        620
      );


    // ------------------------------------------------------
    // SUELO
    // ------------------------------------------------------

    this.y =
      this.sueloY;


    // ------------------------------------------------------
    // ANIMACIÓN
    // ------------------------------------------------------

    let velocidadActual =
      abs(
        this.vx
      );


    if (
      this.estado === "NORMAL" ||
      this.estado === "AGACHADO"
    ) {

      let listaAnimacion =
        (
          this.estado === "NORMAL"
        )
          ? this.imagenesNormal
          : this.imagenesAgachado;


      if (
        listaAnimacion &&
        listaAnimacion.length > 0
      ) {

        if (
          velocidadActual > 0.15
        ) {

          this.frameActual +=
            velocidadActual *
            this.factorAnimacion;


          if (
            this.frameActual >=
            listaAnimacion.length
          ) {

            this.frameActual = 0;
          }

        }

        else {

          this.frameActual = 0;
        }
      }
    }


    else if (
      this.estado === "DISPARANDO"
    ) {

      this.vx = 0;

      this.frameActual = 0;
    }
  }


  // ========================================================
  // DIBUJAR
  // ========================================================

  dibujar() {

    if (!this.vivo) {
      return;
    }


    let miEscala = 20;

    let anchoCaminante =
      13 * miEscala;

    let altoCaminante =
      10 * miEscala;

    let anchoCaminante1 =
      20 * miEscala;


    push();


    translate(
      this.x,
      this.y
    );


    scale(
      this.direccion,
      1
    );


    // ======================================================
    // NORMAL
    // ======================================================

    if (
      this.estado === "NORMAL"
    ) {

      if (
        this.imagenesNormal &&
        this.imagenesNormal.length > 0
      ) {

        let indice =
          floor(
            this.frameActual
          );

        image(
          this.imagenesNormal[indice],
          -anchoCaminante / 2,
          -altoCaminante,
          anchoCaminante,
          altoCaminante
        );
      }
    }


    // ======================================================
    // AGACHADO
    // ======================================================

    else if (
      this.estado === "AGACHADO"
    ) {

      if (
        this.imagenesAgachado &&
        this.imagenesAgachado.length > 0
      ) {

        let indice =
          floor(
            this.frameActual
          );

        image(
          this.imagenesAgachado[indice],
          -anchoCaminante / 2,
          -altoCaminante,
          anchoCaminante,
          altoCaminante
        );
      }
    }


    // ======================================================
    // DISPARANDO
    // ======================================================

    else if (
      this.estado === "DISPARANDO"
    ) {

      if (this.imgDisparo) {

        image(
          this.imgDisparo,
          -anchoCaminante1 / 2,
          -altoCaminante,
          anchoCaminante1,
          altoCaminante
        );
      }
    }


    // ======================================================
    // DERROTADO
    // ======================================================

    else if (
      this.estado === "DERROTADO"
    ) {

      if (this.imgPiso) {

        let anchoPiso =
          20 * miEscala;

        let altoPiso =
          10 * miEscala;


        image(
          this.imgPiso,
          -anchoPiso / 2,
          -altoPiso,
          anchoPiso,
          altoPiso
        );
      }
    }


    // ======================================================
    // MANO ARRIBA
    // ======================================================

    else if (
      this.estado === "MANO_ARRIBA"
    ) {

      if (this.imgMano) {

        image(
          this.imgMano,
          -anchoCaminante / 2,
          -altoCaminante,
          anchoCaminante,
          altoCaminante
        );
      }
    }


    // ======================================================
    // SENTADO
    // ======================================================

    else if (
      this.estado === "SENTADO"
    ) {

      if (this.imgSentado) {

        let anchoSentado =
          3 * miEscala;

        let altoSentado =
          5 * miEscala;

        let offsetX = 0;
        let offsetY = 25;


        image(
          this.imgSentado,
          (-anchoSentado / 2) + offsetX,
          (-altoSentado) + offsetY,
          anchoSentado,
          altoSentado
        );
      }
    }


    // ======================================================
    // TRABAJANDO
    // ======================================================

    else if (
      this.estado === "TRABAJANDO"
    ) {

      if (
        this.imgPersonajeTrabajando
      ) {

        let anchoTrabajando =
          5 * miEscala;

        let altoTrabajando =
          6 * miEscala;

        let offsetX = 0;
        let offsetY = 15;


        image(
          this.imgPersonajeTrabajando,
          (-anchoTrabajando / 2) + offsetX,
          (-altoTrabajando) + offsetY,
          anchoTrabajando,
          altoTrabajando
        );
      }
    }


    pop();
  }


  // ========================================================
  // SENTARSE
  // ========================================================

  sentarse() {

    this.estado = "SENTADO";

    this.vx = 0;

    this.x = 110;

    this.y = 280;
  }


  // ========================================================
  // LEVANTARSE
  // ========================================================

  levantarse() {

    this.estado =
      this.estadoBase ||
      "NORMAL";

    this.vx = 0;

    this.y =
      this.sueloY;
  }


  // ========================================================
  // LEVANTAR MANO
  // ========================================================

  levantarMano() {

    this.estado =
      "MANO_ARRIBA";

    this.vx = 0;
  }


  // ========================================================
  // TRABAJAR
  // ========================================================

  trabajar() {

    this.estado =
      "TRABAJANDO";

    this.vx = 0;

    this.y = 270;
  }


  // ========================================================
  // DEJAR DE TRABAJAR
  // ========================================================

  levantarseDeTrabajar() {

    this.estado =
      this.estadoBase ||
      "NORMAL";

    this.vx = 0;

    this.y =
      this.sueloY;
  }
}