'use client'

import React from 'react';

interface WebpayButtonProps {
  orderId: string;
}

const WebpayButton: React.FC<WebpayButtonProps> = ({ orderId }) => {
  const handlePayment = async () => {
    try {
      const response = await fetch('/api/webpay/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      });

      if (response.ok) {
        const data = await response.json();

        const form = document.createElement('form');
        form.method = 'POST';
        form.action = data.url;
        
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'token_ws';
        input.value = data.token;
        form.appendChild(input);
        
        document.body.appendChild(form);
        form.submit();
      } else {
        alert('Error al iniciar el pago');
      }
    } catch (error) {
      console.error(error);
      alert('Error al conectar con el servidor');
    }
  };

  return (
    <button className='w-full btn-primary mt-5' onClick={handlePayment}>
      Pagar con Webpay
    </button>
  );
};

export default WebpayButton;

