export const VEHICLE_MAKES_US = [
  'Acura', 'Alfa Romeo', 'Audi', 'BMW', 'Buick', 'Cadillac', 'Chevrolet',
  'Chrysler', 'Dodge', 'Fiat', 'Ford', 'Genesis', 'GMC', 'Honda', 'Hyundai',
  'Infiniti', 'Jaguar', 'Jeep', 'Kia', 'Land Rover', 'Lexus', 'Lincoln',
  'Maserati', 'Mazda', 'Mercedes-Benz', 'Mini', 'Mitsubishi', 'Nissan',
  'Porsche', 'Ram', 'Rivian', 'Subaru', 'Tesla', 'Toyota', 'Volkswagen', 'Volvo',
];

export const VEHICLE_MAKES_BR = [
  'Audi', 'BMW', 'BYD', 'Caoa Chery', 'Chevrolet', 'Citroën', 'Fiat',
  'Ford', 'GWM', 'Honda', 'Hyundai', 'JAC', 'Jeep', 'Kia', 'Land Rover',
  'Lexus', 'Mercedes-Benz', 'Mini', 'Mitsubishi', 'Nissan', 'Peugeot',
  'Porsche', 'RAM', 'Renault', 'Subaru', 'Suzuki', 'Toyota', 'Volkswagen', 'Volvo',
];

