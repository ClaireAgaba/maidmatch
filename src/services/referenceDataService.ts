import { ugandanDistricts, ugandanLanguages, ugandanTribes } from '../data/referenceData';

console.log('Imported data:', {
  districts: ugandanDistricts,
  languages: ugandanLanguages,
  tribes: ugandanTribes
});

export interface ReferenceDataItem {
  _id: string;
  name: string;
  active: boolean;
  region?: string;
}

export interface ReferenceData {
  districts: ReferenceDataItem[];
  tribes: ReferenceDataItem[];
  languages: ReferenceDataItem[];
}

class ReferenceDataService {
  constructor() {
    console.log('ReferenceDataService initialized with data:', {
      districts: ugandanDistricts,
      languages: ugandanLanguages,
      tribes: ugandanTribes
    });
  }

  getAllReferenceData(): ReferenceData {
    console.log('Getting all reference data');
    const data = {
      districts: ugandanDistricts,
      tribes: ugandanTribes,
      languages: ugandanLanguages
    };
    console.log('Returning data:', data);
    return data;
  }

  getDistricts(): ReferenceDataItem[] {
    console.log('Getting districts:', ugandanDistricts);
    return ugandanDistricts;
  }

  getTribes(): ReferenceDataItem[] {
    console.log('Getting tribes:', ugandanTribes);
    return ugandanTribes;
  }

  getLanguages(): ReferenceDataItem[] {
    console.log('Getting languages:', ugandanLanguages);
    return ugandanLanguages;
  }
}

// Create and export a single instance
const referenceDataService = new ReferenceDataService();
export { referenceDataService };
