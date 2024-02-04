import { Contact } from '@/models/Contact';
import { mongooseConnect } from '@/lib/mongoose';

mongooseConnect();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { name, email, message } = req.body;

    const newContact = new Contact({
      name,
      email,
      message,
    });

    await newContact.save();

    return res.status(201).json({ message: 'Contact form data saved successfully', contact: newContact });
  } catch (error) {
    console.error('Error saving contact form data:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}