export const VEHICLE_MODELS: Record<string, string[]> = {
  Acura: ['ILX', 'Integra', 'MDX', 'RDX', 'TLX'],
  'Alfa Romeo': ['Giulia', 'Stelvio', 'Tonale'],
  Audi: ['A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'e-tron', 'Q3', 'Q5', 'Q7', 'Q8'],
  BMW: ['2 Series', '3 Series', '4 Series', '5 Series', '7 Series', 'X1', 'X3', 'X5', 'X7', 'iX', 'i4'],
  BYD: ['Dolphin', 'Dolphin Mini', 'Han', 'King', 'Seal', 'Song Plus', 'Song Pro', 'Tan', 'Yuan Plus'],
  Buick: ['Enclave', 'Encore', 'Encore GX', 'Envista'],
  Cadillac: ['CT4', 'CT5', 'Escalade', 'Lyriq', 'XT4', 'XT5', 'XT6'],
  'Caoa Chery': ['Arrizo 6', 'Arrizo 6 Pro', 'Tiggo 3X', 'Tiggo 5X', 'Tiggo 7', 'Tiggo 7 Pro', 'Tiggo 8'],
  Chevrolet: [
    'Blazer', 'Bolt EV', 'Camaro', 'Colorado', 'Corvette', 'Cruze',
    'Equinox', 'Malibu', 'Montana', 'Onix', 'Onix Plus', 'S10',
    'Silverado', 'Spin', 'Suburban', 'Tahoe', 'Tracker', 'Trailblazer', 'Traverse',
  ],
  Chrysler: ['300', 'Pacifica'],
  'Citroën': ['C3', 'C3 Aircross', 'C4 Cactus', 'C5 Aircross', 'Jumpy'],
  Dodge: ['Challenger', 'Charger', 'Durango', 'Hornet'],
  Fiat: [
    'Argo', 'Cronos', 'Fastback', 'Fiorino', 'Mobi', 'Pulse',
    'Scudo', 'Strada', 'Toro', 'Uno',
  ],
  Ford: [
    'Bronco', 'Bronco Sport', 'Edge', 'Escape', 'Expedition', 'Explorer',
    'F-150', 'Maverick', 'Mustang', 'Ranger', 'Territory', 'Transit',
  ],
  GMC: ['Acadia', 'Canyon', 'Sierra', 'Terrain', 'Yukon'],
  GWM: ['Haval H6', 'Haval Jolion', 'Ora 03', 'Poer'],
  Genesis: ['G70', 'G80', 'G90', 'GV60', 'GV70', 'GV80'],
  Honda: [
    'Accord', 'BR-V', 'City', 'Civic', 'CR-V', 'Fit',
    'HR-V', 'Odyssey', 'Passport', 'Pilot', 'Ridgeline', 'WR-V', 'ZR-V',
  ],
  Hyundai: [
    'Accent', 'Creta', 'Elantra', 'HB20', 'HB20S', 'Ioniq 5', 'Ioniq 6',
    'Kona', 'Palisade', 'Santa Cruz', 'Santa Fe', 'Sonata', 'Tucson', 'Venue',
  ],
  Infiniti: ['Q50', 'Q60', 'QX50', 'QX55', 'QX60', 'QX80'],
  JAC: ['E-JS1', 'E-JS4', 'Hunter', 'T60', 'T80'],
  Jaguar: ['E-Pace', 'F-Pace', 'F-Type', 'I-Pace', 'XE', 'XF'],
  Jeep: ['Cherokee', 'Commander', 'Compass', 'Gladiator', 'Grand Cherokee', 'Renegade', 'Wagoneer', 'Wrangler'],
  Kia: [
    'Carnival', 'EV6', 'EV9', 'Forte', 'K5', 'Niro',
    'Rio', 'Seltos', 'Sorento', 'Soul', 'Sportage', 'Stonic', 'Telluride',
  ],
  'Land Rover': ['Defender', 'Discovery', 'Discovery Sport', 'Range Rover', 'Range Rover Evoque', 'Range Rover Sport', 'Range Rover Velar'],
  Lexus: ['ES', 'GX', 'IS', 'LC', 'LX', 'NX', 'RX', 'RZ', 'TX', 'UX'],
  Lincoln: ['Aviator', 'Corsair', 'Nautilus', 'Navigator'],
  Maserati: ['Ghibli', 'GranTurismo', 'Grecale', 'Levante', 'MC20', 'Quattroporte'],
  Mazda: ['CX-30', 'CX-5', 'CX-50', 'CX-90', 'Mazda3', 'MX-5 Miata', 'MX-30'],
  'Mercedes-Benz': [
    'A-Class', 'C-Class', 'CLA', 'E-Class', 'EQB', 'EQE', 'EQS',
    'GLA', 'GLB', 'GLC', 'GLE', 'GLS', 'S-Class',
  ],
  Mini: ['Clubman', 'Convertible', 'Cooper', 'Countryman'],
  Mitsubishi: ['Eclipse Cross', 'L200 Triton', 'Outlander', 'Outlander Sport', 'Pajero Sport'],
  Nissan: [
    'Altima', 'Ariya', 'Frontier', 'Kicks', 'Leaf', 'Maxima',
    'Murano', 'Pathfinder', 'Rogue', 'Sentra', 'Titan', 'Versa',
  ],
  Peugeot: ['208', '2008', '308', '3008', '408', '5008', 'Expert', 'Partner'],
  Porsche: ['718', '911', 'Cayenne', 'Macan', 'Panamera', 'Taycan'],
  Ram: ['1500', '2500', '3500', 'ProMaster'],
  RAM: ['Rampage', '1500', '2500', '3500'],
  Renault: ['Captur', 'Duster', 'Kardian', 'Kwid', 'Logan', 'Master', 'Oroch', 'Sandero', 'Stepway'],
  Rivian: ['R1S', 'R1T'],
  Subaru: ['BRZ', 'Crosstrek', 'Forester', 'Impreza', 'Legacy', 'Outback', 'Solterra', 'WRX'],
  Suzuki: ['Jimny', 'S-Cross', 'Swift', 'Vitara'],
  Tesla: ['Model 3', 'Model S', 'Model X', 'Model Y', 'Cybertruck'],
  Toyota: [
    'Camry', 'Corolla', 'Corolla Cross', 'Crown', 'GR86', 'GR Supra',
    'Grand Highlander', 'Highlander', 'Hilux', 'Land Cruiser', 'Prius',
    'RAV4', 'Sequoia', 'SW4', 'Tacoma', 'Tundra', 'Yaris',
  ],
  Volkswagen: [
    'Atlas', 'Golf', 'ID.4', 'Jetta', 'Nivus', 'Passat', 'Polo',
    'Saveiro', 'T-Cross', 'Taos', 'Tarok', 'Tiguan', 'Virtus',
  ],
  Volvo: ['C40', 'EX30', 'EX90', 'S60', 'S90', 'V60', 'XC40', 'XC60', 'XC90'],
};

export function getMakesForCountry(country: string): string[] {
  return country === 'BR' ? VEHICLE_MAKES_BR : VEHICLE_MAKES_US;
}

export function getModelsForMake(make: string): string[] {
  return VEHICLE_MODELS[make] || [];
}
