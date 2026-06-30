export interface Service {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  imageAlt: string;
}

export interface ContactFormData {
  name: string;
  phone: string;
  email: string;
  location: string;
  serviceType: string;
  message: string;
}

export interface QuoteFormData extends ContactFormData {
  urgency: "normal" | "urgent" | "emergency";
  propertyType: "residential" | "commercial" | "industrial";
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}
