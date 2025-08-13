let DB = {}; // base de datos cargada

document.addEventListener("DOMContentLoaded", () => {
  fetch('data/data.json')
    .then(res => res.json())
    .then(data => {
      DB = data; // almacenamos toda la base
      console.log(DB);
      mostrarTablas();

    });
});

function formatNumber(num) {
  if (typeof num === 'number') {
    return num.toLocaleString('es-AR');
  }
  return num;
}

// Función para crear el encabezado común de las tablas
function crearEncabezadoTabla(titulo, anios) {
  const thead = document.createElement("thead");
  const trHead = document.createElement("tr");
  
  // Celda del título
  const thTitulo = document.createElement("th");
  thTitulo.className = "bg-gray rounded-top fw-normal";
  thTitulo.style.width = "300px";
  thTitulo.textContent = titulo;
  trHead.appendChild(thTitulo);

  // Celdas de anios
  anios.forEach((anio, index) => {
    const th = document.createElement("th");
    th.className = `bg-header text-white text-center fw-normal ${index === 0 ? 'top-left' : ''} ${index === anios.length-1 ? 'top-right' : ''}`;
    th.textContent = anio;
    trHead.appendChild(th);
  });
  
  thead.appendChild(trHead);
  return thead;
}

// Función para crear fila de totales
function crearFilaTotales(etiqueta, anios, valores, unidad = "") {
  const tr = document.createElement("tr");
  
  const tdLabel = document.createElement("td");
  tdLabel.innerHTML = unidad ? `${etiqueta}  <span class="float-end text-muted"> [${unidad}] </span>` : etiqueta;
  tr.appendChild(tdLabel);

  anios.forEach(anio => {
    const td = document.createElement("td");
    td.className = "text-center";
    td.textContent = formatNumber(valores[anio]);
    tr.appendChild(td);
  });
  
  return tr;
}

// Mostrar todas las tablas
function mostrarTablas() {
  const anios = Object.keys(DB.anios).sort();

  // Generación MEM Anual
  document.getElementById("generacion_mem_anual").appendChild(
    crearTablaGeneracion("GeneraciónMEM Anual", anios)
  );

  // Emisiones por Combustible
  document.getElementById("emision_generacion_termica").appendChild(
    crearTablaEmisiones("Emisión Generación Térmica", anios)
  );

  // Factor de Emisión
  document.getElementById("factor_emision_mensual").appendChild(
    crearTablaFactorEmision(anios)
  );

  // Huella de Carbono
  document.getElementById("huella_de_carbono").appendChild(
    crearTablaHuellaCarbono("Huella de Carbono", anios)
  );

  // Agregar el gráfico
  crearGraficoHuellaCarbono();
}

// Crear tabla de Generacion
function crearTablaGeneracion(title, anios) {
    const tabla = document.createElement("table");
    tabla.className = "table tabla-generacion align-middle";

  // Cabecera
      tabla.appendChild(crearEncabezadoTabla(title, anios));

  // Cuerpo
    const tbody = document.createElement("tbody");
    DB.config.combustibles.generacion.forEach(combustible => {
    const tr = document.createElement("tr");
        
    const tdNombre = document.createElement("td");
    tdNombre.className = "bg-light";
    tdNombre.innerHTML = `${combustible}  <span class="float-end text-muted"> [${DB.config.unidades.generacion}] </span>`;
    tr.appendChild(tdNombre);

    anios.forEach(anio => {
        const td = document.createElement("td");
        td.className = "text-center";
        td.textContent = formatNumber(DB.anios[anio].generacion.datos[combustible]);
        tr.appendChild(td);
        });
        
        tbody.appendChild(tr);
    });

    tabla.appendChild(tbody);
 // Pie de tabla
    const tfoot = document.createElement("tfoot");
    const totales = {};
    anios.forEach(anio => {
          totales[anio] = DB.anios[anio].generacion.total;
    });
    tfoot.appendChild(crearFilaTotales("Energía Total MEM", anios, totales, DB.config.unidades.generacion));
    tabla.appendChild(tfoot);

    return tabla;
}

// Crear tabla de Emisiones
function crearTablaEmisiones(title, anios) {
  const tabla = document.createElement("table");
  tabla.className = "table tabla-generacion align-middle";

  // Cabecera
  tabla.appendChild(crearEncabezadoTabla(title, anios));

  // Cuerpo
  const tbody = document.createElement("tbody");
  
  DB.config.combustibles.emisiones.forEach(combustible => {
    const tr = document.createElement("tr");
    
    const tdNombre = document.createElement("td");
    tdNombre.className = "bg-light";
    tdNombre.innerHTML = `${combustible}  <span class="float-end text-muted"> [${DB.config.unidades.emisiones}] </span>`;
    tr.appendChild(tdNombre);

    anios.forEach(anio => {
      const td = document.createElement("td");
      td.className = "text-center";
      td.textContent = formatNumber(DB.anios[anio].emisiones.datos[combustible]);
      tr.appendChild(td);
    });
    
    tbody.appendChild(tr);
  });

  tabla.appendChild(tbody);

  // Pie de tabla
  const tfoot = document.createElement("tfoot");
  const totales = {};
  anios.forEach(anio => {
    totales[anio] = DB.anios[anio].emisiones.total;
  });
  tfoot.appendChild(crearFilaTotales("Emisiones Totales", anios, totales, DB.config.unidades.emisiones));
  tabla.appendChild(tfoot);

  return tabla;
}

