const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');
require('dotenv').config();

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Configurar CORS para tu dominio exacto
app.use(cors({
  origin: 'https://reviajate.com', // TU DOMINIO EXACTO
  methods: ['GET', 'POST', 'OPTIONS'], // <-- AÑADIDO OPTIONS
  allowedHeaders: ['Content-Type']
}));

// Permitir JSON en POST
app.use(express.json());

// Endpoint para crear sesión de Stripe
app.post('/crear-sesion', async (req, res) => {
  const { cantidad } = req.body;

  if (!cantidad || isNaN(cantidad)) {
    return res.status(400).json({ error: "Cantidad inválida" });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: { name: 'Tanzania para Familias' },
          unit_amount: Math.round(cantidad * 100)
        },
        quantity: 1
      }],
      mode: 'payment',
      success_url: `${req.headers.origin}/gracias.html`,
      cancel_url: `${req.headers.origin}/cancelado.html`
    });

    res.json({ id: session.id });

  } catch (err) {
    console.error('Error al crear sesión:', err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
