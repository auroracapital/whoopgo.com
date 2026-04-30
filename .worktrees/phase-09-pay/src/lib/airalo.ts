// Airalo eSIM API client types (server-side implementation in server.js)
// This module provides type definitions shared between client and server

export interface AiraloPackage {
  id: string;
  slug: string;
  title: string;
  data: string;
  validity: number;
  price: number;
  currency: string;
  countries: string[];
}

export interface AiraloSim {
  iccid: string;
  qrcode: string;
  qrcode_url: string;
  activation_code: string;
  apn?: string;
}

export interface AiraloOrderResponse {
  data: {
    id: number;
    code: string;
    currency: string;
    package_id: string;
    quantity: number;
    type: string;
    sims: AiraloSim[];
  };
}

// Plan ID → Airalo package slug mapping
export const AIRALO_PACKAGE_MAP: Record<string, string> = {
  "us-1gb-7d":        "united-states-1gb-7days",
  "us-3gb-15d":       "united-states-3gb-15days",
  "us-5gb-30d":       "united-states-5gb-30days",
  "us-10gb-30d":      "united-states-10gb-30days",
  "eu-5gb-7d":        "europe-5gb-7days",
  "eu-10gb-15d":      "europe-10gb-15days",
  "eu-unlimited-30d": "europe-unlimited-30days",
  "apac-5gb-7d":      "asia-5gb-7days",
  "global-10gb-30d":  "global-10gb-30days",
};
