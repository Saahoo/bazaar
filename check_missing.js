const fs = require('fs');
const path = require('path');

const en = JSON.parse(fs.readFileSync('src/locales/en/common.json', 'utf8'));
const fa = JSON.parse(fs.readFileSync('src/locales/fa/common.json', 'utf8'));
const ps = JSON.parse(fs.readFileSync('src/locales/ps/common.json', 'utf8'));

function get(obj, path) {
    return path.split('.').reduce((o, p) => o?.[p], obj);
}

const keys = [
    'common.vehicles.adDetails',
    'common.vehicles.color',
    'common.vehicles.engineType',
    'common.vehicles.enterPostalCode',
    'common.vehicles.gearType',
    'common.vehicles.has360Spin',
    'common.vehicles.make',
    'common.vehicles.model',
    'common.vehicles.numberPlateCity',
    'common.vehicles.postalCode',
    'common.vehicles.selectMakeFirst',
    'common.vehicles.vehicleType',
    'common.vehicles.wheelDriveType',
    'common.vehicles.sedan',
    'common.vehicles.suv',
    'common.vehicles.van',
    'common.vehicles.truck',
    'common.vehicles.pickup',
    'common.vehicles.hatchback',
    'common.vehicles.coupe',
    'common.vehicles.convertible',
    'common.vehicles.wagon',
    'common.vehicles.motorcycle',
    'common.vehicles.wd_fwd',
    'common.vehicles.wd_rwd',
    'common.vehicles.wd_awd',
    'common.vehicles.wd_4wd',
    'common.vehicles.color_white',
    'common.vehicles.color_black',
    'common.vehicles.color_silver',
    'common.vehicles.color_gray',
    'common.vehicles.color_red',
    'common.vehicles.color_blue',
    'common.vehicles.color_green',
    'common.vehicles.color_beige',
    'common.vehicles.color_gold',
    'common.vehicles.color_brown',
    'common.vehicles.color_orange',
    'common.vehicles.color_yellow',
    'common.vehicles.color_purple',
    'common.vehicles.color_navy',
    'common.vehicles.color_maroon',
    'common.vehicles.color_champagne',
    'common.vehicles.color_other',
    'search.features',
    'search.any',
    'search.anyColor',
    'search.anyPlateCity',
    'search.anyWheelDrive',
    'search.filter',
    'search.keywords',
    'search.kmRange',
    'search.max',
    'search.maxKm',
    'search.min',
    'search.minKm',
    'search.priceRange',
    'search.yearRange',
];

console.log('Key\tEN\tFA\tPS');
keys.forEach(k => {
    const enVal = get(en, k);
    const faVal = get(fa, k);
    const psVal = get(ps, k);
    console.log(`${k}\t${enVal ? '✓' : '✗'}\t${faVal ? '✓' : '✗'}\t${psVal ? '✓' : '✗'}`);
});