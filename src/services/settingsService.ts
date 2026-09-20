export interface SiteSettings {
  websiteName: string;
  websiteTagline: string;
  logoUrl: string;
  faviconUrl: string;
  currency: string;
  currencySymbol: string;
  defaultLanguage: 'en' | 'bn';
  contactPhone: string; // Initially empty as requested by user
  contactEmail: string; // Initially empty as requested by user
  businessAddress: string;
  supportHours: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  insideDhakaDeliveryRate: number;
  outsideDhakaDeliveryRate: number;
  taxRatePercent: number;
  enableCod: boolean;
  enableBkash: boolean;
  enableNagad: boolean;
  enableRocket: boolean;
  enableUpay: boolean;
  metaTitle: string;
  metaDescription: string;
}

const STORAGE_KEY_SETTINGS = 'amarbazaar_site_settings';

export const DEFAULT_SETTINGS: SiteSettings = {
  websiteName: 'AmarBazaar',
  websiteTagline: 'Bangladesh’s Modern Digital Commerce Platform',
  logoUrl: '',
  faviconUrl: '',
  currency: 'BDT',
  currencySymbol: '৳',
  defaultLanguage: 'en',
  contactPhone: '', // Left empty initially as per requirement
  contactEmail: '', // Left empty initially as per requirement
  businessAddress: 'Level 7, BDBL Bhaban, 12 Kazi Nazrul Islam Avenue, Kawran Bazar, Dhaka 1215, Bangladesh',
  supportHours: '9:00 AM – 10:00 PM (Daily)',
  facebookUrl: '',
  instagramUrl: '',
  youtubeUrl: '',
  insideDhakaDeliveryRate: 60,
  outsideDhakaDeliveryRate: 120,
  taxRatePercent: 0,
  enableCod: true,
  enableBkash: false, // Requires merchant credentials
  enableNagad: false,
  enableRocket: false,
  enableUpay: false,
  metaTitle: 'AmarBazaar - Bangladeshi Business E-Commerce',
  metaDescription: 'A complete, modern, production-ready Bangladeshi business e-commerce platform with bilingual English and Bangla support, BDT currency, and full retail architecture.',
};

class SettingsService {
  private settings: SiteSettings = { ...DEFAULT_SETTINGS };

  constructor() {
    this.init();
  }

  private init() {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEY_SETTINGS);
        if (stored) {
          this.settings = { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
        }
      }
    } catch {
      this.settings = { ...DEFAULT_SETTINGS };
    }
  }

  public getSettings(): SiteSettings {
    return { ...this.settings };
  }

  public updateSettings(newSettings: Partial<SiteSettings>): SiteSettings {
    this.settings = { ...this.settings, ...newSettings };
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(this.settings));
      }
    } catch {
      // ignore
    }
    return { ...this.settings };
  }
}

export const settingsService = new SettingsService();
