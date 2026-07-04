export interface User {
  _id: string;
  name: string;
  email: string;
  role: "citizen" | "officer" | "admin";
  phone?: string;
  aadharNumber?: string;
  address?: { street?: string; city?: string; state?: string; pincode?: string };
  preferredLanguage?: string;
  token: string;
}

export interface Scheme {
  _id: string;
  title: string;
  description: string;
  category: string;
  eligibility: { minAge?: number; maxAge?: number; gender?: string; incomeLimit?: number; description?: string };
  benefits: string[];
  documents: string[];
  ministry?: string;
  officialLink?: string;
  tags: string[];
}

export interface Application {
  _id: string;
  applicationNumber: string;
  scheme: Scheme;
  status: "pending" | "under_review" | "approved" | "rejected";
  pdfUrl?: string;
  timeline: { status: string; message: string; at: string }[];
  remarks: { text: string; at: string }[];
  createdAt: string;
}

export interface Document {
  _id: string;
  name: string;
  type: string;
  fileUrl: string;
  verificationStatus: "pending" | "verified" | "rejected";
  createdAt: string;
}

export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
