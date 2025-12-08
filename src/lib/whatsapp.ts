export const buildWhatsAppLink = (message: string) => {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "79991234567";
  const encodedMessage = encodeURIComponent(message);

  return `https://wa.me/${phone}?text=${encodedMessage}`;
};
