import * as React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Interface for component props for type safety and reusability
interface PlaceCardProps {
  images: string[];
  tags: string[];
  rating?: number;
  title: string;
  subtitle?: string;
  badgeText?: string;
  isTopRated?: boolean;
  description: string;
  footerText?: string;
  onAction?: () => void;
  actionText?: string;
  extraActions?: React.ReactNode;
  className?: string;
}

export const PlaceCard = ({
  images,
  tags,
  rating,
  title,
  subtitle,
  badgeText,
  isTopRated = false,
  description,
  footerText,
  onAction,
  actionText = "View Details",
  extraActions,
  className,
}: PlaceCardProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Carousel image change handler
  const changeImage = (newDirection: number, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to the link
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) return images.length - 1;
      if (nextIndex >= images.length) return 0;
      return nextIndex;
    });
  };

  // Animation variants for the carousel
  const carouselVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

  // Animation variants for staggering content
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
      variants={contentVariants}
      // --- NEW: Added hover animation ---
      whileHover={{ 
        scale: 1.03, 
        boxShadow: '0px 10px 30px -5px hsl(var(--foreground) / 0.1)',
        transition: { type: 'spring', stiffness: 300, damping: 20 }
      }}
      // --- END NEW ---
      className={cn(
        'w-full max-w-sm overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-lg cursor-pointer h-full flex flex-col',
        className
      )}
      onClick={onAction}
    >
      {/* Image Carousel Section */}
      <div className="relative group h-48 sm:h-56">
        <AnimatePresence initial={false} custom={direction}>
          {images.length > 0 ? (
            <motion.img
              key={currentIndex}
              src={images[currentIndex]}
              alt={title}
              custom={direction}
              variants={carouselVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="absolute h-full w-full object-cover"
            />
          ) : (
            <div className="absolute h-full w-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
        </AnimatePresence>
        
        {/* Carousel Navigation */}
        {images.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <Button variant="ghost" size="icon" className="rounded-full bg-black/30 hover:bg-black/50 text-white h-8 w-8" onClick={(e) => changeImage(-1, e)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full bg-black/30 hover:bg-black/50 text-white h-8 w-8" onClick={(e) => changeImage(1, e)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Top Badges and Rating */}
        <div className="absolute top-3 left-3 flex gap-2 flex-wrap max-w-[80%] z-10">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-background/90 backdrop-blur-sm shadow-sm text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        {rating !== undefined && (
          <div className="absolute top-3 right-3 z-10">
            <Badge variant="secondary" className="flex items-center gap-1 bg-background/90 backdrop-blur-sm shadow-sm">
              <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" /> {rating}
            </Badge>
          </div>
        )}

        {/* Pagination Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => { e.preventDefault(); setCurrentIndex(index); }}
                className={cn(
                  'h-1.5 w-1.5 rounded-full transition-all',
                  currentIndex === index ? 'w-4 bg-white shadow-sm' : 'bg-white/50 hover:bg-white/80'
                )}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content Section */}
      <motion.div variants={contentVariants} className="p-5 space-y-4 flex flex-col flex-grow">
        <motion.div variants={itemVariants} className="flex justify-between items-start">
          <h3 className="text-xl font-bold line-clamp-1">{title}</h3>
          {isTopRated && <Badge variant="outline" className="ml-2 whitespace-nowrap">Top rated</Badge>}
        </motion.div>

        {subtitle && (
          <motion.div variants={itemVariants} className="text-sm text-muted-foreground flex items-center gap-2">
            <span>{subtitle}</span>
            {badgeText && (
              <>
                <span className="text-xs">&bull;</span>
                <Badge variant="secondary" className="text-xs px-1.5 py-0 h-5">{badgeText}</Badge>
              </>
            )}
          </motion.div>
        )}

        <motion.p variants={itemVariants} className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-grow">
          {description}
        </motion.p>

        <motion.div variants={itemVariants} className="flex justify-between items-center pt-2 mt-auto border-t border-gray-100">
          <p className="font-semibold text-sm">
            {footerText}
          </p>
          {extraActions ? (
            extraActions
          ) : (
            <Button className="group" size="sm">
              {actionText}
              <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
