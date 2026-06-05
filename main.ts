namespace anemometro {
    let velocidad_kmh = 0
    let velocidad_ms = 0
    let tiempoEntrePulsos = 0
    let tiempoAnterior = 0
    let tiempoActual = 0
    let diametro = 0.07
    let circunferencia = Math.PI * diametro
    let estadoAnterior = 1
    let estadoActual = 1
    let pinSensor = DigitalPin.P0
    let iniciado = false

    /**
     * Inicia el sensor para medir velocidad con un imán.
     * @param pin pin digital donde está conectado el sensor
     * @param diametroMetros diámetro de la rueda o hélice en metros
     */
    //% block="iniciar sensor en pin %pin con diámetro %diametroMetros m"
    //% diametroMetros.defl=0.07
    export function iniciar(pin: DigitalPin, diametroMetros: number): void {
        pinSensor = pin
        diametro = diametroMetros
        circunferencia = Math.PI * diametro

        velocidad_kmh = 0
        velocidad_ms = 0
        tiempoAnterior = 0
        estadoAnterior = 1

        pins.setPull(pinSensor, PinPullMode.PullUp)

        if (!iniciado) {
            iniciado = true

            control.inBackground(function () {
                while (true) {
                    estadoActual = pins.digitalReadPin(pinSensor)

                    // Detecta cuando pasa el imán
                    if (estadoAnterior == 1 && estadoActual == 0) {
                        tiempoActual = input.runningTime()

                        if (tiempoAnterior > 0) {
                            tiempoEntrePulsos = tiempoActual - tiempoAnterior
                            velocidad_ms = circunferencia / (tiempoEntrePulsos / 1000)
                            velocidad_kmh = velocidad_ms * 3.6
                        }

                        tiempoAnterior = tiempoActual
                    }

                    estadoAnterior = estadoActual

                    // Si no detecta vueltas por 2 segundos, velocidad = 0
                    if (tiempoAnterior > 0 && input.runningTime() - tiempoAnterior > 2000) {
                        velocidad_ms = 0
                        velocidad_kmh = 0
                    }

                    basic.pause(1)
                }
            })
        }
    }

    /**
     * Devuelve la velocidad en kilómetros por hora.
     */
    //% block="velocidad en km/h"
    export function velocidadKmH(): number {
        return velocidad_kmh
    }

    /**
     * Devuelve la velocidad en metros por segundo.
     */
    //% block="velocidad en m/s"
    export function velocidadMS(): number {
        return velocidad_ms
    }

    /**
     * Reinicia la medición de velocidad.
     */
    //% block="reiniciar medición"
    export function reiniciar(): void {
        velocidad_kmh = 0
        velocidad_ms = 0
        tiempoAnterior = 0
    }
}
