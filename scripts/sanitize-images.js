const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'update-place-specific-images.js');
let content = fs.readFileSync(filePath, 'utf8');

const replacements = [
  ['Independence_Memorial_Hall,_Colombo.jpg', 'Independence_Memorial_Hall_Colombo_Sri_Lanka.jpg'],
  ['Negombo_Beach,_Sri_Lanka.jpg', 'Negombo_Catamarans.jpg'],
  ['Negombo_Lagoon,_Sri_Lanka.jpg', 'Fishing_boats_in_Negombo_lagoon.jpg'],
  ['Richmond_Castle,_Kalutara.jpg', 'Richmond_Castle_Kalutara_Front.jpg'],
  ['Kandy_Lake,_Sri_Lanka.jpg', 'Kandy_Lake.jpg'],
  ["World's_End,_Horton_Plains,_Sri_Lanka.jpg", "Worlds_End_Sri_Lanka.jpg"],
  ["St._Clair's_Falls.jpg", "Devon_Falls_Talawakele.jpg"],
  ['Stilt_fishing_in_Koggala,_Sri_Lanka.jpg', 'Stilt_fishing_in_Koggala.jpg'],
  ['Mirissa_Beach,_Sri_Lanka.jpg', 'Mirissa_Beach.jpg'],
  ['Hummanaya(Blow_hole),_Kudawella,_Sri_Lanka.jpg', 'Hummanaya.jpg'],
  ['Jaffna_Fort_(1).jpg', 'Jaffna_fort_entrance.jpg'],
  ["Adam's_Bridge_Talaimannar.jpg", 'Sandbanks_Adams_Bridge.jpg'],
  ['Mannar_Baobab_(31294170688).jpg', 'Baobab_Tree_Pallimunai.jpg'],
  ['Pigeon_Island_National_Park,_Trincomalee.jpg', 'Pigeon_Island.jpg'],
  ['Fort_Frederick,_Trincomalee.jpg', 'Fort_Frederick.jpg'],
  ['Pasikudah_beach,_Sri_Lanka.jpg', 'Pasikudah_beach.jpg'],
  ['Gal_Vihara,_Polonnaruwa,_Sri_Lanka.jpg', 'Gal_Vihara_Reclining_Buddha.jpg'],
  ['Nine_Arch_Bridge,_Demodara.jpg', 'The_Nine_Arches_Bridge.jpg'],
  ["Little_Adam's_Peak_Ella.jpg", 'Little_Adams_Peak_Trail.jpg'],
  ["Lipton's_Seat_Haputale.jpg", 'Dambatenne_Tea_Factory.jpg'],
  ['Bambarakanda_Falls,Sri_Lanka.jpg', 'Bambarakanda_Falls.jpg'],
  ["Adam's_Peak_-_January_2020.jpg", 'Adams_Peak_Sri_Lanka.jpg'],
  ['Udawalawe_National_Park_(Udawalawa_Reservoir).jpg', 'Elephant_Transit_Home_Udawalawe.jpg'],
  ['Point_pedro_land%27s_end.jpg', 'Point_Pedro_Beach.jpg']
];

let count = 0;
replacements.forEach(([from, to]) => {
  if (content.includes(from)) {
    content = content.split(from).join(to);
    count++;
  }
});

fs.writeFileSync(filePath, content, 'utf8');
console.log(`Sanitized ${count} problematic filenames in update-place-specific-images.js`);
