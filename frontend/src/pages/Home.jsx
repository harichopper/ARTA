import React, { useState } from 'react';
import { ArrowRight, MapPin, Phone, Mail } from 'lucide-react';


export default function Home() {
    
    const [isMenuOpen, setIsMenuOpen] = useState(false);
   const [isAuctionsOpen, setIsAuctionsOpen] = useState(false);
   const [currentSlide, setCurrentSlide] = useState(0);

  const watches = [
    { id: 1, name: 'Premium Smartwatch', price: 300, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center', badge: 'Featured', rating: 4.8 },
    { id: 2, name: 'Fitness Tracker Pro', price: 125, image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop&crop=center', badge: 'New', rating: 4.6 },
    { id: 3, name: 'Sport Edition', price: 110, image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=400&fit=crop&crop=center', badge: 'New', rating: 4.7 },
    { id: 4, name: 'Classic Series', price: 145, image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&h=400&fit=crop&crop=center', badge: 'New', rating: 4.5 },
    { id: 5, name: 'Health Monitor', price: 195, image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=400&fit=crop&crop=center', badge: 'New', rating: 4.9 },
    { id: 6, name: 'Adventure Watch', price: 170, image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=400&fit=crop&crop=center', badge: 'New', rating: 4.4 },
    { id: 7, name: 'Smart Companion', price: 230, image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400&h=400&fit=crop&crop=center', badge: 'New', rating: 4.6 },
  ];

  const features = [
    { icon: '🏃', title: 'Fitness Tracking', description: 'Monitor your health and fitness goals with precision tracking.' },
    { icon: '🔔', title: 'Alerts & Notifications', description: 'Stay connected with smart notifications and alerts.' },
    { icon: '💬', title: 'Messages', description: 'Read and respond to messages directly from your wrist.' },
    { icon: '📶', title: 'Bluetooth', description: 'Seamless connectivity with all your favorite devices.' },
  ];

  const testimonials = [
    { name: 'Mark Thomas', role: 'Customer', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face', text: 'Amazing quality and features! This smartwatch has transformed how I track my fitness goals.' },
    { name: 'Alina Hans', role: 'Customer', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face', text: 'Love the sleek design and battery life. Perfect companion for my busy lifestyle.' },
  ];

    const slides = [
    {
        title: 'Real-Time Auctions',
        subtitle: 'Bid Live on Avalanche',
        description: 'Join fast-paced, transparent auctions powered by Avalanche blockchain technology, ensuring security and speed.',
    },
    {
        title: 'Seamless Bidding Experience',
        subtitle: 'Instant Updates & Notifications',
        description: 'Stay ahead with live bid tracking, instant alerts, and smooth user interactions for every auction item.',
    },
    {
        title: 'Secure & Transparent',
        subtitle: 'Blockchain-Powered Trust',
        description: 'Every transaction and bid is securely recorded on Avalanche, providing full transparency and immutability.',
    },
    ];


  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

return(
    <div>
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent z-10"></div>

                {/* Animated Background */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-cyan-900/30"></div>
                </div>

                <div className="container mx-auto px-6 relative z-20">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="text-white">
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                        {slides[currentSlide].title}
                        </h1>
                        <p className="text-xl text-purple-200 mb-4">{slides[currentSlide].subtitle}</p>
                        <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                        {slides[currentSlide].description}
                        </p>
                        <button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 px-8 py-4 rounded-full text-white font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
                        Explore Collection
                        </button>
                    </div>
                    <div className="relative">
                        <div className="w-80 h-80 mx-auto relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-cyan-400 rounded-full animate-pulse opacity-20"></div>
                        <img
                            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center"
                            alt="Smartwatch"
                            className="w-full h-full object-contain relative z-10 filter drop-shadow-2xl rounded-full"
                        />
                        </div>
                    </div>
                    </div>
                </div>

                {/* Slider Controls */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4 z-20">
                    {slides.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        idx === currentSlide ? 'bg-white scale-125' : 'bg-white/50'
                        }`}
                    />
                    ))}
                </div>
                </section>

                {/* About Section */}
                <section id="about" className="py-20">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="relative">
                        <img
                        src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&h=400&fit=crop&crop=center"
                        alt="About us"
                        className="rounded-2xl shadow-2xl"
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/20 to-cyan-600/20 rounded-2xl"></div>
                    </div>
                    <div className="text-white">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">About Us</h2>
                        <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                        We're passionate about creating innovative smartwatches that seamlessly blend cutting-edge technology with elegant design. Our mission is to empower individuals to live healthier, more connected lives through wearable technology that adapts to their unique lifestyle.
                        </p>
                        <div className="grid grid-cols-2 gap-6 mb-8">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-purple-400 mb-2">10K+</div>
                            <div className="text-gray-400">Happy Customers</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-purple-400 mb-2">50+</div>
                            <div className="text-gray-400">Watch Models</div>
                        </div>
                        </div>
                        <button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 px-8 py-4 rounded-full text-white font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                        Read More <ArrowRight size={20} />
                        </button>
                    </div>
                    </div>
                </div>
                </section>

                {/* Features Section */}
                <section className="py-20 bg-black/20">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Features Of Our Watches</h2>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        Discover the advanced features that make our smartwatches the perfect companion for your daily life.
                    </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, idx) => (
                        <div key={idx} className="group bg-white/5 backdrop-blur-sm rounded-2xl p-8 text-center hover:bg-white/10 transition-all duration-300 hover:scale-105 border border-white/10">
                        <div className="text-5xl mb-6">{feature.icon}</div>
                        <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                        <p className="text-gray-400 leading-relaxed mb-6">{feature.description}</p>
                        <button className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-2 mx-auto group-hover:gap-3 transition-all duration-300">
                            Learn More <ArrowRight size={16} />
                        </button>
                        </div>
                    ))}
                    </div>
                </div>
                </section>

                {/* Testimonials */}
                <section className="py-20">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">What Our Customers Say</h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-cyan-400 mx-auto"></div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {testimonials.map((testimonial, idx) => (
                        <div key={idx} className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                        <div className="flex items-center gap-4 mb-6">
                            <img
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            className="w-16 h-16 rounded-full object-cover"
                            />
                            <div>
                            <h4 className="text-xl font-semibold text-white">{testimonial.name}</h4>
                            <p className="text-purple-400">{testimonial.role}</p>
                            </div>
                        </div>
                        <p className="text-gray-300 leading-relaxed italic">"{testimonial.text}"</p>
                        </div>
                    ))}
                    </div>
                </div>
                </section>

                {/* Contact Section */}
                <section id="contact" className="py-20 bg-black/20">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12">
                    <div className="text-white">
                        <h2 className="text-4xl font-bold mb-6">Contact Us</h2>
                        <p className="mb-6 text-gray-300 leading-relaxed">
                        Have questions or want to learn more? Reach out to our support team or visit our store.
                        </p>
                        <ul className="space-y-4 text-gray-300">
                        <li className="flex items-center gap-3">
                            <MapPin size={20} />
                            <span>123 Timups Street, Tech City, USA</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Phone size={20} />
                            <span>+1 (555) 123-4567</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Mail size={20} />
                            <span>support@timups.com</span>
                        </li>
                        </ul>
                    </div>
                    <form className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 text-white flex flex-col gap-6">
                        <input
                        type="text"
                        placeholder="Your Name"
                        className="bg-white/20 rounded-md p-3 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <input
                        type="email"
                        placeholder="Your Email"
                        className="bg-white/20 rounded-md p-3 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <textarea
                        rows={4}
                        placeholder="Your Message"
                        className="bg-white/20 rounded-md p-3 text-white placeholder-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <button
                        type="submit"
                        className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105"
                        >
                        Send Message
                        </button>
                    </form>
                    </div>
                </div>
                </section>
    </div>
);
}

