import React, { useEffect, useState } from "react";
import localApi from "../services/localApi";
import { useParams, Link } from "react-router-dom";
import OptimizedImage from "../components/OptimizedImage";
import ImageCarousel from "../components/ImageCarousel";
import ScrollAnimation from "../components/ScrollAnimation";
import { motion } from "framer-motion";

export default function ViewDestination(){
  const { id } = useParams();
  const [d, setD] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(()=> { 
    localApi.getDestination(id)
      .then(setD)
      .finally(() => setLoading(false));
  },[id]);

  if(loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-blue-600 font-medium">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if(!d) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">❌</div>
        <div className="text-xl font-semibold text-slate-600 dark:text-slate-400">Destination not found</div>
        <Link to="/" className="mt-4 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200">
          Go Home
        </Link>
      </div>
    );
  }

  // Create image gallery for carousel
  const galleryImages = [
    d.image,
    d.image, // In real app, you'd have multiple images
    d.image,
  ];

  return (
    <ScrollAnimation variant="fadeIn" duration={0.6}>
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700">
          <ImageCarousel images={galleryImages} autoPlay={true} interval={5000} />
          <div className="absolute bottom-4 left-4 sm:left-6 right-4 sm:right-6 z-10">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-2 drop-shadow-lg"
            >
              {d.title}
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap items-center gap-2 sm:gap-4 text-white"
            >
              <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg text-xs sm:text-sm font-semibold">
                📍 {d.location}
              </span>
              <span className="bg-amber-500 px-3 py-1 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1">
                ★ {d.rating}
              </span>
            </motion.div>
          </div>
        </div>
        
        <div className="p-6 sm:p-8">
          <ScrollAnimation variant="fadeInUp" delay={0.2}>
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3">About this destination</h2>
              <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                {d.description}
              </p>
            </div>
          </ScrollAnimation>
          
          <ScrollAnimation variant="fadeInUp" delay={0.4}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
              <div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Price per person</div>
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-3xl sm:text-4xl font-extrabold text-blue-600 dark:text-sky-400"
                >
                  ₹{d.price?.toLocaleString()}
                </motion.div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link 
                    to={`/booking/${d.id}`} 
                    className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg text-center block focus:outline-none focus:ring-4 focus:ring-blue-500/50"
                    aria-label={`Book ${d.title}`}
                  >
                    Book Now
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link 
                    to={`/edit/${d.id}`} 
                    className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-blue-600 text-blue-600 dark:text-sky-400 rounded-lg font-semibold hover:bg-blue-50 dark:hover:bg-slate-700 transition-all duration-200 text-center block focus:outline-none focus:ring-4 focus:ring-blue-500/50"
                    aria-label={`Edit ${d.title}`}
                  >
                    Edit Destination
                  </Link>
                </motion.div>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </ScrollAnimation>
  );
}
