export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isPopular?: boolean;
  isNew?: boolean;
}

export const menuItems: MenuItem[] = [
  // Burgers
  {
    id: "1",
    name: "Crispy Chicken Burger",
    description: "Crispy fried chicken breast with fresh lettuce, tomato, and special sauce",
    price: 180,
    category: "Burgers",
    image: "/api/placeholder/300/250",
    isPopular: true,
  },
  {
    id: "2",
    name: "Spicy Paneer Burger",
    description: "Spiced paneer patty with fresh vegetables and mint chutney",
    price: 180,
    category: "Burgers",
    image: "/api/placeholder/300/250",
  },
  {
    id: "3",
    name: "Fish Burger",
    description: "Crispy fish fillet with tartar sauce and fresh lettuce",
    price: 200,
    category: "Burgers",
    image: "/api/placeholder/300/250",
  },
  {
    id: "4",
    name: "Shrimp Burger",
    description: "Golden fried shrimp with special mayo and crisp lettuce",
    price: 200,
    category: "Burgers",
    image: "/api/placeholder/300/250",
  },
  {
    id: "5",
    name: "Classic Burger",
    description: "Juicy beef patty with cheese, lettuce, tomato, and special sauce",
    price: 180,
    category: "Burgers",
    image: "/api/placeholder/300/250",
    isPopular: true,
  },
  {
    id: "6",
    name: "Double Decker Classic",
    description: "Two beef patties with double cheese and signature sauce",
    price: 280,
    category: "Burgers",
    image: "/api/placeholder/300/250",
  },
  {
    id: "7",
    name: "Mutton Burger",
    description: "Tender mutton patty with fresh herbs and spicy sauce",
    price: 200,
    category: "Burgers",
    image: "/api/placeholder/300/250",
  },

  // Fried Chicken
  {
    id: "8",
    name: "Broasted Fried Chicken - 2 Piece",
    description: "Crispy golden fried chicken pieces with special seasoning",
    price: 180,
    category: "Fried Chicken",
    image: "/api/placeholder/300/250",
    isPopular: true,
  },
  {
    id: "9",
    name: "Broasted Fried Chicken - 4 Piece",
    description: "Four pieces of our signature crispy fried chicken",
    price: 360,
    category: "Fried Chicken",
    image: "/api/placeholder/300/250",
  },
  {
    id: "10",
    name: "Broasted Fried Chicken - 8 Piece",
    description: "Perfect for sharing - eight pieces of crispy goodness",
    price: 600,
    category: "Fried Chicken",
    image: "/api/placeholder/300/250",
  },
  {
    id: "11",
    name: "Buffalo Wings",
    description: "Spicy buffalo wings tossed in tangy sauce (5 pieces)",
    price: 250,
    category: "Fried Chicken",
    image: "/api/placeholder/300/250",
  },
  {
    id: "12",
    name: "Chicken Tenders",
    description: "Crispy chicken strips perfect for dipping (4 pieces)",
    price: 250,
    category: "Fried Chicken",
    image: "/api/placeholder/300/250",
  },

  // Finger Foods
  {
    id: "13",
    name: "Imitation Crab Claw Amritsari",
    description: "Golden fried crab claw imitation with special spices (6 pieces)",
    price: 200,
    category: "Finger Foods",
    image: "/api/placeholder/300/250",
    isNew: true,
  },
  {
    id: "14",
    name: "Imitation Lobster Bites",
    description: "Crispy lobster-style bites with herbs (8 pieces)",
    price: 200,
    category: "Finger Foods",
    image: "/api/placeholder/300/250",
    isNew: true,
  },
  {
    id: "15",
    name: "Jalapeno Poppers",
    description: "Cheese-stuffed jalapenos in crispy coating (6 pieces)",
    price: 180,
    category: "Finger Foods",
    image: "/api/placeholder/300/250",
  },
  {
    id: "16",
    name: "Cheese Fingers",
    description: "Mozzarella sticks with marinara sauce (6 pieces)",
    price: 180,
    category: "Finger Foods",
    image: "/api/placeholder/300/250",
  },
  {
    id: "17",
    name: "Dynamite Shrimps",
    description: "Spicy fried shrimps with special sauce (7 pieces)",
    price: 220,
    category: "Finger Foods",
    image: "/api/placeholder/300/250",
  },

  // Fitness Food
  {
    id: "18",
    name: "Light Mutton Lettuce Wrap",
    description: "Grilled mutton patty wrapped in fresh lettuce leaves",
    price: 240,
    category: "Fitness Food",
    image: "/api/placeholder/300/250",
  },
  {
    id: "19",
    name: "Light Chicken Steak Wrap",
    description: "Grilled chicken breast in lettuce wrap with herbs",
    price: 200,
    category: "Fitness Food",
    image: "/api/placeholder/300/250",
  },
  {
    id: "20",
    name: "Gym Box",
    description: "High protein meal with steak, lettuce, tomato, and special sauce",
    price: 250,
    category: "Fitness Food",
    image: "/api/placeholder/300/250",
  },
  {
    id: "21",
    name: "Steak Salad",
    description: "Fresh mixed greens with grilled steak and veggies (62g protein)",
    price: 240,
    category: "Fitness Food",
    image: "/api/placeholder/300/250",
  },
];

export const categories = [
  "All",
  "Burgers",
  "Fried Chicken", 
  "Finger Foods",
  "Fitness Food"
];