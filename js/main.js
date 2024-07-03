// Lucio Aguirre

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('investment-form');
    const resultadosDiv = document.getElementById('resultados');
    const erroresDiv = document.querySelector('.errores');
    const errorMsg = document.querySelector('.error');

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        calcularInversion();
    });

    // Validar entradas y calcular inversión
    const calcularInversion = () => {
        errorMsg.textContent = ''; // Limpiar errores previos
        erroresDiv.style.display = 'none'; // Ocultar el contenedor de errores

        try {
            const monto = parseFloat(document.getElementById('monto').value);
            const tasa = parseFloat(document.getElementById('tasa').value);
            const plazo = parseInt(document.getElementById('plazo').value);

            if (isNaN(monto) || monto <= 0) {
                throw new Error('Por favor, ingrese un monto inicial positivo y válido.');
            }
            if (isNaN(tasa) || tasa <= 0 || tasa > 100) {
                throw new Error('Por favor, ingrese una tasa de interés anual positiva y válida (0-100).');
            }
            if (isNaN(plazo) || plazo <= 0 || !Number.isInteger(plazo)) {
                throw new Error('Por favor, ingrese un plazo de inversión positivo y válido en años.');
            }

            const meses = plazo * 12;
            const tasaMensual = (tasa / 100) / 12; //Error esporádico, () por las dudas
            const montoFinal = monto * Math.pow(1 + tasaMensual, meses);

            mostrarResultados(monto, plazo, tasa, montoFinal);
            guardarHistorial(monto, plazo, tasa, montoFinal);

        } catch (error) {
            errorMsg.textContent = error.message;
            erroresDiv.style.display = 'block'; // Mostrar el contenedor de errores
        }
    };

    // Función DOM
    const mostrarResultados = (monto, plazo, tasa, montoFinal) => { //Redondeado a dos decimales
        resultadosDiv.innerHTML = `
            <p>Monto Inicial: $${monto.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</p>
            <p>Duración: ${plazo} años (${plazo * 12} meses)</p>
            <p>Tasa de Interés: ${tasa.toFixed(2)}%</p>
            <p>Monto Final: $${montoFinal.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</p>
        `;
    };

    // Función localStorage
    const guardarHistorial = (monto, plazo, tasa, montoFinal) => {
        // ARRAYS DE OBJETOS: Usamos un array para almacenar objetos que representan el historial de inversiones
        const historial = JSON.parse(localStorage.getItem('historial')) || [];
        historial.push({ monto, plazo, tasa, montoFinal, fecha: new Date() });
        localStorage.setItem('historial', JSON.stringify(historial));

        // iterar sobre el historial - FUNCIONES DE ORDEN SUPERIOR
        historial.forEach(item => {
            console.log(item);
        });
    };

    // Calcular el promedio del historial - FUNCIONES DE ORDEN SUPERIOR
    const calcularPromedio = (historial) => {
        if (historial.length === 0) return 0; // No división pro cero
        const total = historial.reduce((acc, item) => acc + item.montoFinal, 0); //call back para eficiencia
        return total / historial.length;  //Promedio
    };
});
