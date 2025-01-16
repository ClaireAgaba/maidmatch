console.log('Loading reference data file...');

export const ugandanDistricts = [
  { _id: '1', name: 'Kampala', active: true, region: 'Central' },
  { _id: '2', name: 'Wakiso', active: true, region: 'Central' },
  { _id: '3', name: 'Mukono', active: true, region: 'Central' },
  { _id: '4', name: 'Jinja', active: true, region: 'Eastern' },
  { _id: '5', name: 'Mbale', active: true, region: 'Eastern' },
  { _id: '6', name: 'Gulu', active: true, region: 'Northern' },
  { _id: '7', name: 'Lira', active: true, region: 'Northern' },
  { _id: '8', name: 'Mbarara', active: true, region: 'Western' },
  { _id: '9', name: 'Kabale', active: true, region: 'Western' },
  { _id: '10', name: 'Masaka', active: true, region: 'Central' }
];

export const ugandanLanguages = [
  { _id: '1', name: 'Luganda', active: true },
  { _id: '2', name: 'English', active: true },
  { _id: '3', name: 'Swahili', active: true },
  { _id: '4', name: 'Runyankole', active: true },
  { _id: '5', name: 'Acholi', active: true },
  { _id: '6', name: 'Ateso', active: true },
  { _id: '7', name: 'Lugbara', active: true },
  { _id: '8', name: 'Lusoga', active: true }
];

export const ugandanTribes = [
  { _id: '1', name: 'Baganda', active: true },
  { _id: '2', name: 'Banyankole', active: true },
  { _id: '3', name: 'Basoga', active: true },
  { _id: '4', name: 'Bakiga', active: true },
  { _id: '5', name: 'Iteso', active: true },
  { _id: '6', name: 'Langi', active: true },
  { _id: '7', name: 'Acholi', active: true },
  { _id: '8', name: 'Bagisu', active: true }
];

export const nationalities = [
  'Ugandan',
  'Kenyan',
  'Tanzanian',
  'Rwandan',
  'Burundian',
  'South Sudanese'
];

export const educationLevels = [
  'degree',
  'diploma',
  'certificate',
  'alevel',
  'olevel',
  'primary'
];

export const skills = [
  'cleaning',
  'cooking',
  'babysitting',
  'laundry',
  'elderly care',
  'pet care',
  'gardening',
  'housekeeping',
  'driving',
  'tutoring'
];

export const relationships = [
  'sibling',
  'spouse',
  'uncle',
  'aunt',
  'dad',
  'mom',
  'friend'
];

export const documentRequirements = {
  maxSize: 2 * 1024 * 1024, // 2MB in bytes
  allowedTypes: ['application/pdf'],
  documents: [
    {
      id: 'id',
      name: 'National ID',
      required: true
    },
    {
      id: 'medicalCertificate',
      name: 'Medical Certificate',
      required: true
    },
    {
      id: 'policeLetter',
      name: 'Police/LC Letter',
      required: true
    },
    {
      id: 'referenceLetter',
      name: 'Reference Letter',
      required: true
    },
    {
      id: 'educationCertificate',
      name: 'Education Certificate',
      required: true
    }
  ]
};

console.log('Reference data loaded:', {
  districtsCount: ugandanDistricts.length,
  languagesCount: ugandanLanguages.length,
  tribesCount: ugandanTribes.length,
  nationalitiesCount: nationalities.length,
  skillsCount: skills.length,
  educationLevelsCount: educationLevels.length
});
