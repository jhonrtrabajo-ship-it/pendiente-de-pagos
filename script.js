const URL_API = 'https://script.google.com/macros/s/AKfycbyBSp4CeV3vqWR1OMdtYTm8ix1nj97KQTegQap3o6Uz1f7uvDZeh6fcoBO6mxe8zmAm/exec';

function mostrarLoader(){ document.getElementById('loading').style.display='block'; }
function ocultarLoader(){ document.getElementById('loading').style.display='none'; }

// 🔍 Buscar
function buscar(){
  mostrarLoader();
  const celular = document.getElementById('celular').value;

  fetch(URL_API + '?celular=' + encodeURIComponent(celular))
    .then(res=>res.json())
    .then(data=>{
      ocultarLoader();
      mostrar(data);
    });
}

// 📋 Ver todos
function verDeudores(){
  mostrarLoader();

  fetch(URL_API + '?accion=deudores')
    .then(res=>res.json())
    .then(data=>{
      ocultarLoader();
      mostrar(data);
    });
}

// 📨 Generar pagos
function generarPagos(){
  mostrarLoader();

  fetch(URL_API + '?accion=generarPagos')
    .then(res=>res.json())
    .then(data=>{
      ocultarLoader();
      alert(data.mensaje);
    });
}

// ✅ Marcar pagado (FIX)
function marcarPagado(fecha, producto, correo, celular){

  mostrarLoader();

  const params = new URLSearchParams({
    accion: "actualizarPago",
    fecha_venta: fecha,
    nombre_producto: producto,
    Correo: correo,
    celular: celular,
    nuevo_estado: "Pagado"
  });

  fetch(URL_API + "?" + params.toString())
    .then(res=>res.json())
    .then(data=>{
      ocultarLoader();

      if(data.ok){
        alert("✅ Pago actualizado");
        verDeudores();
      } else {
        alert("❌ No se pudo actualizar");
      }
    });
}

// 🎯 Mostrar
function mostrar(data){
  if(!data || data.length===0){
    document.getElementById('resultados').innerHTML="No hay datos";
    return;
  }

  let total = 0;
  let html = "";

  data.forEach(d=>{
    let valor = (d.venta||"0").replace(/[^0-9]/g,"");
    total += parseInt(valor||0);

    html += `
    <div class="item">
      <div><b>📅 Fecha:</b> ${d.fecha_venta}</div>
      <div><b>📺 Producto:</b> ${d.nombre_producto}</div>
      <div><b>👤 Cliente:</b> ${d.nombre_cliente}</div>
      <div><b>✉️ Correo:</b> ${d.Correo}</div>
      <div><b>📞 Celular:</b> ${d.celular}</div>
      <div><b>💰 Valor:</b> ${d.venta}</div>
      <div><b>Estado:</b> ${d.estado_pago}</div>

      <button onclick="marcarPagado('${d.fecha_venta}','${d.nombre_producto}','${d.Correo}','${d.celular}')">
        ✅ Marcar pagado
      </button>
    </div>`;
  });

  document.getElementById('total').innerHTML = "Total: $" + total.toLocaleString();
  document.getElementById('resultados').innerHTML = html;
}
