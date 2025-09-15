<script>
// Referencias
const btn = document.getElementById('btnContratar');
const notaImporte = document.getElementById('notaImporte');

function actualizarNota() {
  const resultadoInput = document.getElementById('resultadoTotal');
  if (resultadoInput && resultadoInput.value) {
    notaImporte.textContent = "Consulta de Presupuesto: " + resultadoInput.value;
    btn.disabled = false;
    btn.style.backgroundColor = "#f78da7";
    btn.style.cursor = "pointer";
  } else {
    notaImporte.textContent = "Calcula primero tu presupuesto para ver el importe a pagar.";
    btn.disabled = true;
    btn.style.backgroundColor = "#ccc";
    btn.style.cursor = "not-allowed";
  }
}
setInterval(actualizarNota, 300);

btn.addEventListener('click', async () => {
  const resultadoInput = document.getElementById('resultadoTotal');
  const emailInput = document.getElementById('email');
  const fechaViajeInput = document.getElementById('fechaViaje');
  const numPersonasInput = document.getElementById('numPersonas');

  if (!resultadoInput || !resultadoInput.value) {
    alert("Por favor calcula primero el presupuesto.");
    return;
  }

  const amount = parseFloat(resultadoInput.value.replace(/\./g,"").replace(",",".").replace(/[^\d.]/g,''));
  const email = emailInput.value || "";
  const fechaViaje = fechaViajeInput.value || "";
  const numPersonas = parseInt(numPersonasInput.value) || 1;

  try {
    // ⚡ Cambié la URL para que apunte a tu endpoint /crear-sesion
    const res = await fetch("https://calculadorareviajate-prueba.onrender.com/crear-sesion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cantidad: amount, email, fechaViaje, numPersonas })
    });

    const data = await res.json();
    console.log("Respuesta del backend:", data); // ✅ log de depuración

    if (!data.id) {
      alert("No se pudo crear la sesión de pago. Revisa la consola.");
      return;
    }

    const stripe = Stripe("pk_live_51LzOJEFMJHhGk44K4EB5xM39Ac6xEEmMfoa1F7INe6czKS2HwpUHa5TQtng0n4Z7aHrvScZFFlkKVyhthJRawOMx00iJZREEQ9");
    await stripe.redirectToCheckout({ sessionId: data.id });

  } catch(err) {
    console.error(err);
    alert("Error al iniciar el pago. Revisa la consola.");
  }
});
</script>
