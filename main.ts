let velocidad_kmh = 0
let velocidad_ms = 0
let tiempoEntrePulsos = 0
let tiempoAnterior = 0
let tiempoActual = 0
let diametro = 0.7
let circunferencia = Math.PI * diametro
let estadoAnterior = 1
let estadoActual = 1
pins.setPull(DigitalPin.P0, PinPullMode.PullUp)
basic.forever(function () {
    estadoActual = pins.digitalReadPin(DigitalPin.P0)
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
    if (input.runningTime() - tiempoAnterior > 2000) {
        velocidad_ms = 0
        velocidad_kmh = 0
    }
    basic.pause(1)
})
basic.forever(function () {
    basic.pause(500)
    serial.writeLine("Velocidad: " + velocidad_kmh + " km/h")
})
