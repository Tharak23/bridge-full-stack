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
  { id: 'services', label: 'Why Bridge' },
  { id: 'how-it-works', label: 'Process' },
  { id: 'categories', label: 'Service Areas' },
  { id: 'testimonials', label: 'Proof' },
]

const pillars = [
  {
    icon: <Home className="pillar-icon" />,
    title: 'Single place for every household task',
    text: 'From quick fixes to deep maintenance, request services in one guided flow.',
  },
  {
    icon: <Shield className="pillar-icon" />,
    title: 'Verified and reviewed professionals',
    text: 'Profiles are vetted with ratings and service history so you can choose with confidence.',
  },
  {
    icon: <Zap className="pillar-icon" />,
    title: 'Fast scheduling and transparent pricing',
    text: 'Get same-day options or pre-book appointments with clear rates shown upfront.',
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
  { name: 'Emergency plumbing support', rating: 4.73, price: '₹149', badge: 'Quick slot' },
  { name: 'Electrical safety check', rating: 4.75, price: '₹199', badge: 'Top pick' },
  { name: 'Complete home deep clean', rating: 4.8, price: '₹979', badge: null },
  { name: 'Seasonal AC tune-up', rating: 4.77, price: '₹399', badge: null },
]

const testimonials = [
  {
    quote: 'The new request flow made booking simple. I submitted once and got matched quickly.',
    author: 'Priya S.',
    role: 'Customer, Bangalore',
  },
  {
    quote: 'Bridge is now our default for home tasks because timelines, prices, and updates are clear.',
    author: 'Rahul M.',
    role: 'Customer, Hyderabad',
  },
]

const footerProducts = [
  { label: 'Home services', href: '#categories' },
  { label: 'Appliance care', href: '#categories' },
  { label: 'Beauty and wellness', href: '#categories' },
]
const footerCompany = [
  { label: 'About Bridge', href: '#' },
  { label: 'Partner with us', href: '#' },
  { label: 'Help center', href: '#' },
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
        <div className="header-brand-block">
          <Link to="/" className="logo">Bridge</Link>
          <p className="header-kicker">HOME SERVICES PLATFORM</p>
        </div>
        <div className="header-right-block">
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
                <button type="button" className="btn btn-primary">Create account</button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link to={toDashboard} className="btn btn-cta">Open dashboard</Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
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
              BRIDGE - Request. Match. Done.
            </motion.div>
            <div className="hero-grid">
              <div className="hero-copy">
                <h1 className="hero-title">Redesigned service booking built for speed and clarity</h1>
                <p className="hero-subtitle">
                  Submit requirements, discover trusted professionals, and manage payments in a single streamlined workflow.
                </p>
                <motion.div
                  className="hero-cta"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <SignedIn>
                    <Link to={toDashboard} className="btn btn-hero">Go to dashboard</Link>
                  </SignedIn>
                  <SignedOut>
                    <SignUpButton mode="modal">
                      <button type="button" className="btn btn-hero">Start free</button>
                    </SignUpButton>
                  </SignedOut>
                </motion.div>
                <p className="hero-tagline">Built for households that want faster service decisions.</p>
              </div>
              <div className="hero-panel">
                <h3>Today on Bridge</h3>
                <ul>
                  <li><strong>2 min</strong><span>Average request submission</span></li>
                  <li><strong>50k+</strong><span>Completed household jobs</span></li>
                  <li><strong>4.8/5</strong><span>Average booking experience</span></li>
                </ul>
              </div>
            </div>
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
          <div className="pillars-grid pillars-vertical">
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
                <div className="category-card-top">{cat.icon}<span>{cat.label}</span></div>
                <small>Explore services and pricing</small>
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
          <div className="steps steps-vertical">
            {['Select category and request', 'Review professionals and offers', 'Confirm booking and track updates'].map((step, i) => (
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
            <p className="cta-strip-text">Move from request to confirmation in one guided experience.</p>
            <SignUpButton mode="modal">
              <button type="button" className="btn btn-hero">Create your Bridge account</button>
            </SignUpButton>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">Bridge</Link>
            <p>Smarter home service operations, from request to payment.</p>
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
