export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  description: string;
  images: string[];
  colors: string[];
  sizes: string[];
  category: string;
}

export interface ProductReview {
  id: number;
  name: string;
  rating: number;
  review: string;
  date: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "T-shirt with Tape Details",
    price: 120,
    rating: 4.5,
    reviewCount: 120,
    description:
      "This graphic t-shirt which is perfect for any occasion. Crafted from a soft and breathable fabric, it offers superior comfort and style.",
    images: ["/new-arrival-1.png", "/new-arrival-2.png", "/new-arrival-3.png"],
    colors: ["#4F4631", "#314F4A", "#31344F"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    category: "T-shirts",
  },
  {
    id: 2,
    name: "Skinny Fit Jeans",
    price: 240,
    originalPrice: 260,
    discount: 20,
    rating: 3.5,
    reviewCount: 80,
    description:
      "Slim-cut jeans crafted from a comfortable stretch fabric. Perfect for a modern, tailored look.",
    images: ["/new-arrival-2.png", "/new-arrival-3.png", "/new-arrival-4.png"],
    colors: ["#1A1A2E", "#16213E"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    category: "Jeans",
  },
  {
    id: 3,
    name: "Checkered Shirt",
    price: 180,
    rating: 4.5,
    reviewCount: 200,
    description:
      "A classic checkered shirt made from soft woven fabric. Versatile enough for casual and smart casual occasions.",
    images: ["/new-arrival-3.png", "/new-arrival-4.png", "/new-arrival-1.png"],
    colors: ["#8B1A1A", "#1A3A5C"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    category: "Shirts",
  },
  {
    id: 4,
    name: "Sleeve Striped T-shirt",
    price: 130,
    originalPrice: 160,
    discount: 37,
    rating: 4.5,
    reviewCount: 150,
    description:
      "A bold striped t-shirt with contrast sleeve detailing. Made from premium cotton for all-day comfort.",
    images: ["/new-arrival-4.png", "/new-arrival-1.png", "/new-arrival-2.png"],
    colors: ["#000000", "#FF6B35"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    category: "T-shirts",
  },
  {
    id: 5,
    name: "One Life Graphic T-shirt",
    price: 260,
    originalPrice: 300,
    discount: 40,
    rating: 4.5,
    reviewCount: 451,
    description:
      "This graphic t-shirt which is perfect for any occasion. Crafted from a soft and breathable fabric, it offers superior comfort and style.",
    images: ["/new-arrival-1.png", "/new-arrival-2.png", "/new-arrival-4.png"],
    colors: ["#4F4631", "#314F4A", "#31344F"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    category: "T-shirts",
  },
  {
    id: 6,
    name: "Polo with Contrast Trims",
    price: 212,
    originalPrice: 242,
    discount: 20,
    rating: 4.0,
    reviewCount: 100,
    description:
      "A stylish polo shirt with contrast trim detailing around the collar and sleeves.",
    images: ["/new-arrival-2.png", "/new-arrival-3.png", "/new-arrival-1.png"],
    colors: ["#1A6B3C", "#FFFFFF"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    category: "Polo",
  },
  {
    id: 7,
    name: "Gradient Graphic T-shirt",
    price: 145,
    rating: 3.5,
    reviewCount: 90,
    description:
      "A vibrant gradient graphic t-shirt that stands out from the crowd.",
    images: ["/new-arrival-3.png", "/new-arrival-1.png", "/new-arrival-2.png"],
    colors: ["#FFFFFF", "#F5A623"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    category: "T-shirts",
  },
  {
    id: 8,
    name: "Polo with Tipping Details",
    price: 180,
    rating: 4.5,
    reviewCount: 130,
    description:
      "Classic polo with elegant tipping details on collar and cuffs.",
    images: ["/new-arrival-4.png", "/new-arrival-2.png", "/new-arrival-3.png"],
    colors: ["#8B1A1A", "#FFFFFF"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    category: "Polo",
  },
  {
    id: 9,
    name: "Black Striped T-shirt",
    price: 120,
    originalPrice: 150,
    discount: 30,
    rating: 5.0,
    reviewCount: 160,
    description:
      "A sleek black and white striped t-shirt perfect for any casual occasion.",
    images: ["/new-arrival-1.png", "/new-arrival-4.png", "/new-arrival-3.png"],
    colors: ["#000000", "#FFFFFF"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    category: "T-shirts",
  },
];

const sharedReviews: ProductReview[] = [
  {
    id: 1,
    name: "Samantha D.",
    rating: 4.5,
    review:
      '"I absolutely love this product! The design is unique and the fabric feels so comfortable. It\'s become my favorite go-to item."',
    date: "August 14, 2023",
  },
  {
    id: 2,
    name: "Alex M.",
    rating: 4,
    review:
      '"Exceeded my expectations! The quality is top-notch and the fit is perfect. Definitely gets a thumbs up from me."',
    date: "August 15, 2023",
  },
  {
    id: 3,
    name: "Ethan R.",
    rating: 3.5,
    review:
      '"A must-have for anyone who appreciates good design. The style caught my eye and the fit is perfect."',
    date: "August 16, 2023",
  },
  {
    id: 4,
    name: "Olivia P.",
    rating: 4,
    review:
      '"I value simplicity and quality. This product not only looks great but also feels great to wear."',
    date: "August 17, 2023",
  },
];

export const productReviews: Record<number, ProductReview[]> = {
  1: sharedReviews,
  2: sharedReviews,
  3: sharedReviews,
  4: sharedReviews,
  5: [
    {
      id: 1,
      name: "Samantha D.",
      rating: 4.5,
      review:
        '"I absolutely love this t-shirt! The design is unique and the fabric feels so comfortable. As a fellow designer, I appreciate the attention to detail. It\'s become my favorite go-to shirt."',
      date: "August 14, 2023",
    },
    {
      id: 2,
      name: "Alex M.",
      rating: 4,
      review:
        '"The t-shirt exceeded my expectations! The colors are vibrant and the print quality is top-notch. Being a UI/UX designer myself, I\'m quite picky about aesthetics, and this t-shirt definitely gets a thumbs up from me."',
      date: "August 15, 2023",
    },
    {
      id: 3,
      name: "Ethan R.",
      rating: 3.5,
      review:
        '"This t-shirt is a must-have for anyone who appreciates good design. The minimalistic yet stylish pattern caught my eye, and the fit is perfect. I can see the designer\'s touch in every aspect of this shirt."',
      date: "August 16, 2023",
    },
    {
      id: 4,
      name: "Olivia P.",
      rating: 4,
      review:
        '"As a UI/UX enthusiast, I value simplicity and functionality. This t-shirt not only represents those principles but also feels great to wear. It\'s evident that the designer poured their creativity into making this t-shirt stand out."',
      date: "August 17, 2023",
    },
    {
      id: 5,
      name: "Liam K.",
      rating: 4,
      review:
        '"This t-shirt is a fusion of comfort and creativity. The fabric is soft, and the design speaks volumes about the designer\'s skill. It\'s like wearing a piece of art that reflects my passion for both design and fashion."',
      date: "August 18, 2023",
    },
    {
      id: 6,
      name: "Ava H.",
      rating: 4.5,
      review:
        '"I\'m not just wearing a t-shirt; I\'m wearing a piece of design philosophy. The intricate details and thoughtful layout of the design make this shirt a conversation starter."',
      date: "August 19, 2023",
    },
  ],
  6: sharedReviews,
  7: sharedReviews,
  8: sharedReviews,
  9: sharedReviews,
};

export function getProductById(id: number): Product | undefined {
  return products.find((p) => p.id === id);
}

export const youMightAlsoLike = [6, 7, 8, 9];
