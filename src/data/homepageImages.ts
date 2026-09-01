/**
 * Central image configuration for VETANIC homepage visual slots.
 * Update image paths here to easily swap hero, lifestyle, and category photography.
 */

export interface HomepageImagesConfig {
  heroLifestyle: {
    imageUrl: string;
    alt: string;
  };
  koreaBrandLifestyle: {
    imageUrl: string;
    alt: string;
  };
  singaporeLaunch: {
    imageUrl: string;
    alt: string;
  };
  brandStory: {
    imageUrl: string;
    alt: string;
  };
  categoryImages: Array<{
    id: string;
    name: string;
    petType: 'both' | 'dog' | 'cat';
    imageUrl: string;
    filterQuery: string;
  }>;
  socialGallery: Array<{
    id: string;
    caption: string;
    imageUrl: string;
    petType: 'dog' | 'cat' | 'both';
  }>;
}

export const HOMEPAGE_IMAGES: HomepageImagesConfig = {
  heroLifestyle: {
    imageUrl: '/images/lifestyle/hero_lifestyle.jpg',
    alt: 'VETANIC companion animal wellness routine'
  },
  koreaBrandLifestyle: {
    imageUrl: '/images/lifestyle/korea_brand_lifestyle.jpg',
    alt: 'From Korea, for the companions we love'
  },
  singaporeLaunch: {
    imageUrl: '/images/lifestyle/singapore_launch.jpg',
    alt: 'VETANIC Singapore Launch lineup'
  },
  brandStory: {
    imageUrl: '/images/brand/brand_story.jpg',
    alt: 'VETANIC by Nongshim Banryodaum Korean Pet Wellness'
  },
  categoryImages: [
    {
      id: 'eye-care',
      name: 'Eye Care',
      petType: 'dog',
      imageUrl: '/images/categories/eye-care.jpg',
      filterQuery: 'eye-care'
    },
    {
      id: 'skin-coat',
      name: 'Skin & Coat',
      petType: 'both',
      imageUrl: '/images/categories/skin-coat.jpg',
      filterQuery: 'skin-coat'
    },
    {
      id: 'digestion',
      name: 'Digestive Care',
      petType: 'both',
      imageUrl: '/images/categories/digestion.jpg',
      filterQuery: 'digestion'
    },
    {
      id: 'cat-wellness',
      name: 'Cat Wellness',
      petType: 'cat',
      imageUrl: '/images/categories/cat-wellness.jpg',
      filterQuery: 'hairball'
    },
    {
      id: 'dental',
      name: 'Dental Care',
      petType: 'dog',
      imageUrl: '/images/categories/dental.jpg',
      filterQuery: 'dental'
    },
    {
      id: 'treats',
      name: 'Healthy Treats',
      petType: 'both',
      imageUrl: '/images/categories/treats.jpg',
      filterQuery: 'treats'
    }
  ],
  socialGallery: [
    {
      id: 'gallery-1',
      caption: 'Soft Dental Chew oral hygiene routine',
      imageUrl: '/images/gallery/gallery_1.jpg',
      petType: 'dog'
    },
    {
      id: 'gallery-2',
      caption: 'Feline Hairball Care with pure salmon puree',
      imageUrl: '/images/gallery/gallery_2.jpg',
      petType: 'cat'
    },
    {
      id: 'gallery-3',
      caption: 'Fresh Omega-3 pure golden marine oil',
      imageUrl: '/images/gallery/gallery_3.jpg',
      petType: 'both'
    },
    {
      id: 'gallery-4',
      caption: 'Joint Support powder stick daily mobility care',
      imageUrl: '/images/gallery/gallery_4.jpg',
      petType: 'dog'
    },
    {
      id: 'gallery-5',
      caption: 'Scientific ocular balance & liver care',
      imageUrl: '/images/gallery/gallery_5.jpg',
      petType: 'dog'
    },
    {
      id: 'gallery-6',
      caption: 'Wholesome Korean sweet potato & pumpkin harvest',
      imageUrl: '/images/gallery/gallery_6.jpg',
      petType: 'both'
    }
  ]
};
