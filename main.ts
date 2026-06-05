namespace anemometro {
    let velocidad_kmh = 0
    let velocidad_ms = 0
    let tiempoEntrePulsos = 0
    let tiempoAnterior = 0
    let tiempoActual = 0
    let diametroCm = 7
    let circunferencia = Math.PI * (diametroCm / 100)
    let estadoAnterior = 1
    let estadoActual = 1
    let pinSensor = DigitalPin.P0
    let iniciado = false

    /**
     * Inicia el sensor para medir velocidad con un imán.
     * @param pin pin digital donde está conectado el sensor
     * @param diametroCentimetros diámetro de la rueda o hélice en centímetros
     */
    //% block="iniciar sensor en pin %pin con diámetro %diametroCentimetros cm"
    //% diametroCentimetros.defl=7
    export function iniciar(pin: DigitalPin, diametroCentimetros: number): void {
        pinSensor = pin
        diametroCm = diametroCentimetros

        // Convierte el diámetro de cm a metros
        circunferencia = Math.PI * (diametroCm / 100)

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
     * Devuelve la velocidad en kilómetros por hora con 2 decimales.
     */
    //% block="velocidad en km/h"
    export function velocidadKmH(): number {
        return Math.round(velocidad_kmh * 100) / 100
    }

    /**
     * Devuelve la velocidad en metros por segundo con 2 decimales.
     */
    //% block="velocidad en m/s"
    export function velocidadMS(): number {
        return Math.round(velocidad_ms * 100) / 100
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
