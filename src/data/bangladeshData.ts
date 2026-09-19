import { ShippingZone } from '../types';

export interface DistrictInfo {
  nameEn: string;
  nameBn: string;
  upazilas: { en: string; bn: string }[];
}

export interface DivisionInfo {
  id: string;
  nameEn: string;
  nameBn: string;
  districts: Record<string, DistrictInfo>;
}

export const BANGLADESH_DIVISIONS: Record<string, DivisionInfo> = {
  dhaka: {
    id: 'dhaka',
    nameEn: 'Dhaka',
    nameBn: 'ঢাকা',
    districts: {
      dhaka_city: {
        nameEn: 'Dhaka (City & Suburbs)',
        nameBn: 'ঢাকা (সিটি ও শহরতলী)',
        upazilas: [
          { en: 'Dhanmondi', bn: 'ধানমন্ডি' },
          { en: 'Gulshan', bn: 'গুলশান' },
          { en: 'Banani', bn: 'বনানী' },
          { en: 'Uttara', bn: 'উত্তরা' },
          { en: 'Mirpur', bn: 'মিরপুর' },
          { en: 'Mohammadpur', bn: 'মোহাম্মদপুর' },
          { en: 'Motijheel', bn: 'মতিঝিল' },
          { en: 'Badda', bn: 'বাড্ডা' },
          { en: 'Khilgaon', bn: 'খিলগাঁও' },
          { en: 'Jatrabari', bn: 'যাত্রাবাড়ী' },
          { en: 'Old Dhaka (Sadarghat)', bn: 'পুরান ঢাকা (সদরঘাট)' },
          { en: 'Savar', bn: 'সাভার' },
          { en: 'Keraniganj', bn: 'কেরানীগঞ্জ' },
          { en: 'Dhamrai', bn: 'ধামরাই' },
        ],
      },
      gazipur: {
        nameEn: 'Gazipur',
        nameBn: 'গাজীপুর',
        upazilas: [
          { en: 'Gazipur Sadar', bn: 'গাজীপুর সদর' },
          { en: 'Kaliakair', bn: 'কালিয়াকৈর' },
          { en: 'Kapasia', bn: 'কাপাসিয়া' },
          { en: 'Sreepur', bn: 'শ্রীপুর' },
          { en: 'Tongi', bn: 'টঙ্গী' },
        ],
      },
      narayanganj: {
        nameEn: 'Narayanganj',
        nameBn: 'নারায়ণগঞ্জ',
        upazilas: [
          { en: 'Narayanganj Sadar', bn: 'নারায়ণগঞ্জ সদর' },
          { en: 'Sonargaon', bn: 'সোনারগাঁও' },
          { en: 'Rupganj', bn: 'রূপগঞ্জ' },
          { en: 'Araihazar', bn: 'আড়াইহাজার' },
          { en: 'Bandar', bn: 'বন্দর' },
        ],
      },
      faridpur: {
        nameEn: 'Faridpur',
        nameBn: 'ফরিদপুর',
        upazilas: [
          { en: 'Faridpur Sadar', bn: 'ফরিদপুর সদর' },
          { en: 'Boalmari', bn: 'বোয়ালমারী' },
          { en: 'Bhanga', bn: 'ভাঙ্গা' },
          { en: 'Madhukhali', bn: 'মধুখালী' },
        ],
      },
      tangail: {
        nameEn: 'Tangail',
        nameBn: 'টাঙ্গাইল',
        upazilas: [
          { en: 'Tangail Sadar', bn: 'টাঙ্গাইল সদর' },
          { en: 'Mirzapur', bn: 'মির্জাপুর' },
          { en: 'Delduar', bn: 'দেলদুয়ার' },
          { en: 'Gopalpur', bn: 'গোপালপুর' },
        ],
      },
    },
  },
  chattogram: {
    id: 'chattogram',
    nameEn: 'Chattogram',
    nameBn: 'চট্টগ্রাম',
    districts: {
      chattogram: {
        nameEn: 'Chattogram',
        nameBn: 'চট্টগ্রাম',
        upazilas: [
          { en: 'Kotwali', bn: 'কোতোয়ালী' },
          { en: 'Panchlaish', bn: 'পাঁচলাইশ' },
          { en: 'Agrabad', bn: 'আগ্রাবাদ' },
          { en: 'Halishahar', bn: 'হালিশহর' },
          { en: 'Sitakunda', bn: 'সীতাকুণ্ড' },
          { en: 'Hathazari', bn: 'হাটহাজারী' },
          { en: 'Patiya', bn: 'পটিয়া' },
        ],
      },
      coxs_bazar: {
        nameEn: "Cox's Bazar",
        nameBn: 'কক্সবাজার',
        upazilas: [
          { en: 'Sadar', bn: 'সদর' },
          { en: 'Teknaf', bn: 'টেকনাফ' },
          { en: 'Ramu', bn: 'রামু' },
          { en: 'Chakaria', bn: 'চকোরিয়া' },
        ],
      },
      cumilla: {
        nameEn: 'Cumilla',
        nameBn: 'কুমিল্লা',
        upazilas: [
          { en: 'Cumilla Adarsha Sadar', bn: 'কুমিল্লা আদর্শ সদর' },
          { en: 'Daudkandi', bn: 'দাউদকান্দি' },
          { en: 'Laksam', bn: 'লাকসাম' },
          { en: 'Chandina', bn: 'চান্দিনা' },
        ],
      },
      noakhali: {
        nameEn: 'Noakhali',
        nameBn: 'নোয়াখালী',
        upazilas: [
          { en: 'Noakhali Sadar', bn: 'নোয়াখালী সদর' },
          { en: 'Begumganj', bn: 'বেগমগঞ্জ' },
          { en: 'Chatkhil', bn: 'চাটখিল' },
        ],
      },
    },
  },
  sylhet: {
    id: 'sylhet',
    nameEn: 'Sylhet',
    nameBn: 'সিলেট',
    districts: {
      sylhet: {
        nameEn: 'Sylhet',
        nameBn: 'সিলেট',
        upazilas: [
          { en: 'Sylhet Sadar', bn: 'সিলেট সদর' },
          { en: 'Golapganj', bn: 'গোলাপগঞ্জ' },
          { en: 'Beanibazar', bn: 'বিয়ানীবাজার' },
          { en: 'Osmani Nagar', bn: 'ওসমানী নগর' },
        ],
      },
      moulvibazar: {
        nameEn: 'Moulvibazar',
        nameBn: 'মৌলভীবাজার',
        upazilas: [
          { en: 'Sadar', bn: 'সদর' },
          { en: 'Sreemangal', bn: 'শ্রীমঙ্গল' },
          { en: 'Kulaura', bn: 'কুলাউড়া' },
        ],
      },
    },
  },
  rajshahi: {
    id: 'rajshahi',
    nameEn: 'Rajshahi',
    nameBn: 'রাজশাহী',
    districts: {
      rajshahi: {
        nameEn: 'Rajshahi',
        nameBn: 'রাজশাহী',
        upazilas: [
          { en: 'Boalia', bn: 'বোয়ালিয়া' },
          { en: 'Rajpara', bn: 'রাজপাড়া' },
          { en: 'Motihar', bn: 'মতিহার' },
          { en: 'Bagha', bn: 'বাঘা' },
          { en: 'Puthia', bn: 'পুঠিয়া' },
        ],
      },
      bogra: {
        nameEn: 'Bogura',
        nameBn: 'বগুড়া',
        upazilas: [
          { en: 'Bogura Sadar', bn: 'বগুড়া সদর' },
          { en: 'Sherpur', bn: 'শেরপুর' },
          { en: 'Shibganj', bn: 'শিবগঞ্জ' },
        ],
      },
    },
  },
  khulna: {
    id: 'khulna',
    nameEn: 'Khulna',
    nameBn: 'খুলনা',
    districts: {
      khulna: {
        nameEn: 'Khulna',
        nameBn: 'খুলনা',
        upazilas: [
          { en: 'Khulna Sadar', bn: 'খুলনা সদর' },
          { en: 'Sonadanga', bn: 'সোনাডাঙ্গা' },
          { en: 'Daulatpur', bn: 'দৌলতপুর' },
          { en: 'Dighalia', bn: 'দিঘলিয়া' },
        ],
      },
      jashore: {
        nameEn: 'Jashore',
        nameBn: 'যশোর',
        upazilas: [
          { en: 'Jashore Sadar', bn: 'যশোর সদর' },
          { en: 'Jhikargacha', bn: 'ঝিকরগাছা' },
          { en: 'Benapole', bn: 'বেনাপোল' },
        ],
      },
    },
  },
  barishal: {
    id: 'barishal',
    nameEn: 'Barishal',
    nameBn: 'বরিশাল',
    districts: {
      barishal: {
        nameEn: 'Barishal',
        nameBn: 'বরিশাল',
        upazilas: [
          { en: 'Barishal Sadar', bn: 'বরিশাল সদর' },
          { en: 'Babuganj', bn: 'বাবুগঞ্জ' },
          { en: 'Bakerganj', bn: 'বাকেরগঞ্জ' },
        ],
      },
    },
  },
  rangpur: {
    id: 'rangpur',
    nameEn: 'Rangpur',
    nameBn: 'রংপুর',
    districts: {
      rangpur: {
        nameEn: 'Rangpur',
        nameBn: 'রংপুর',
        upazilas: [
          { en: 'Rangpur Sadar', bn: 'রংপুর সদর' },
          { en: 'Pirganj', bn: 'পীরগঞ্জ' },
          { en: 'Badarganj', bn: 'বদরগঞ্জ' },
        ],
      },
      dinajpur: {
        nameEn: 'Dinajpur',
        nameBn: 'দিনাজপুর',
        upazilas: [
          { en: 'Dinajpur Sadar', bn: 'দিনাজপুর সদর' },
          { en: 'Birganj', bn: 'বীরগঞ্জ' },
        ],
      },
    },
  },
  mymensingh: {
    id: 'mymensingh',
    nameEn: 'Mymensingh',
    nameBn: 'ময়মনসিংহ',
    districts: {
      mymensingh: {
        nameEn: 'Mymensingh',
        nameBn: 'ময়মনসিংহ',
        upazilas: [
          { en: 'Mymensingh Sadar', bn: 'ময়মনসিংহ সদর' },
          { en: 'Muktagacha', bn: 'মুক্তাগাছা' },
          { en: 'Trishal', bn: 'ত্রিশাল' },
          { en: 'Bhaluka', bn: 'ভালুকা' },
        ],
      },
    },
  },
};

