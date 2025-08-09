import React from 'react';
import { ArrowRight } from 'lucide-react';

const teamMembers = [
  {
    name: 'Alice Johnson',
    role: 'CEO & Founder',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    linkedin: '#',
  },
  {
    name: 'Michael Lee',
    role: 'Head of Product',
    image: 'https://randomuser.me/api/portraits/men/46.jpg',
    linkedin: '#',
  },
  {
    name: 'Sara Kim',
    role: 'Lead Designer',
    image: 'https://randomuser.me/api/portraits/women/65.jpg',
    linkedin: '#',
  },
  {
    name: 'David Chen',
    role: 'Chief Engineer',
    image: 'https://randomuser.me/api/portraits/men/72.jpg',
    linkedin: '#',
  },
];

const coreValues = [
  {
    icon: '💡',
    title: 'Innovation',
    description: 'We strive to push the boundaries of wearable technology.',
  },
  {
    icon: '🤝',
    title: 'Customer Focus',
    description: 'Your needs and satisfaction are our top priorities.',
  },
  {
    icon: '🔒',
    title: 'Quality & Security',
    description: 'We ensure reliable and secure products you can trust.',
  },
  {
    icon: '🌱',
    title: 'Sustainability',
    description: 'Committed to environmentally responsible practices.',
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-20 px-6">
      <div className="container mx-auto max-w-6xl text-white">
        <header className="mb-20 text-center">
  <h1 className="text-6xl md:text-8xl font-extrabold mb-6 text-white drop-shadow-lg pt-4">
    About <span className="text-purple-400">Timups</span>
  </h1>
  <p className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed italic tracking-wide">
    Discover our journey of innovation and passion in crafting wearable technology designed to elevate your lifestyle.
  </p>
        </header>


        {/* Story and Mission */}
        <section className="grid md:grid-cols-2 gap-12 items-center mb-24">
        <div className="relative rounded-3xl overflow-hidden shadow-xl border border-purple-700">
            <img
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=700&h=450&fit=crop&crop=center"
            alt="Timups Story"
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500 ease-in-out"
            loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-800/40 to-cyan-700/40 rounded-3xl"></div>
        </div>

        <div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
            Our Journey &amp; Vision
            </h2>

            <p className="text-gray-300 mb-6 leading-relaxed text-lg">
            At Timups, innovation drives us. We blend advanced technology with timeless craftsmanship to build smartwatches that empower your health and connectivity.
            </p>

            <p className="text-gray-300 mb-8 leading-relaxed text-lg">
            Our commitment is to seamless experiences, durability, and elegance — making your wrist the gateway to a smarter lifestyle.
            </p>

            <div className="flex gap-12 mb-12">
            <div className="text-center">
                <div className="text-5xl font-extrabold text-purple-500 mb-1">10K+</div>
                <p className="text-gray-400 uppercase tracking-wide text-sm">Happy Customers</p>
            </div>
            <div className="text-center">
                <div className="text-5xl font-extrabold text-cyan-400 mb-1">50+</div>
                <p className="text-gray-400 uppercase tracking-wide text-sm">Watch Models</p>
            </div>
            </div>

            <button
            className="inline-flex items-center gap-3 px-10 py-4 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold transition transform hover:scale-105 shadow-lg"
            onClick={() => alert('Discover more about Timups')}
            aria-label="Discover more about Timups"
            >
            Discover More <ArrowRight size={22} />
            </button>
        </div>
        </section>


        {/* Core Values */}
        <section className="mb-28 max-w-5xl mx-auto px-6 text-center">
  <h2 className="text-4xl md:text-5xl font-extrabold mb-14 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
    Our Core Values
  </h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
    {coreValues.map(({ icon, title, description }, idx) => (
      <div
        key={idx}
        className="group relative bg-gradient-to-br from-purple-900 via-black to-cyan-900 rounded-3xl p-8 shadow-xl border border-transparent hover:border-cyan-400 transition-all duration-400 cursor-default"
      >
        <div className="text-6xl mb-5 text-purple-400 group-hover:text-cyan-400 transition-colors duration-300">
          {icon}
        </div>
        <h3 className="text-2xl font-semibold mb-3 text-white group-hover:text-cyan-300 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-gray-400 leading-relaxed text-base">
          {description}
        </p>

        {/* subtle floating effect */}
        <span className="absolute -top-3 -right-3 w-10 h-10 bg-cyan-500 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-xl"></span>
      </div>
    ))}
  </div>
</section>


        {/* Team Section */}
        <section className="mb-20 max-w-6xl mx-auto">
          <h2 className="text-4xl font-extrabold mb-12 text-center text-white">Meet Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
            {teamMembers.map(({ name, role, image, linkedin }, idx) => (
              <div
                key={idx}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 flex flex-col items-center border border-white/20 hover:bg-white/20 transition-colors duration-300"
              >
                <img
                  src={image}
                  alt={`${name} photo`}
                  className="w-32 h-32 rounded-full object-cover mb-4 shadow-lg"
                  loading="lazy"
                />
                <h3 className="text-xl font-semibold mb-1 text-white">{name}</h3>
                <p className="text-purple-300 mb-4">{role}</p>
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`LinkedIn profile of ${name}`}
                  className="text-purple-400 hover:text-purple-300 transition-colors duration-300"
                >
                  LinkedIn
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Optional: Add more about content or team section here */}
      </div>
    </div>
  );
}
