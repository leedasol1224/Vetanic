// ============================================================================
// TEMPORARY IMAGERY ARCHITECTURE — replace with official VETANIC photography
// High-quality, royalty-free pet lifestyle photography curated for warm neutral tones.
// ============================================================================

export interface HomepageImagesConfig {
  // Hero lifestyle image (warm, natural light, cream/beige interior)
  heroImage: {
    imageUrl: string;
    alt: string;
  };
  // Primary lifestyle break ("From Korea, for the companions we love.")
  lifestyleImage01: {
    imageUrl: string;
    alt: string;
  };
  // Secondary lifestyle / brand break
  lifestyleImage02: {
    imageUrl: string;
    alt: string;
  };
  // Singapore Launch section group photograph
  singaporeLaunchImage: {
    imageUrl: string;
    alt: string;
  };
  // Brand story section visual (VETANIC x Nongshim Banryodaum)
  brandStoryImage: {
    imageUrl: string;
    alt: string;
  };
  // Editorial gallery grid (4-6 natural, unposed dog and cat moments)
  galleryImages: Array<{
    id: string;
    caption: string;
    imageUrl: string;
    petType: 'dog' | 'cat' | 'both';
  }>;
}

export const HOMEPAGE_IMAGES: HomepageImagesConfig = {
  // TEMPORARY IMAGE — replace with official VETANIC photography
  heroImage: {
    imageUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?q=80&w=2000&auto=format&fit=crop',
    alt: 'VETANIC companion animal resting in warm sunlight'
  },

  // TEMPORARY IMAGE — replace with official VETANIC photography
  lifestyleImage01: {
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=2000&auto=format&fit=crop',
    alt: 'From Korea, for the companions we love'
  },

  // TEMPORARY IMAGE — replace with official VETANIC photography
  lifestyleImage02: {
    imageUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=2000&auto=format&fit=crop',
    alt: 'Gentle daily care routines with companions'
  },

  // TEMPORARY IMAGE — replace with official VETANIC photography
  singaporeLaunchImage: {
    imageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=1800&auto=format&fit=crop',
    alt: 'VETANIC Singapore Launch Special'
  },

  // TEMPORARY IMAGE — replace with official VETANIC photography
  brandStoryImage: {
    imageUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1800&auto=format&fit=crop',
    alt: 'VETANIC by Nongshim Banryodaum Korean Pet Wellness'
  },

  // TEMPORARY IMAGES — replace with official VETANIC photography
  galleryImages: [
    {
      id: 'gallery-1',
      caption: 'Happy dog smiling in warm morning light',
      imageUrl: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=800&auto=format&fit=crop',
      petType: 'dog'
    },
    {
      id: 'gallery-2',
      caption: 'Serene cat resting peacefully on soft linen',
      imageUrl: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?q=80&w=800&auto=format&fit=crop',
      petType: 'cat'
    },
    {
      id: 'gallery-3',
      caption: 'Companion dog in clean neutral lifestyle setting',
      imageUrl: 'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?q=80&w=800&auto=format&fit=crop',
      petType: 'dog'
    },
    {
      id: 'gallery-4',
      caption: 'Gentle golden companion up close',
      imageUrl: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?q=80&w=800&auto=format&fit=crop',
      petType: 'dog'
    },
    {
      id: 'gallery-5',
      caption: 'Calm kitten basking in soft indoor light',
      imageUrl: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=800&auto=format&fit=crop',
      petType: 'cat'
    },
    {
      id: 'gallery-6',
      caption: 'Curious companion with gentle eyes',
      imageUrl: 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?q=80&w=800&auto=format&fit=crop',
      petType: 'both'
    }
  ]
};
