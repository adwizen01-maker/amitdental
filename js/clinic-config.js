/**
 * Amit Dental Clinic - Single Page Website Configuration
 */

const CLINIC_CONFIG = {
  name: "Amit Dental Clinic",
  tagline: "A Healthier Smile Starts Here.",
  locationShort: "Hiran Magri, Udaipur, Rajasthan",
  
  contact: {
    phone: "+91 98877 90414",
    phoneRaw: "+919887790414",
    callLink: "tel:+919887790414",
    whatsappNumber: "919887790414",
    whatsappLink: "https://wa.me/919887790414",
    whatsappMessage: "Hello Amit Dental Clinic, I would like to enquire about a dental appointment.",
    whatsappFullUrl: "https://wa.me/919887790414?text=Hello%20Amit%20Dental%20Clinic%2C%20I%20would%20like%20to%20enquire%20about%20a%20dental%20appointment."
  },

  address: {
    full: "Riddhi Siddhi Complex, 3 M-23-A, Hiran Magri Main Road, opposite Suzuki Showroom (Guru Naman Motors), near Axis Bank, Panchsheel Market, Hiran Magri, Sector 5, Prabhat Nagar, Udaipur, Rajasthan 313002",
    short: "Sector 5, Hiran Magri Main Road, Udaipur",
    googleMapsDirectionsUrl: "https://www.google.com/maps/search/?api=1&query=Amit+Dental+Clinic+Riddhi+Siddhi+Complex+Sector+5+Hiran+Magri+Udaipur+Rajasthan+313002",
    googleMapsEmbedUrl: "https://maps.google.com/maps?q=Riddhi+Siddhi+Complex+Sector+5+Hiran+Magri+Udaipur+Rajasthan+313002&t=&z=15&ie=UTF8&iwloc=&output=embed"
  },

  appointment: {
    formEndpoint: "https://formspree.io/f/mqaejkwq"
  }
};

if (typeof window !== "undefined") {
  window.CLINIC_CONFIG = CLINIC_CONFIG;
}
