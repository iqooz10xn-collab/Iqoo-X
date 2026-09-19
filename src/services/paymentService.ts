import { PaymentMethod, PaymentStatus } from '../types';

export interface PaymentGatewayConfig {
  id: PaymentMethod;
  name: string;
  nameBn: string;
  isConfigured: boolean;
  requiresMerchantCredentials: boolean;
  statusMessageEn: string;
  statusMessageBn: string;
  instructionsEn: string;
  instructionsBn: string;
  apiEndpointPlaceholder?: string;
}

export interface PaymentInitiationResult {
  success: boolean;
  paymentStatus: PaymentStatus;
  messageEn: string;
  messageBn: string;
  gatewayRedirectUrl?: string;
  requiresManualReview?: boolean;
}

class PaymentService {
  private gateways: Record<PaymentMethod, PaymentGatewayConfig> = {
    cod: {
      id: 'cod',
      name: 'Cash on Delivery (COD)',
      nameBn: 'ক্যাশ অন ডেলিভারি (COD)',
      isConfigured: true,
      requiresMerchantCredentials: false,
      statusMessageEn: 'Active & Available across all 64 districts in Bangladesh.',
      statusMessageBn: 'সক্রিয় ও সারা বাংলাদেশের ৬৪টি জেলায় প্রযোজ্য।',
      instructionsEn: 'Pay the exact parcel amount to the delivery courier agent upon receiving your order.',
      instructionsBn: 'পণ্য হাতে পেয়ে ডেলিভারি কুরিয়ার প্রতিনিধির কাছে নির্ধারিত মূল্য নগদ প্রদান করুন।',
    },
    bkash: {
      id: 'bkash',
      name: 'bKash Merchant Checkout',
      nameBn: 'বিকাশ মার্চেন্ট পেমেন্ট',
      isConfigured: false, // Set to true when BKASH_APP_KEY and BKASH_APP_SECRET are added
      requiresMerchantCredentials: true,
      statusMessageEn: 'Requires bKash Tokenized Checkout Merchant API credentials in production backend.',
      statusMessageBn: 'প্রোডাকশন ব্যাকএন্ডে বিকাশ টোকেনাইজড চেকআউট মার্চেন্ট এপিআই ক্রেডেনশিয়াল প্রয়োজন।',
      instructionsEn: 'Online bKash gateway integration point prepared. Will connect directly to bKash PGW.',
      instructionsBn: 'অনলাইন বিকাশ গেটওয়ে ইন্টিগ্রেশন পয়েন্ট প্রস্তুত। লাইভ সার্ভারে সরাসরি সংযুক্ত হবে।',
      apiEndpointPlaceholder: '/api/v1/payments/bkash/create',
    },
    nagad: {
      id: 'nagad',
      name: 'Nagad Online Gateway',
      nameBn: 'নগদ অনলাইন গেটওয়ে',
      isConfigured: false,
      requiresMerchantCredentials: true,
      statusMessageEn: 'Requires Nagad Merchant ID and Private PG Key in production backend.',
      statusMessageBn: 'প্রোডাকশন ব্যাকএন্ডে নগদ মার্চেন্ট আইডি ও প্রাইভেট পিজি কি প্রয়োজন।',
      instructionsEn: 'Ready for Nagad Payment Gateway redirection flow.',
      instructionsBn: 'নগদ পেমেন্ট গেটওয়ে রিডাইরেকশন প্রবাহের জন্য আর্কিটেকচার প্রস্তুত।',
      apiEndpointPlaceholder: '/api/v1/payments/nagad/initialize',
    },
    rocket: {
      id: 'rocket',
      name: 'Dutch-Bangla Rocket',
      nameBn: 'ডাচ-বাংলা রকেট',
      isConfigured: false,
      requiresMerchantCredentials: true,
      statusMessageEn: 'Requires DBBL Electronic Payment System (EPS) merchant credentials.',
      statusMessageBn: 'ডিবিবিএল ইলেকট্রনিক পেমেন্ট সিস্টেম (ইপিএস) মার্চেন্ট ক্রেডেনশিয়াল প্রয়োজন।',
      instructionsEn: 'Ready for Rocket merchant PGW connection.',
      instructionsBn: 'রকেট মার্চেন্ট পিজিডব্লিউ সংযোগের জন্য প্রস্তুত।',
      apiEndpointPlaceholder: '/api/v1/payments/rocket/checkout',
    },
    upay: {
      id: 'upay',
      name: 'Upay MFS Gateway',
      nameBn: 'উপায় এমএফএস গেটওয়ে',
      isConfigured: false,
      requiresMerchantCredentials: true,
      statusMessageEn: 'Requires UCB Upay Merchant API credentials.',
      statusMessageBn: 'ইউসিবি উপায় মার্চেন্ট এপিআই ক্রেডেনশিয়াল প্রয়োজন।',
      instructionsEn: 'Ready for Upay checkout session creation.',
      instructionsBn: 'উপায় চেকআউট সেশন তৈরির জন্য প্রস্তুত।',
      apiEndpointPlaceholder: '/api/v1/payments/upay/initiate',
    },
  };

  public getAvailableGateways(): PaymentGatewayConfig[] {
    return Object.values(this.gateways);
  }

  public getGateway(method: PaymentMethod): PaymentGatewayConfig {
    return this.gateways[method];
  }

  /**
   * Safe checkout payment initiation.
   * Only Cash on Delivery proceeds to create a valid pending order.
   * Online payment methods strictly require live merchant gateway configuration.
   */
  public async initiatePayment(
    method: PaymentMethod,
    amount: number,
    orderId: string
  ): Promise<PaymentInitiationResult> {
    const config = this.gateways[method];

    if (method === 'cod') {
      return {
        success: true,
        paymentStatus: 'pending', // Pending payment upon delivery
        messageEn: 'Order placed with Cash on Delivery. Pay upon receiving your parcel.',
        messageBn: 'ক্যাশ অন ডেলিভারি পদ্ধতিতে অর্ডার গৃহীত হয়েছে। ডেলিভারির সময় মূল্য পরিশোধ করুন।',
      };
    }

    // For bKash, Nagad, Rocket, Upay:
    // We DO NOT fake successful payment transactions!
    // We provide transparent, honest architectural feedback.
    return {
      success: false,
      paymentStatus: 'pending',
      messageEn: `Online payment via ${config.name} will become available after merchant/payment gateway configuration. Please select Cash on Delivery for testing the checkout flow.`,
      messageBn: `মার্চেন্ট ও পেমেন্ট গেটওয়ে কনফিগারেশনের পর ${config.nameBn}-এর মাধ্যমে অনলাইন পেমেন্ট সুবিধা চালু হবে। অর্ডার সম্পন্ন করতে অনুগ্রহ করে ক্যাশ অন ডেলিভারি নির্বাচন করুন।`,
    };
  }
}

export const paymentService = new PaymentService();
