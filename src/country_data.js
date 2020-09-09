// Country model:
// [
//    Country name,
//    Regions,
//    iso2 code,
//    International dial code,
//    Format (if available),
//    Order (if >1 country with same dial code),
//    Area codes (if >1 country with same dial code)
// ]
//
// Regions:
// ['america', 'europe', 'asia', 'oceania', 'africa']
//
// Sub-regions:
// ['north-america', 'south-america', 'central-america', 'carribean',
//  'european-union', 'ex-ussr', 'middle-east', 'north-africa']

const rawAllCountries = [
  [
    '中国大陆',
    ['asia'],
    'cn',
    '86',
    '+.. ..-.........',
  ],
  [
    '香港',
    ['asia'],
    'hk',
    '852',
    '+... .... ....',
  ],
  [
    '澳门',
    ['asia'],
    'mo',
    '853',
  ],
  [
    '台湾',
    ['asia'],
    'tw',
    '886',
  ],
  [
    '菲律宾',
    ['asia'],
    'ph',
    '63',
    '+.. .... .......',
  ],
  [
    '马来西亚',
    ['asia'],
    'my',
    '60',
    '+.. ..-....-....',
  ],
  [
    '新加坡',
    ['asia'],
    'sg',
    '65',
    '+.. ....-....',
  ],
  [
    '日本',
    ['asia'],
    'jp',
    '81',
    '+.. .. .... ....',
  ],
  [
    '韩国',
    ['asia'],
    'kr',
    '82',
    '+.. ... .... ....',
  ],
  [
    '澳大利亚',
    ['oceania'],
    'au',
    '61',
    '+.. ... ... ...',
  ],
  [
    '英国',
    ['europe', 'european-union'],
    'gb',
    '44',
    '+.. .... ......',
  ],
  [
    '美国',
    ['america', 'north-america'],
    'us',
    '1',
    '+. (...) ...-....',
  ],
];

const allCountryCodes = {};

function addCountryCode(iso2, dialCode, priority) {
  if (!(dialCode in allCountryCodes)) {
    allCountryCodes[dialCode] = [];
  }
  const index = priority || 0;
  allCountryCodes[dialCode][index] = iso2;
}

const allCountries = [].concat(...rawAllCountries.map((country) => {
  const [name, regions, iso2, dialCode, format, priority, areaCodes] = country;

  const countryItem = {
    name,
    regions,
    iso2,
    dialCode,
    priority,
    format: format || undefined,
    hasAreaCodes: areaCodes,
  };

  const areaItems = [];

  if (countryItem.hasAreaCodes) {
    areaCodes.forEach((areaCode) => {
      const areaItem = {
        ...countryItem,
        regions,
        dialCode: `${dialCode}${areaCode}`,
        isAreaCode: true,
      };

      areaItems.push(areaItem);

      addCountryCode(iso2, areaItem.dialCode);
    });
  }

  addCountryCode(
    countryItem.iso2,
    countryItem.dialCode,
    countryItem.hasAreaCodes,
  );

  return (areaItems.length > 0) ? [countryItem, ...areaItems] : [countryItem];
}));

module.exports = {
  allCountries,
  allCountryCodes,
};
