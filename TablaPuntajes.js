// ============================================================
// SISTEMA DE PUNTAJES
// ============================================================

class TablaPuntajes {

  constructor() {

    this.claveStorage =
      "laGranCiudadPuntajes";

    this.puntajes =
      this.cargar();
  }


  // ==========================================================
  // CARGAR PUNTAJES
  // ==========================================================

  cargar() {

    try {

      let datos =
        localStorage.getItem(
          this.claveStorage
        );


      if (!datos) {
        return [];
      }


      let resultado =
        JSON.parse(datos);


      if (!Array.isArray(resultado)) {
        return [];
      }


      return resultado;

    }

    catch (error) {

      console.error(
        "Error al cargar puntajes:",
        error
      );

      return [];
    }
  }


  // ==========================================================
  // GUARDAR
  // ==========================================================

  guardar() {

    try {

      localStorage.setItem(
        this.claveStorage,
        JSON.stringify(
          this.puntajes
        )
      );

    }

    catch (error) {

      console.error(
        "Error al guardar puntajes:",
        error
      );
    }
  }


  // ==========================================================
  // REGISTRAR / ACTUALIZAR JUGADOR
  // ==========================================================

  registrarJugador(
    nombre,
    puntuacionPartida,
    tiempoPartida
  ) {

    nombre =
      nombre
        .trim()
        .toUpperCase();


    if (!nombre) {
      return;
    }


    // --------------------------------------------------------
    // Convertir los valores de ESTA partida a números
    // --------------------------------------------------------

    puntuacionPartida =
      Number(puntuacionPartida) || 0;


    tiempoPartida =
      Number(tiempoPartida) || 0;


    // --------------------------------------------------------
    // Buscar jugador existente
    // --------------------------------------------------------

    let jugadorExistente =
      this.puntajes.find(
        jugador =>
          jugador.nombre === nombre
      );


    // ========================================================
    // JUGADOR NUEVO
    // ========================================================

    if (!jugadorExistente) {

      this.puntajes.push({

        nombre:
          nombre,

        // Récord de puntuación de UNA partida

        puntuacion:
          puntuacionPartida,

        // Récord de tiempo de UNA partida

        tiempo:
          tiempoPartida
      });
    }


    // ========================================================
    // JUGADOR EXISTENTE
    // ========================================================

    else {

      // ------------------------------------------------------
      // PUNTUACIÓN
      // ------------------------------------------------------
      //
      // SOLO se reemplaza si esta partida fue mejor.
      //
      // Nunca se suma:
      //
      // ❌ 500 + 300 = 800
      //
      // Se hace:
      //
      // ✅ max(500, 300) = 500
      // ------------------------------------------------------

      let mejorPuntuacion =
        Number(
          jugadorExistente.puntuacion
        ) || 0;


      if (
        puntuacionPartida >
        mejorPuntuacion
      ) {

        jugadorExistente.puntuacion =
          puntuacionPartida;
      }


      // ------------------------------------------------------
      // TIEMPO
      // ------------------------------------------------------
      //
      // SOLO se reemplaza si esta partida duró más.
      //
      // Nunca se suma:
      //
      // ❌ 120 + 80 = 200
      //
      // Se hace:
      //
      // ✅ max(120, 80) = 120
      // ------------------------------------------------------

      let mejorTiempo =
        Number(
          jugadorExistente.tiempo
        ) || 0;


      if (
        tiempoPartida >
        mejorTiempo
      ) {

        jugadorExistente.tiempo =
          tiempoPartida;
      }
    }


    // ========================================================
    // ORDENAR TABLA
    // ========================================================
    //
    // Mayor puntuación primero.
    // En empate, mayor tiempo.
    //

    this.puntajes.sort(
      (a, b) => {

        let puntuacionA =
          Number(a.puntuacion) || 0;

        let puntuacionB =
          Number(b.puntuacion) || 0;


        if (
          puntuacionB !==
          puntuacionA
        ) {

          return (
            puntuacionB -
            puntuacionA
          );
        }


        let tiempoA =
          Number(a.tiempo) || 0;

        let tiempoB =
          Number(b.tiempo) || 0;


        return (
          tiempoB -
          tiempoA
        );
      }
    );


    // Guardar

    this.guardar();
  }


  // ==========================================================
  // OBTENER TABLA
  // ==========================================================

  obtenerTabla() {

    return this.puntajes;
  }


  // ==========================================================
  // BORRAR TABLA
  // ==========================================================

  borrarTabla() {

    this.puntajes = [];

    localStorage.removeItem(
      this.claveStorage
    );
  }
}