const URL_API = 'https://script.google.com/macros/s/AKfycbyBSp4CeV3vqWR1OMdtYTm8ix1nj97KQTegQap3o6Uz1f7uvDZeh6fcoBO6mxe8zmAm/exec';

function mostrarLoader(){ document.getElementById('loading').style.display='block'; }
function ocultarLoader(){ document.getElementById('loading').style.display='none'; }

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

function verDeudores(){
  mostrarLoader();
  fetch(URL_API + '?accion=deudores')
    .then(res=>res.json())
    .then(data=>{
      ocultarLoader();
      mostrar(data);
    });
}

function generarPagos(){
  mostrarLoader();
  fetch(URL_API + '?accion=generarPagos')
    .then(res=>res.json())
    .then(data=>{
      ocultarLoader();
      alert(data.mensaje);
    });
}

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
      <div><b>Fecha:</b> ${d.fecha_venta}</div>
      <div><b>Producto:</b> ${d.nombre_producto}</div>
      <div><b>Cliente:</b> ${d.nombre_cliente}</div>
      <div><b>Correo:</b> ${d.Correo}</div>
      <div><b>Celular:</b> ${d.celular}</div>
      <div><b>Valor:</b> ${d.venta}</div>
      <div><b>Estado:</b> ${d.estado_pago}</div>
    </div>`;
  });

  document.getElementById('total').innerHTML = "Total: $" + total.toLocaleString();
  document.getElementById('resultados').innerHTML = html;
}
