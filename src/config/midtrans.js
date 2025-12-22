import midtransClient from 'midtrans-client';
import dotenv from 'dotenv';

dotenv.config();

export const snap = new midtransClient.Snap({
  isProduction: false, // sandbox dulu
  serverKey: process.env.MIDTRANS_SERVER_KEY,
});