export const DEFAULT_SHIPPING_ZONES: ShippingZone[] = [
  {
    id: 'inside_dhaka',
    nameEn: 'Inside Dhaka City',
    nameBn: 'ঢাকা সিটির ভেতরে',
    rate: 60,
    estimatedDaysEn: '24-48 Hours',
    estimatedDaysBn: '২৪-৪৮ ঘণ্টা',
  },
  {
    id: 'outside_dhaka',
    nameEn: 'Outside Dhaka / Nationwide',
    nameBn: 'ঢাকার বাইরে / সারা বাংলাদেশ',
    rate: 120,
    estimatedDaysEn: '2-4 Business Days',
    estimatedDaysBn: '২-৪ কার্যদিবস',
  },
];

export const getDivisionList = (): DivisionInfo[] => {
  return Object.values(BANGLADESH_DIVISIONS);
};

export const getDistrictsByDivisionId = (divisionId: string): DistrictInfo[] => {
  const div = BANGLADESH_DIVISIONS[divisionId.toLowerCase()];
  return div ? Object.values(div.districts) : [];
};

export const getUpazilasByDistrictName = (districtName: string): { en: string; bn: string }[] => {
  for (const div of Object.values(BANGLADESH_DIVISIONS)) {
    for (const dist of Object.values(div.districts)) {
      if (dist.nameEn.toLowerCase() === districtName.toLowerCase() || dist.nameBn === districtName) {
        return dist.upazilas;
      }
    }
  }
  return [{ en: 'Sadar', bn: 'সদর' }];
};

