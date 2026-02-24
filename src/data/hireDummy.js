// Dummy data for hire flow (frontend only)

export const DUMMY_CATEGORIES = [
  { id: 'plumbing', name: 'Plumbing', slug: 'plumbing', icon: 'wrench' },
  { id: 'electrical', name: 'Electrical', slug: 'electrical', icon: 'zap' },
  { id: 'ac_appliances', name: 'AC & Appliances', slug: 'ac_appliances', icon: 'wind' },
  { id: 'cleaning_pest', name: 'Cleaning & Pest', slug: 'cleaning_pest', icon: 'sparkles' },
  { id: 'salon_spa', name: 'Salon & Spa', slug: 'salon_spa', icon: 'scissors' },
  { id: 'electronics', name: 'Electronics', slug: 'electronics', icon: 'tv' },
  { id: 'other', name: 'Other', slug: 'other', icon: 'more-horizontal' },
]

export const CATEGORY_BLOG = {
  plumbing: {
    title: 'Plumbing near you',
    intro: 'Get trusted plumbers for taps, leaks, geysers, and more. Same-day slots available in your area. All our professionals are verified and rated by customers.',
    imagePlaceholder: 'Plumbing',
  },
  electrical: {
    title: 'Electrical services near you',
    intro: 'From wiring and switches to fan and light repairs—book licensed electricians. Quick response and transparent pricing.',
    imagePlaceholder: 'Electrical',
  },
  electronics: {
    title: 'Electronics repair near you',
    intro: 'TV, fridge, AC, washing machine—expert technicians at your doorstep. Inspection and quote before any repair.',
    imagePlaceholder: 'Electronics',
  },
  ac_appliances: {
    title: 'AC & Appliances near you',
    intro: 'AC service, installation, and appliance repairs. Certified technicians with genuine parts option.',
    imagePlaceholder: 'AC & Appliances',
  },
  cleaning_pest: {
    title: 'Cleaning & Pest control near you',
    intro: 'Deep cleaning, sanitization, and pest control. Schedule one-time or recurring visits.',
    imagePlaceholder: 'Cleaning',
  },
  salon_spa: {
    title: 'Salon & Spa at home',
    intro: 'Haircut, styling, massage, and spa services at your convenience. Skilled professionals at your door.',
    imagePlaceholder: 'Salon & Spa',
  },
  other: {
    title: 'Other services near you',
    intro: 'Tell us what you need. We connect you with the right professionals in your area.',
    imagePlaceholder: 'Other',
  },
}

export const SERVICE_OPTIONS = {
  plumbing: [
    { slug: 'tap-leak', name: 'Tap & leak repair', price: 149, rating: 4.78, reviews: 32000 },
    { slug: 'geyser', name: 'Geyser repair & installation', price: 249, rating: 4.76, reviews: 18000 },
    { slug: 'blockage', name: 'Drain blockage', price: 299, rating: 4.72, reviews: 22000 },
  ],
  electrical: [
    { slug: 'wiring', name: 'Wiring & switch', price: 199, rating: 4.77, reviews: 22000 },
    { slug: 'fan-light', name: 'Fan & light repair', price: 149, rating: 4.75, reviews: 25000 },
  ],
  electronics: [
    { slug: 'tv-repair', name: 'TV repair', price: 199, rating: 4.78, reviews: 27000 },
    { slug: 'fridge-repair', name: 'Fridge repair', price: 199, rating: 4.74, reviews: 19000 },
    { slug: 'ac-repair', name: 'AC repair', price: 299, rating: 4.75, reviews: 19000 },
    { slug: 'washing-machine', name: 'Washing machine', price: 199, rating: 4.72, reviews: 15000 },
  ],
  ac_appliances: [
    { slug: 'ac-service', name: 'AC service', price: 349, rating: 4.79, reviews: 28000 },
    { slug: 'ac-install', name: 'AC installation', price: 499, rating: 4.72, reviews: 12000 },
  ],
  cleaning_pest: [
    { slug: 'home-cleaning', name: 'Home cleaning', price: 399, rating: 4.81, reviews: 45000 },
    { slug: 'pest-control', name: 'Pest control', price: 499, rating: 4.78, reviews: 21000 },
  ],
  salon_spa: [
    { slug: 'haircut', name: 'Haircut at home', price: 199, rating: 4.74, reviews: 15000 },
    { slug: 'massage', name: 'Massage & spa', price: 599, rating: 4.82, reviews: 8000 },
  ],
  other: [
    { slug: 'other', name: 'Other service', price: 199, rating: 4.7, reviews: 5000 },
  ],
}

export const SERVICE_TIERS = [
  { id: 'starter', name: 'Starter', price: 30, deliveryDays: 1, revisions: 1 },
  { id: 'standard', name: 'Standard', price: 40, deliveryDays: 2, revisions: 2 },
  { id: 'advanced', name: 'Advanced', price: 50, deliveryDays: 3, revisions: 3 },
]

export const DUMMY_PROVIDER = {
  name: 'Ajay K.',
  rating: 4.9,
  reviews: 350,
  badge: 'TOP RATED',
  imagePlaceholder: true,
}

export const FEATURED_NEAR_YOU = [
  { name: 'Tap & leak repair', category: 'plumbing', price: '₹149', rating: 4.78 },
  { name: 'AC service', category: 'ac_appliances', price: '₹349', rating: 4.79 },
  { name: 'Home cleaning', category: 'cleaning_pest', price: '₹399', rating: 4.81 },
]

export const POPULAR_PROFESSIONALS = [
  { name: 'Rajesh K.', category: 'Plumbing', slug: 'plumbing', rating: 4.85 },
  { name: 'Priya M.', category: 'AC & Appliances', slug: 'ac_appliances', rating: 4.79 },
  { name: 'Vikram S.', category: 'Electronics', slug: 'electronics', rating: 4.82 },
  { name: 'Anita R.', category: 'Cleaning & Pest', slug: 'cleaning_pest', rating: 4.81 },
]

export const HOW_IT_WORKS = [
  { step: 1, title: 'Choose a service', text: 'Browse categories or search. Pick the problem or service you need.' },
  { step: 2, title: 'Select tier & time', text: 'Pick a package and your preferred date. Pay securely.' },
  { step: 3, title: 'Professional visits', text: 'A verified pro comes at the scheduled time and gets it done.' },
]
