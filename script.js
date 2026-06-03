// Mostrar / ocultar loader
function mostrarLoader() {
  document.getElementById('loading').style.display = 'block';
}

function ocultarLoader() {
  document.getElementById('loading').style.display = 'none';
}

// URL de tu Apps Script Backend
const URL_API_BUSCAR = 'https://script.google.com/macros/s/AKfycbyBSp4CeV3vqWR1OMdtYTm8ix1nj97KQTegQap3o6Uz1f7uvDZeh6fcoBO6mxe8zmAm/exec';
const URL_API_DEUDORES = 'https://script.google.com/macros/s/AKfycbyBSp4CeV3vqWR1OMdtYTm8ix1nj97KQTegQap3o6Uz1f7uvDZeh6fcoBO6mxe8zmAm/exec';

// Buscar por celular
function buscar() {
  mostrarLoader();
  document.getElementById('resultados').innerHTML = '';
  const celular = document.getElementById('celular').value;

  fetch(URL_API_BUSCAR + 'celular=' + encodeURIComponent(celular))
    .then(res => res.json())
    .then(data => {
      ocultarLoader();
      mostrarCompras(data);
    })
    .catch(err => {
      ocultarLoader();
      alert('Error al obtener datos: ' + err.message);
    });
}

// Ver todos los deudores
function verDeudores() {
  mostrarLoader();
  document.getElementById('resultados').innerHTML = '';

  fetch(URL_API_DEUDORES)
    .then(res => res.json())
    .then(data => {
      ocultarLoader();
      mostrarCompras(data);
    })
    .catch(err => {
      ocultarLoader();
      alert('Error al obtener datos: ' + err.message);
    });
}

// Generar pagos pendientes (llama a backend)
function generarPagos() {
  mostrarLoader();
  fetch(URL_API_BUSCAR + 'accion=generarPagosPendientes') // puedes crear endpoint en Apps Script
    .then(res => res.text())
    .then(msg => {
      ocultarLoader();
      alert(msg);
    })
    .catch(err => {
      ocultarLoader();
      alert('Error al generar pagos: ' + err.message);
    });
}

// Calcular total pendiente
function calcularTotal(data) {
  let total = 0;
  data.forEach(d => {
    let valor = d['venta'] || "0";
    valor = valor.replace(/[^0-9]/g, "");
    total += parseInt(valor || 0);
  });
  return total.toLocaleString();
}

// Mostrar compras en tarjetas
function mostrarCompras(data) {
  if (!data || data.length === 0) {
    document.getElementById('resultados').innerHTML = "✅ No hay pendientes";
    document.getElementById('total').innerHTML = "";
    return;
  }

  const total = calcularTotal(data);
  document.getElementById('total').innerHTML = "Total pendiente: $" + total;

  let html = '';
  data.forEach(d => {
    html += `
      <div class="item">
        <div><b>📅 Fecha:</b> ${d.fecha_venta}</div>
        <div><b>📺 Producto:</b> ${d.nombre_producto}</div>
        <div><b>👤 Cliente:</b> ${d.nombre_cliente}</div>
        <div><b>✉️ Correo:</b> ${d.Correo}</div>
        <div><b>📞 Celular:</b> ${d.celular}</div>
        <div><b>💰 Valor:</b> ${d.venta}</div>
        <div><b>Estado:</b> ${d.estado_pago}</div>
        <div>
          <select onchange="cambiarEstado(this,'${d.fecha_venta}','${d.nombre_producto}','${d.Correo}','${d.celular}','${d.estado_pago}')">
            <option value="">--</option>
            <option value="Pagado">✅ Marcar pagado</option>
          </select>
        </div>
      </div>
    `;
  });

  document.getElementById('resultados').innerHTML = html;
}

// Cambiar estado de pago
function cambiarEstado(selectObj, fecha, producto, correo, celular, estadoActual) {
  const nuevo = selectObj.value;
  if (!nuevo) return;

  mostrarLoader();

  fetch(URL_API_BUSCAR + `accion=actualizarPago&fecha=${encodeURIComponent(fecha)}&producto=${encodeURIComponent(producto)}&correo=${encodeURIComponent(correo)}&celular=${encodeURIComponent(celular)}&estado=${encodeURIComponent(nuevo)}`)
    .then(res => res.text())
    .then(msg => {
      ocultarLoader();
      alert(msg);
      buscar();
    })
    .catch(err => {
      ocultarLoader();
      alert('Error al actualizar pago: ' + err.message);
    });
}