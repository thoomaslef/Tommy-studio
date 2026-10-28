export const OWNER_EMAIL = 'thomaslefevre1197@gmail.com';
export const CONTACT_EMAIL = 'thomas@tommy-studio.pro';
export const CONTACT_PHONE = '06 12 94 11 25';
export const CONTACT_PHONE_HREF = 'tel:+33612941125';
/** WhatsApp : même numéro que le téléphone, message pré-rempli */
export const whatsappUrl = (text = 'Bonjour Thomas, j’ai une question sur Tommy Studio.') => `https://wa.me/33612941125?text=${encodeURIComponent(text)}`;
