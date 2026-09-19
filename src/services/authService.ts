import { CustomerUser, Address } from '../types';

export interface AuthState {
  isAuthenticated: boolean;
  user: CustomerUser | null;
  provider: 'firebase' | 'supabase' | 'custom_jwt' | 'unconfigured';
  backendConfigured: boolean;
}

const STORAGE_KEY_AUTH = 'amarbazaar_auth_session';

class AuthService {
  private currentUser: CustomerUser | null = null;
  private backendConfigured: boolean = false; // Flag indicating whether live auth backend (Firebase/Supabase) is connected

  constructor() {
    this.init();
  }

  private init() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_AUTH);
      if (stored) {
        this.currentUser = JSON.parse(stored);
      }
    } catch {
      this.currentUser = null;
    }
  }

  public isBackendConnected(): boolean {
    return this.backendConfigured;
  }

  public getCurrentUser(): CustomerUser | null {
    return this.currentUser;
  }

  public getAuthState(): AuthState {
    return {
      isAuthenticated: this.currentUser !== null,
      user: this.currentUser,
      provider: this.backendConfigured ? 'firebase' : 'unconfigured',
      backendConfigured: this.backendConfigured,
    };
  }

  /**
   * Client session profile update (for checkout and user address book).
   */
  public updateLocalProfile(profile: Partial<CustomerUser>): CustomerUser {
    if (!this.currentUser) {
      this.currentUser = {
        id: `guest_${Date.now()}`,
        name: profile.name || 'Guest Customer',
        phone: profile.phone || '',
        email: profile.email || '',
        addresses: profile.addresses || [],
        createdAt: new Date().toISOString(),
      };
    } else {
      this.currentUser = { ...this.currentUser, ...profile };
    }

    try {
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(this.currentUser));
    } catch {
      // ignore
    }
    return this.currentUser;
  }

  public saveAddress(address: Address): Address[] {
    if (!this.currentUser) {
      this.currentUser = {
        id: `guest_${Date.now()}`,
        name: address.fullName,
        phone: address.phone,
        email: address.email || '',
        addresses: [address],
        createdAt: new Date().toISOString(),
      };
    } else {
      const existingIdx = this.currentUser.addresses.findIndex(
        (a) => a.streetAddress === address.streetAddress && a.district === address.district
      );
      if (existingIdx >= 0) {
        this.currentUser.addresses[existingIdx] = address;
      } else {
        this.currentUser.addresses.push(address);
      }
    }

    try {
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(this.currentUser));
    } catch {
      // ignore
    }
    return this.currentUser.addresses;
  }

  public async register(data: {
    name: string;
    phone: string;
    email?: string;
    password?: string;
  }): Promise<{ success: boolean; user?: CustomerUser; message?: string }> {
    const user: CustomerUser = {
      id: `cust_${Date.now()}`,
      name: data.name,
      phone: data.phone,
      email: data.email || '',
      addresses: [],
      createdAt: new Date().toISOString(),
    };
    this.currentUser = user;
    try {
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(this.currentUser));
    } catch {
      // ignore
    }
    return {
      success: true,
      user,
      message: 'Account registered locally. Ready for Firebase/Supabase connection.',
    };
  }

  public async login(
    identifier: string,
    password?: string
  ): Promise<{ success: boolean; user?: CustomerUser; message?: string }> {
    if (
      this.currentUser &&
      (this.currentUser.phone === identifier || this.currentUser.email === identifier)
    ) {
      return { success: true, user: this.currentUser };
    }
    const user: CustomerUser = {
      id: `cust_${Date.now()}`,
      name: 'Valued Customer',
      phone: identifier.includes('@') ? '01711000000' : identifier,
      email: identifier.includes('@') ? identifier : 'customer@amarbazaar.com.bd',
      addresses: [],
      createdAt: new Date().toISOString(),
    };
    this.currentUser = user;
    try {
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(this.currentUser));
    } catch {
      // ignore
    }
    return { success: true, user };
  }

  public signOut() {
    this.currentUser = null;
    localStorage.removeItem(STORAGE_KEY_AUTH);
  }
}

export const authService = new AuthService();
