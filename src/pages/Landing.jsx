import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/clerk-react'
import {
  ChevronDown,
  Sparkles,
  Wrench,
  Home,
  Shield,
  Zap,
  Star,
  ArrowRight,
  Menu,
  X,
  Droplets,
  Plug,
  Wind,
  Smartphone,
  Shirt,
  Sofa,
} from 'lucide-react'
import { fetchApiJson } from '../lib/api'
import { useOnboardStatus } from '../hooks/useOnboardStatus'
import './Landing.css'

const navLinks = [
  { id: 'services', label: 'Services' },
  { id: 'how-it-works', label: 'How it works' },
  { id: 'categories', label: 'Categories' },
  { id: 'testimonials', label: 'Reviews' },
]

const pillars = [
  {
    icon: <Home className="pillar-icon" />,
    title: 'Professionals at your doorstep',
    text: 'Skilled professionals for home, appliances, and repairs—book in a few taps.',
  },
  {
    icon: <Shield className="pillar-icon" />,
    title: 'Verified professionals',
    text: 'Background-checked, rated pros. Quality and safety built in from day one.',
  },
  {
    icon: <Zap className="pillar-icon" />,
    title: 'Same-day & scheduled',
    text: 'Instant help or book ahead. Flexible slots that fit your schedule.',
  },
]

const categories = [
  { icon: <Droplets className="cat-icon" />, label: 'Plumbing', slug: 'plumbing' },
  { icon: <Plug className="cat-icon" />, label: 'Electrical', slug: 'electrical' },
  { icon: <Wind className="cat-icon" />, label: 'AC & Appliances', slug: 'ac-appliances' },
  { icon: <Smartphone className="cat-icon" />, label: 'Electronics', slug: 'electronics' },
  { icon: <Shirt className="cat-icon" />, label: 'Salon & Spa', slug: 'salon-spa' },
  { icon: <Sofa className="cat-icon" />, label: 'Cleaning & Pest', slug: 'cleaning' },
]

const featuredServices = [
  { name: 'Plumber consultation', rating: 4.73, price: '₹49', badge: 'Instant' },
  { name: 'Electrician consultation', rating: 4.75, price: '₹49', badge: 'Instant' },
  { name: 'Full home cleaning', rating: 4.8, price: '₹979', badge: null },
  { name: 'AC service', rating: 4.77, price: '₹399', badge: null },
]

const testimonials = [
  {
    quote: 'Bridge made it so easy to get my AC fixed. The professional was on time and the pricing was transparent.',
    author: 'Priya S.',
    role: 'Customer, Bangalore',
  },
  {
    quote: 'From plumbing to electrical—one app for all home services. Highly recommend.',
    author: 'Rahul M.',
    role: 'Customer, Hyderabad',
  },
]

const footerProducts = [
  { label: 'Home services', href: '#services' },
  { label: 'Appliance repair', href: '#categories' },
  { label: 'Salon & spa', href: '#categories' },
]
const footerCompany = [
  { label: 'About us', href: '#' },
  { label: 'Careers', href: '#' },
  { label: 'Contact', href: '#' },
]
const footerLegal = [
  { label: 'Terms of service', href: '/terms' },
  { label: 'Privacy policy', href: '/privacy' },
]

