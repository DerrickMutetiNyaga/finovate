const mongoose = require('mongoose');


// Define the ClientLogo model
const clientLogoSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true }
  });
  const ClientLogo = mongoose.model('ClientLogo', clientLogoSchema);
  