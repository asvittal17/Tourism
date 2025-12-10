# Installation Instructions

## Required Dependencies

To enable all advanced features (Lottie animations, scroll animations, carousel), install the following dependencies:

```bash
cd frontend
npm install lottie-react react-intersection-observer framer-motion
```

## Features Implemented

### ✅ Fully Responsive Design
- Mobile-first approach with TailwindCSS
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Responsive grids, images, and typography

### ✅ Advanced Animations
- **Scroll Animations**: Elements animate on scroll using Intersection Observer
- **Framer Motion**: Smooth, performant animations throughout
- **Lottie Animations**: Support for Lottie JSON animations (optional)

### ✅ Image Optimizations
- **WebP Support**: Automatic WebP format with fallback
- **Lazy Loading**: Images load only when in viewport
- **OptimizedImage Component**: Handles loading states and errors

### ✅ Carousel/Gallery
- **ImageCarousel Component**: Smooth image transitions
- Auto-play functionality
- Touch-friendly navigation
- Keyboard accessible

### ✅ Enhanced Hover Effects
- Image zoom on hover
- Smooth transitions
- Gradient overlays
- Interactive elements

### ✅ Accessibility
- ARIA labels throughout
- Keyboard navigation
- Focus indicators
- Skip to main content link
- Reduced motion support

### ✅ Performance
- Lazy loading images
- Code splitting for Lottie
- Optimized animations
- WebP image format
- Reduced bundle size

## Usage

### Scroll Animations
```jsx
import ScrollAnimation from '../components/ScrollAnimation';

<ScrollAnimation variant="fadeInUp" delay={0.2}>
  <YourContent />
</ScrollAnimation>
```

### Optimized Images
```jsx
import OptimizedImage from '../components/OptimizedImage';

<OptimizedImage
  src="image.jpg"
  alt="Description"
  className="w-full h-full"
  loading="lazy"
/>
```

### Image Carousel
```jsx
import ImageCarousel from '../components/ImageCarousel';

<ImageCarousel
  images={['img1.jpg', 'img2.jpg', 'img3.jpg']}
  autoPlay={true}
  interval={5000}
/>
```

### Lottie Animations
```jsx
import LottieAnimation from '../components/LottieAnimation';

<LottieAnimation
  animationData={yourAnimationData}
  loop={true}
  autoplay={true}
/>
```

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- WebP support with automatic fallback
- CSS Grid and Flexbox
- Intersection Observer API

## Performance Tips

1. Use `loading="lazy"` for images below the fold
2. Use `loading="eager"` for above-the-fold images
3. Optimize images before uploading (compress, resize)
4. Use WebP format when possible
5. Enable code splitting for large components

## Accessibility Checklist

- ✅ Semantic HTML
- ✅ ARIA labels
- ✅ Keyboard navigation
- ✅ Focus indicators
- ✅ Screen reader support
- ✅ Reduced motion support
- ✅ Color contrast
- ✅ Skip links

