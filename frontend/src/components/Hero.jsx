import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ScrollAnimation from "./ScrollAnimation";
import OptimizedImage from "./OptimizedImage";
import LottieAnimation from "./LottieAnimation";

const heroImages = [
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&fm=webp",
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1600&fm=webp",
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1600&fm=webp",
];

export default function Hero() {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollAnimation variant="fadeIn" duration={0.8}>
      <section className="mt-4 md:mt-8 rounded-lg overflow-hidden" aria-label="Hero section">
        <div className="relative bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-700 rounded-xl md:rounded-2xl overflow-hidden group">
          {/* Animated background images with smooth transitions */}
          <div className="absolute inset-0">
            {heroImages.map((img, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: index === currentImageIndex ? 0.2 : 0,
                }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <OptimizedImage
                  src={img}
                  alt={`Hero background ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </motion.div>
            ))}
          </div>
          
          {/* Floating animated elements with enhanced animations */}
          <motion.div
            className="absolute top-10 right-10 w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full blur-xl hidden lg:block"
            animate={{
              y: [0, -20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            aria-hidden="true"
          />
          <motion.div
            className="absolute bottom-10 left-10 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full blur-xl hidden lg:block"
            animate={{
              y: [0, 20, 0],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            aria-hidden="true"
          />
          <motion.div
            className="absolute top-1/2 right-1/4 w-12 h-12 sm:w-16 sm:h-16 bg-white/10 rounded-full blur-xl hidden lg:block"
            animate={{
              y: [0, -15, 0],
              x: [0, 10, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            aria-hidden="true"
          />

          {/* Lottie Animation (optional decorative element) */}
          <div className="absolute top-4 right-4 sm:top-8 sm:right-8 w-16 h-16 sm:w-24 sm:h-24 opacity-30 hidden xl:block">
            <LottieAnimation
              animationData={null}
              animationUrl="https://lottie.host/embed/your-animation-id.json"
              className="w-full h-full"
              ariaLabel="Travel animation"
            />
          </div>

          <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-28">
            <div className="max-w-4xl">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white drop-shadow-lg"
              >
                Explore the world.{" "}
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="text-sky-100 block sm:inline"
                >
                  One trip at a time.
                </motion.span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl lg:text-2xl max-w-2xl text-white/95 leading-relaxed"
              >
                Find curated destinations, easy booking, and travel tips — made for you.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/")}
                  className="px-6 py-3 sm:px-8 sm:py-4 rounded-lg bg-white text-blue-600 font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/50"
                  aria-label="Get started with tourism"
                >
                  Get Started
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    document.getElementById('destinations')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3 sm:px-8 sm:py-4 rounded-lg bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/50"
                  aria-label="Explore destinations"
                >
                  Explore Destinations
                </motion.button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </ScrollAnimation>
  );
}
