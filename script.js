const URL_API = 'https://script.google.com/macros/s/AKfycbyBSp4CeV3vqWR1OMdtYTm8ix1nj97KQTegQap3o6Uz1f7uvDZeh6fcoBO6mxe8zmAm/exec';

// Loader
function mostrarLoader() {
  document.getElementById('loading').style.display = 'block';
}

function ocultarLoader() {
  document.getElementById('loading').style.display = 'none';
}

// Buscar por celular
function buscar() {
  mostrarLoader();
  document.getElementById('resultados').innerHTML = '';

  const celular = document.getElementById('celular').value;

  fetch(URL_API + '?celular=' + encodeURIComponent(celular))
    .then(res => res.json())
    .then(data => {
      ocultarLoader();
      mostrarCompras(data);
    })
    .catch(err => {
      ocultarLoader();
      alert('Error: ' + err.message);
    });
}

// Ver todos los deudores
function verDeudores() {
  mostrarLoader();
  document.getElementById('resultados').innerHTML = '';

  fetch(URL_API + '?accion=deudores')
    .then(res => res.json())
    .then(data => {
      ocultarLoader();
      mostrarCompras(data);
    })
    .catch(err => {
      ocultarLoader();
      alert('Error: ' + err.message);
    });
}

// Calcular total
function calcularTotal(data) {
  let total = 0;

  data.forEach(d => {
    let valor = d['venta'] || "0";
    valor = valor.replace(/[^0-9]/g, "");
    total += parseInt(valor || 0);
  });

  return total.toLocaleString();
}

// Mostrar resultados
function mostrarCompras(data) {

  if (!data || data.length === 0) {
    document.getElementById('resultados').innerHTML = "✅ No hay pendientes";
    document.getElementById('total').innerHTML = "";
    return;
  }

  const total = calcularTotal(data);
  document.getElementById('total').innerHTML = "Total pendiente: $" + total;

  let html = "";

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
      </div>
    `;
  });

  document.getElementById('resultados').innerHTML = html;
}