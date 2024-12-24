export interface User {
  id: string;
  email: string;
  name: string;
  role: "landlord" | "agent" | "renter";
  createdAt: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  area_sqft: number;
  type: "apartment" | "house" | "condo";
  status: "pending" | "approved" | "rejected";
  image_url?: string;
  imageUrl?: string;
  images: string[];
  features: string[];
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  propertyId: string;
  createdAt: string;
}
