import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Car, Shield, Clock, MapPin, Compass, ArrowRight, Star, Heart, Award, CheckCircle2, ChevronRight, Mail } from 'lucide-react';
import Navbar from '../components/Navbar';

const Home = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [stats, setStats] = useState({ drivers: 0, rides: 0, rating: 0 });

  // Typewriter effect state
  const words = ["Quick Cabs", "Safe Travels", "Fixed Prices", "Ride Smart"];
  const [wordIdx, setWordIdx] = useState(0);
  const [subText, setSubText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer;
    const currentWord = words[wordIdx];
    
    if (isDeleting) {
      timer = setTimeout(() => {
        setSubText(currentWord.substring(0, subText.length - 1));
      }, 50);
    } else {
      timer = setTimeout(() => {
        setSubText(currentWord.substring(0, subText.length + 1));
      }, 100);
    }

    if (!isDeleting && subText === currentWord) {
      timer = setTimeout(() => setIsDeleting(true), 1500);
    } else if (isDeleting && subText === "") {
      setIsDeleting(false);
      setWordIdx((prev) => (prev + 1) % words.length);
    }

    return () => clearTimeout(timer);
  }, [subText, isDeleting, wordIdx]);

  // Seeding stats increment on mount
  useEffect(() => {
    const duration = 2000;
    const steps = 50;
    const intervalTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      setStats({
        drivers: Math.round((520 / steps) * step),
        rides: Math.round((12000 / steps) * step),
        rating: Number(((4.8 / steps) * step).toFixed(1))
      });

      if (step >= steps) {
        clearInterval(timer);
        setStats({ drivers: 520, rides: 12000, rating: 4.8 });
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  const stepsData = [
    {
      title: "Set Route & Schedule",
      desc: "Specify your pickup city, drop destination, and time constraints on our simple wizard.",
      icon: <MapPin className="h-6 w-6 text-primary" />,
      detail: "Sees real-time route path distance instantly."
    },
    {
      title: "Compare & Choose",
      desc: "Sort through Hatchbacks, Sedans, SUVs, and Bikes. Select matching price per kilometer rates.",
      icon: <Car className="h-6 w-6 text-secondary" />,
      detail: "Select vehicles tailored to luggage limits and seats."
    },
    {
      title: "Authorize Sandbox Checkout",
      desc: "Complete checkout simulation securely using our Stripe sandbox portal.",
      icon: <Shield className="h-6 w-6 text-accent" />,
      detail: "Updates reservation status and notifies tracking channels."
    },
    {
      title: "Live Ride Tracking",
      desc: "Join real-time socket updates and observe the cab navigating along map curves.",
      icon: <Compass className="h-6 w-6 text-emerald-500" />,
      detail: "Simulate driver transit and coordinates on custom SVGs."
    }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-lightbg transition-colors duration-300">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-darkbg bg-gradient-primary animate-gradient px-4 py-24 text-white sm:px-6 lg:px-8">
        {/* Animated background particles simulation */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 h-32 w-32 rounded-full bg-cyan-400 blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 h-44 w-44 rounded-full bg-pink-400 blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="mx-auto max-w-7xl relative z-10">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            
            {/* Content info */}
            <div className="space-y-8 text-left">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold tracking-wider text-secondary uppercase border border-white/10 backdrop-blur-md">
                ✨ Modernized MERN Travel Experience
              </span>
              
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
                Looking For <br />
                <span className="text-secondary inline-block min-w-[320px] font-black underline decoration-accent decoration-wavy">
                  {subText}
                </span>
                <span className="animate-pulse">|</span>
              </h1>
              
              <p className="max-w-xl text-lg text-slate-200 font-light leading-relaxed">
                Experience premium city transit. Instant booking estimations, verified driver records, transparent Indian Rupee rates, and real-time SVG location tracking.
              </p>

              {/* Trust counters badges */}
              <div className="grid grid-cols-3 gap-4 border-y border-white/10 py-6 max-w-lg">
                <div>
                  <p className="text-2xl font-black text-secondary">{stats.drivers}+</p>
                  <p className="text-xs text-slate-400 font-semibold mt-1">Professional Drivers</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-accent">{stats.rides}+</p>
                  <p className="text-xs text-slate-400 font-semibold mt-1">Completed Rides</p>
                </div>
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-1">
                    <p className="text-2xl font-black text-yellow-400">{stats.rating}</p>
                    <Star className="h-5 w-5 fill-yellow-400 stroke-none" />
                  </div>
                  <p className="text-xs text-slate-400 font-semibold mt-1">Customer Reviews</p>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-2xl bg-secondary px-6 py-4 text-base font-bold text-slate-950 shadow-lg hover:bg-secondary-light transition transform hover:-translate-y-0.5 duration-200"
                >
                  Get Started <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-6 py-4 text-base font-bold text-white border border-white/10 hover:bg-white/20 transition duration-200"
                >
                  Passenger Login
                </Link>
              </div>
            </div>

            {/* Immersive Glassmorphic Illustration Card */}
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-secondary to-primary opacity-30 blur-2xl animate-pulse"></div>
              <div className="relative rounded-3xl border border-white/10 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-xl text-left space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">Route Estimation</h3>
                    <p className="text-xs text-slate-400">Delhi NCR Commute</p>
                  </div>
                  <span className="rounded-full bg-secondary/15 px-3 py-1 text-xs font-bold text-secondary border border-secondary/20">
                    28 km
                  </span>
                </div>

                {/* Vertical Step Timeline */}
                <div className="space-y-4 py-2">
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-2.5 w-2.5 rounded-full bg-secondary"></div>
                      <div className="h-8 w-0.5 bg-slate-700"></div>
                    </div>
                    <div className="text-xs">
                      <p className="font-bold text-slate-300">Connaught Place, New Delhi</p>
                      <p className="text-slate-500">Pick-up spot</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-2.5 w-2.5 rounded-full bg-accent"></div>
                    <div className="text-xs">
                      <p className="font-bold text-slate-300">Cyber City, Gurugram</p>
                      <p className="text-slate-500">Drop Destination</p>
                    </div>
                  </div>
                </div>

                {/* Estimator */}
                <div className="flex justify-between items-end border-t border-white/10 pt-5">
                  <div>
                    <p className="text-xs text-slate-400">Computed Fare</p>
                    <p className="text-3xl font-black text-white mt-1">₹336.00</p>
                  </div>
                  <span className="text-[10px] text-emerald-450 font-semibold bg-emerald-950/20 border border-emerald-900/30 px-2 py-1 rounded-lg">
                    No Surge Pricing
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Feature Section with Glassmorphic Cards */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center space-y-4">
          <span className="text-xs font-bold text-primary tracking-widest uppercase bg-primary/10 px-3 py-1 rounded-full">
            Advanced Utilities
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Designed for Commuters</h2>
          <p className="mx-auto max-w-xl text-slate-500 text-sm">We combine clean aesthetics with complete operational transparency.</p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          
          {/* Card 1 */}
          <div className="group rounded-3xl border border-slate-200 bg-white p-8 text-left shadow-sm hover:shadow-md transition duration-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-24 w-24 bg-primary/5 rounded-bl-full group-hover:scale-110 transition duration-200"></div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6">
              <Car className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Diverse Fleet Selection</h3>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              Toggle among Hatchbacks, Sedans, SUVs, or Quick Bikes. Check pricing metrics and seat constraints in real-time.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group rounded-3xl border border-slate-200 bg-white p-8 text-left shadow-sm hover:shadow-md transition duration-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-24 w-24 bg-secondary/5 rounded-bl-full group-hover:scale-110 transition duration-200"></div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/10 text-secondary mb-6">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Verified Driver Operations</h3>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              Every driver is vetted and verified. Security details, plate numbers, and passenger reviews are available instantly.
            </p>
          </div>

          {/* Card 3 */}
          <div className="group rounded-3xl border border-slate-200 bg-white p-8 text-left shadow-sm hover:shadow-md transition duration-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-24 w-24 bg-accent/5 rounded-bl-full group-hover:scale-110 transition duration-200"></div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent mb-6">
              <Compass className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">WebSocket Live Tracking</h3>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              Observe your cab's progress live. Watch vector coordinates update on a customized SVG map container in real-time.
            </p>
          </div>

        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-slate-100/60 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-4 mb-16">
            <span className="text-xs font-bold text-secondary tracking-widest uppercase bg-secondary/10 px-3 py-1 rounded-full">
              Operation Guide
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">How It Works</h2>
            <p className="mx-auto max-w-xl text-slate-500 text-sm">Experience our simplified MERN-based booking process.</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            
            {/* Step Selection List */}
            <div className="space-y-4 text-left">
              {stepsData.map((step, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`cursor-pointer rounded-2xl border p-5 transition-all duration-300 flex items-start gap-4 ${
                    activeStep === idx
                      ? 'border-primary bg-white shadow-md'
                      : 'border-slate-200 bg-transparent hover:border-slate-350'
                  }`}
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition ${
                    activeStep === idx ? 'bg-primary text-white' : 'bg-slate-200 text-slate-650'
                  }`}>
                    {step.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">{step.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive Preview Panel */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-md text-left space-y-6">
              <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                Step {activeStep + 1} Preview
              </span>
              
              <h3 className="text-2xl font-bold text-slate-900">{stepsData[activeStep].title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{stepsData[activeStep].desc}</p>
              
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 text-xs font-medium text-slate-700 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                <span>{stepsData[activeStep].detail}</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Testimonials Section */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <span className="text-xs font-bold text-accent tracking-widest uppercase bg-accent/10 px-3 py-1 rounded-full">
            Passenger Reviews
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">What Passengers Say</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-left shadow-sm hover:shadow-md transition">
            <div className="flex gap-1 mb-4 text-yellow-500">
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              "UCab has completely simplified my daily commute to Gurugram. The route distance estimate is accurate, and the sandbox card simulation worked perfectly!"
            </p>
            <div className="mt-6 flex items-center gap-3 border-t pt-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center">A</div>
              <div>
                <p className="text-sm font-bold text-slate-800">Amit Sharma</p>
                <p className="text-xs text-slate-450">Verified Rider</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-left shadow-sm hover:shadow-md transition">
            <div className="flex gap-1 mb-4 text-yellow-500">
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              "The custom tracking simulator on the bookings screen is amazing. Watching the small navigation vector move along the line is so clean. Great UI design!"
            </p>
            <div className="mt-6 flex items-center gap-3 border-t pt-4">
              <div className="h-10 w-10 rounded-full bg-secondary/10 text-secondary font-bold flex items-center justify-center">P</div>
              <div>
                <p className="text-sm font-bold text-slate-800">Priya Patel</p>
                <p className="text-xs text-slate-450">Daily Commuter</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-left shadow-sm hover:shadow-md transition">
            <div className="flex gap-1 mb-4 text-yellow-500">
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4.5 w-4.5 text-slate-300" />
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              "As an admin, updating cab availability states and tracking revenue totals works very smoothly. Seeding database was simple and populated immediately."
            </p>
            <div className="mt-6 flex items-center gap-3 border-t pt-4">
              <div className="h-10 w-10 rounded-full bg-accent/10 text-accent font-bold flex items-center justify-center">R</div>
              <div>
                <p className="text-sm font-bold text-slate-800">Rahul Verma</p>
                <p className="text-xs text-slate-450">Verified Manager</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Mega Footer with Social Subscription inputs */}
      <footer className="mt-auto bg-slate-950 text-slate-400 py-16 text-left border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-4">
            
            {/* Branding Column */}
            <div className="space-y-4">
              <Link to="/" className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                  <Car className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-extrabold text-white tracking-tight">
                  U<span className="text-secondary">Cab</span>
                </span>
              </Link>
              <p className="text-xs leading-relaxed font-light text-slate-400">
                Premium MERN Cab booking software. Designed for secure, transparent commute schedules.
              </p>
            </div>

            {/* Quick Links Column */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Services</h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/cabs" className="hover:text-white transition">Hatchback / Sedan Rides</Link></li>
                <li><Link to="/cabs" className="hover:text-white transition">Luxury SUV Rentals</Link></li>
                <li><Link to="/cabs" className="hover:text-white transition">Quick Bike Bookings</Link></li>
              </ul>
            </div>

            {/* Legal Column */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Support</h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/profile" className="hover:text-white transition">Preferences Settings</Link></li>
                <li><Link to="/bookings" className="hover:text-white transition">Active Tracking</Link></li>
                <li><Link to="/login" className="hover:text-white transition">Admin Portal Access</Link></li>
              </ul>
            </div>

            {/* Subscription Column */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Newsletter</h4>
              <p className="text-xs text-slate-400">Subscribe for coupon alerts and city expansion updates.</p>
              
              <div className="relative">
                <input
                  type="email"
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 py-2.5 pl-3 pr-10 text-xs focus:outline-none focus:border-secondary text-white"
                  placeholder="name@email.com"
                />
                <button className="absolute right-1 top-1 bottom-1 px-3.5 bg-secondary text-slate-950 rounded-lg hover:bg-secondary-light transition">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

          </div>

          <div className="mt-12 border-t border-slate-900 pt-8 text-center text-xs text-slate-500">
            <p>&copy; 2026 UCab booking portal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