// Crear tabla de Factor de Emisión
function crearTablaFactorEmision(anios) {
  const tabla = document.createElement("table");
  tabla.className = "table tabla-generacion align-middle";
  // Cuerpo
  const tbody = document.createElement("tbody");
  const tr = document.createElement("tr");
  
  // Celda de descripción
  const tdDesc = document.createElement("td");
  tdDesc.className = "bg-gray";
  tdDesc.style.width = "300px";
  tdDesc.innerHTML = `Factor de Emisión MEM <span class="float-end text-muted">[${DB.config.unidades.factor_emision}]</span>`;
  tr.appendChild(tdDesc);

  // Celdas de valores
  anios.forEach(anio => {
    const td = document.createElement("td");
    td.className = "text-center bg-gray";
    td.textContent = formatNumber(DB.anios[anio].factor_emision);
    tr.appendChild(td);
  });
  
  tbody.appendChild(tr);
  tabla.appendChild(tbody);

  return tabla;
}

// Crear tabla de Huella de Carbono
function crearTablaHuellaCarbono(title, anios) {
  const tabla = document.createElement("table");
  tabla.className = "table tabla-generacion align-middle";

  // Cabecera
  tabla.appendChild(crearEncabezadoTabla(title, anios));

  // Cuerpo
  const tbody = document.createElement("tbody");
  
  // Energía Renovable
  const trRenovable = document.createElement("tr");
  const tdRenovableLabel = document.createElement("td");
  tdRenovableLabel.className = "bg-light";
  tdRenovableLabel.innerHTML = `Energía Renovable <span class="float-end text-muted"> [MWh]</span>`;
  trRenovable.appendChild(tdRenovableLabel);

  anios.forEach(anio => {
    const td = document.createElement("td");
    td.className = "text-center";
    td.textContent = formatNumber(DB.anios[anio].huella_carbono["Energía Renovable"]);
    trRenovable.appendChild(td);
  });
  tbody.appendChild(trRenovable);

  // Energía No Renovable
  const trNoRenovable = document.createElement("tr");
  const tdNoRenovableLabel = document.createElement("td");
  tdNoRenovableLabel.className = "bg-light";
  tdNoRenovableLabel.innerHTML = `Energía No Renovable <span class="float-end text-muted"> [MWh]</span>`;
  //tdNoRenovableLabel.textContent = "Energía No Renovable [MWh]";
  trNoRenovable.appendChild(tdNoRenovableLabel);

  anios.forEach(anio => {
    const td = document.createElement("td");
    td.className = "text-center";
    td.textContent = formatNumber(DB.anios[anio].huella_carbono["Energía No Renovable"]);
    trNoRenovable.appendChild(td);
  });
  tbody.appendChild(trNoRenovable);

  tabla.appendChild(tbody);

  // Pie de tabla
  const tfoot = document.createElement("tfoot");
  const totales = {};
  anios.forEach(anio => {
    totales[anio] = DB.anios[anio].huella_carbono.total;
  });
  tfoot.appendChild(crearFilaTotales("Huella de Carbono Total", anios, totales, DB.config.unidades.huella_carbono));
  tabla.appendChild(tfoot);

  return tabla;
}

// Configuración global para separador de miles y decimales
Highcharts.setOptions({
    lang: {
        thousandsSep: '.',
        decimalPoint: ','
    }
});

function crearGraficoHuellaCarbono() {
    Highcharts.chart('graficoHuellaCarbono', {
        chart: {
            zooming: { type: 'xy' }
        },
        title: { text: '' },
        xAxis: [{
            categories: [
                "jun-24", "jul-24", "ago-24", "sep-24",
                "oct-24", "nov-24", "dic-24", "ene-25",
                "feb-25", "mar-25", "abr-25", "may-25"
            ],
            crosshair: true
        }],
        yAxis: [
            { // ton CO₂
                labels: {
                     formatter: function () {
                        return Highcharts.numberFormat(this.value, 0, ',', '.');
                    },
                    style: { color: '#A6A6A6' }
                },
                title: {
                    text: 'ton CO₂',
                    style: { color: '#A6A6A6' },
                     align: 'high', // <--- esto lo coloca arriba
                     rotation: 0,   // opcional, para que quede horizontal
                },
                tickInterval: 500, 
                min: 0, 
                opposite: true
            },
            { // MWh
                gridLineWidth: 0,
                title: {
                    text: 'MWh',
                    style: { color: '#000000' },
                    align: 'high', 
                    rotation: 0,  
                },
                labels: {
                     formatter: function () {
                        return Highcharts.numberFormat(this.value, 0, ',', '.');
                    },
                    style: { color: '#000000' }
                }
            }
        ],
        tooltip: { shared: true, valueDecimals: 0 },
        legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'top',
            y: 10,
            backgroundColor: 'rgba(255,255,255,0.8)'
        },
        series: [
            { // Huella de Carbono
                name: 'Huella de Carbono [ton CO₂]',
                type: 'column',
                yAxis: 0,
                data: [8000, 8200, 8100, 6500, 6600, 7500, 8000, 8900, 9000, 6800, 7500, 5000],
                color: '#C4C4C4',
                borderRadius: 12,
                tooltip: { valueSuffix: ' ton CO₂' }
            },
            { // Energía Renovable
                name: 'Energía Renovable Contratada',
                type: 'spline',
                yAxis: 1,
                data: [1000, 1200, 1000, 3500, 4200, 4000, 4200, 4800, 4800, 5200, 3900, 4000],
                color: '#2F5597',
                marker: { enabled: true },
                tooltip: { valueSuffix: ' MWh' }
            },
            { // Energía No Renovable
                name: 'Energía No Renovable',
                type: 'spline',
                yAxis: 1,
                data: [17000, 17300, 18000, 14000, 14000, 16500, 17200, 19000, 19500, 15000, 16800, 10500],
                color: '#7F7F7F',
                marker: { enabled: true },
                tooltip: { valueSuffix: ' MWh' }
            }
        ]
    });
}

