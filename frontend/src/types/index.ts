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
  address: string;
  bedrooms: number;
  bathrooms: number;
  area_sqft: number;
  property_type: "apartment" | "house" | "condo";
  status: "pending" | "approved" | "rejected";
  image_url?: string;
  images: string[];
  features: string[];
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  propertyId: string;
  createdAt: string;
}
