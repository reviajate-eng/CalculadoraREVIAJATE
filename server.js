// server.js
require('dotenv').config();
const express = require('express');
const Stripe = require('stripe');
const path = require('path');

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Permite recibir JSON en POST
app.use(express.json());

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint para crear sesión de Stripe
app.post('/crear-sesion', async (req, res) => {
  try {
    const { cantidad, email, fechaViaje, numPersonas } = req.body;

    // Validación básica
    if (!cantidad || isNaN(cantidad)) {
      return res.status(400).json({ error: "Cantidad inválida" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Tanzania para Familias',
            description: `Fecha: ${fechaViaje} | Personas: ${numPersonas}`,
          },
          unit_amount: Math.round(cantidad * 100), // Stripe usa céntimos
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${req.headers.origin}/gracias.html`,
      cancel_url: `${req.headers.origin}/cancelado.html`,
    });

    res.json({ id: session.id });
  } catch (err) {
    console.error('Error al crear sesión:', err);
    res.status(500).json({ error: err.message });
  }
});

// Puerto que Render asigna automáticamente
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