function dashboardPath(role) {
  return role === 'hire' ? '/hiredashboard' : '/dashboard'
}

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { role } = useOnboardStatus()
  const toDashboard = dashboardPath(role)
  const [backendOk, setBackendOk] = useState(null)

  useEffect(() => {
    fetchApiJson('/').then(() => setBackendOk(true)).catch(() => setBackendOk(false))
  }, [])

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    setMobileMenuOpen(false)
  }

  return (
    <div className="landing">
      {/* Header */}
      <motion.header
        className="landing-header"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Link to="/" className="logo">Bridge</Link>
        <nav className="nav-links">
          {navLinks.map((link) => (
            <button
              key={link.id}
              type="button"
              className="nav-link"
              onClick={() => scrollTo(link.id)}
            >
              {link.label} <ChevronDown className="nav-chevron" aria-hidden />
            </button>
          ))}
        </nav>
        <div className="header-actions">
          <SignedOut>
            <SignInButton mode="modal">
              <button type="button" className="btn btn-ghost">Log in</button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button type="button" className="btn btn-primary">Sign up</button>
            </SignUpButton>
            <SignUpButton mode="modal">
              <button type="button" className="btn btn-cta">Get started</button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Link to={toDashboard} className="btn btn-cta">Dashboard</Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
        <button
          type="button"
          className="menu-toggle"
          aria-label="Toggle menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </motion.header>

      {mobileMenuOpen && (
        <motion.div
          className="mobile-menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {navLinks.map((link) => (
            <button key={link.id} type="button" onClick={() => scrollTo(link.id)}>
              {link.label}
            </button>
          ))}
          <SignedOut>
            <SignInButton mode="modal"><button type="button" className="mobile-btn">Log in</button></SignInButton>
            <SignUpButton mode="modal"><button type="button" className="mobile-btn primary">Sign up</button></SignUpButton>
          </SignedOut>
          <SignedIn>
            <Link to={toDashboard} className="mobile-btn primary">Dashboard</Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </motion.div>
      )}

      <main>
        {/* Hero */}
        <section id="hero" className="hero">
          <div className="hero-bg" />
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="hero-flourish" aria-hidden><Sparkles /></div>
            <motion.div
              className="hero-badge"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              Home services at your doorstep
            </motion.div>
            <h1 className="hero-title">Professional home & appliance services, one tap away</h1>
            <p className="hero-subtitle">
              From plumbing and electricals to AC repair, cleaning, and salon—book verified professionals at your convenience.
            </p>
            <motion.div
              className="hero-cta"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <SignedIn>
                <Link to={toDashboard} className="btn btn-hero">Dashboard</Link>
              </SignedIn>
              <SignedOut>
                <SignUpButton mode="modal">
                  <button type="button" className="btn btn-hero">Get started</button>
                </SignUpButton>
              </SignedOut>
            </motion.div>
            <p className="hero-tagline">India’s home services, simplified.</p>
          </motion.div>
        </section>

        {/* Pillars */}
        <section id="services" className="section pillars-section">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Why choose Bridge
          </motion.h2>
          <motion.p
            className="section-subtitle"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Trusted by thousands for home and appliance services
          </motion.p>
          <div className="pillars-grid">
            {pillars.map((item, i) => (
              <motion.div
                key={item.title}
                className="pillar-card"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="pillar-icon-wrap">{item.icon}</div>
                <h3 className="pillar-title">{item.title}</h3>
                <p className="pillar-text">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section id="categories" className="section categories-section">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Service categories
          </motion.h2>
          <motion.div
            className="categories-grid"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {categories.map((cat, i) => (
              <motion.button
                key={cat.slug}
                type="button"
                className="category-card"
                onClick={() => scrollTo('featured')}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </motion.button>
            ))}
          </motion.div>
        </section>

        {/* Featured services */}
        <section id="featured" className="section featured-section">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Popular services
          </motion.h2>
          <div className="featured-grid">
            {featuredServices.map((s, i) => (
              <motion.div
                key={s.name}
                className="featured-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                {s.badge && <span className="featured-badge">{s.badge}</span>}
                <div className="featured-rating">
                  <Star className="star" fill="currentColor" size={14} />
                  {s.rating}
                </div>
                <h4 className="featured-name">{s.name}</h4>
                <div className="featured-price">{s.price}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="section how-section">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            How it works
          </motion.h2>
          <div className="steps">
            {['Choose a service', 'Pick a slot', 'Pro at your door'].map((step, i) => (
              <motion.div
                key={step}
                className="step"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <span className="step-num">{i + 1}</span>
                <span className="step-label">{step}</span>
                {i < 2 && <ArrowRight className="step-arrow" />}
              </motion.div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="section testimonials-section">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            What customers say
          </motion.h2>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <motion.blockquote
                key={t.author}
                className="testimonial-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <p className="testimonial-quote">"{t.quote}"</p>
                <footer>
                  <strong>{t.author}</strong>
                  <span>{t.role}</span>
                </footer>
              </motion.blockquote>
            ))}
          </div>
        </section>

        {/* Trust */}
        <section className="section trust-section">
          <motion.div
            className="trust-badges"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="trust-item"><Wrench aria-hidden /> Verified pros</div>
            <div className="trust-item"><Shield aria-hidden /> Secure payments</div>
            <div className="trust-item"><Zap aria-hidden /> Quick booking</div>
          </motion.div>
        </section>

        {/* CTA strip */}
        <section className="section cta-section">
          <motion.div
            className="cta-strip"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="cta-strip-title">Ready to get started?</h2>
            <p className="cta-strip-text">Book a service in minutes.</p>
            <SignUpButton mode="modal">
              <button type="button" className="btn btn-hero">Get started now</button>
            </SignUpButton>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">Bridge</Link>
            <p>Home services at your doorstep.</p>
          </div>
          <div className="footer-links">
            <div className="footer-col">
              <h4>Services</h4>
              {footerProducts.map((l) => (
                <a key={l.label} href={l.href}>{l.label}</a>
              ))}
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              {footerCompany.map((l) => (
                <a key={l.label} href={l.href}>{l.label}</a>
              ))}
            </div>
            <div className="footer-col">
              <h4>Legal</h4>
              {footerLegal.map((l) => (
                <a key={l.label} href={l.href}>{l.label}</a>
              ))}
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Bridge. All rights reserved.</p>
          <div className="footer-staff-links">
            <Link to="/admin" className="footer-staff-link">Admin</Link>
            <span className="footer-staff-sep">·</span>
            <Link to="/support" className="footer-staff-link">Support</Link>
          </div>
          {backendOk !== null && (
            <span
              className={`backend-dot ${backendOk ? 'online' : 'offline'}`}
              title={backendOk ? 'Backend connected' : 'Backend offline'}
            >
              ●
            </span>
          )}
        </div>
      </footer>
    </div>
  )
}
