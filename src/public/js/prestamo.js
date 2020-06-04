window.addEventListener("load", cargaPagina);

function cargaPagina() {
  const btn = document.getElementById("boton_modal").addEventListener("click", cambiaValores);
}
function cambiaValores() {
  const monto = document.getElementById('monto_prestamo').value
  const duracion = document.getElementById('duracion').value
  const interes = document.getElementById('interes').value
  
  const monto_modal = document.getElementById('monto_prestamo_modal')
  const duracion_modal = document.getElementById('duracion_modal')
  const interes_modal = document.getElementById('interes_modal')
  const monto_total = document.getElementById('monto_total_modal')
  const monto_previsto = document.getElementById('monto_previsto_modal')
  const monto_interes_modal = document.getElementById('Monto_interes')
  const monto_interes = (monto * (interes/100))
  const montote = parseInt(monto) + parseInt(monto_interes)
  const monto_a_pagar = montote / parseInt(duracion)
  
  monto_modal.value = parseInt(monto)
  duracion_modal.value = duracion
  interes_modal.value = interes
  monto_total.value = Math.round(montote)
  monto_previsto.value = Math.round(monto_a_pagar)
  monto_interes_modal.value = monto_interes
}
