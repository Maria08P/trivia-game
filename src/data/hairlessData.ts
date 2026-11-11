/**
 * The Hairless Menagerie Data Repository
 * Exhaustive trivia questions and creature compendium covering bald, hairless, and smooth fauna.
 */

export interface TriviaQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: 'Mammals' | 'Marine' | 'Amphibians & Reptiles' | 'Evolution' | 'Weird Science';
  difficulty: 'Ground Floor' | 'Mezzanine' | 'Penthouse';
  animalFocus: string;
}

export interface HairlessCreature {
  id: string;
  commonName: string;
  scientificName: string;
  category: string;
  hairStatus: string; // e.g. "Virtually 100% hairless", "Sparse sensory bristles"
  evolutionaryReason: string;
  quirk: string;
  superpower: string;
  diet: string;
  conservationStatus: string;
  iconType: string;
}

export const HAIRLESS_CREATURES: HairlessCreature[] = [
  {
    id: 'naked-mole-rat',
    commonName: 'Naked Mole-Rat',
    scientificName: 'Heterocephalus glaber',
    category: 'Subterranean Rodent',
    hairStatus: 'Nearly bald (only ~100 tactile sensory hairs)',
    evolutionaryReason: 'Living underground in narrow burrows means fur would collect parasites, trap unbearable heat, and snag on tunnel walls.',
    quirk: 'They lack the neurotransmitter Substance P, making them immune to the sting of acid and chili peppers (capsaicin).',
    superpower: 'Can survive 18 minutes in pure nitrogen with 0% oxygen by metabolizing fructose like plants, and rarely get cancer.',
    diet: 'Huge underground tubers (which they eat from the inside out)',
    conservationStatus: 'Least Concern',
    iconType: 'mole-rat',
  },
  {
    id: 'sphynx-cat',
    commonName: 'Sphynx Cat',
    scientificName: 'Felis catus (mutation)',
    category: 'Domestic Feline',
    hairStatus: 'Microscopic peach fuzz; feels like warm suede or a fresh chamois',
    evolutionaryReason: 'A natural spontaneous genetic mutation in Toronto (1966) in the KRT71 keratin gene, later selectively bred.',
    quirk: 'Their skin produces normal feline oils, but with no fur to absorb it, they need regular warm sponge baths or they leave grease spots on velvet furniture.',
    superpower: 'Their resting body temperature runs ~4°F (2.2°C) warmer than furry cats to offset rapid convective heat loss.',
    diet: 'High-calorie carnivore diet (they eat ~25% more to stay warm!)',
    conservationStatus: 'Domesticated',
    iconType: 'cat',
  },
  {
    id: 'xoloitzcuintli',
    commonName: 'Xoloitzcuintli (Mexican Hairless Dog)',
    scientificName: 'Canis lupus familiaris',
    category: 'Ancient Domestic Canine',
    hairStatus: 'Hairless body with optional tiny mohawk tuft on the crown',
    evolutionaryReason: 'Ancient natural mutation in the FOXI3 gene, cherished for over 3,000 years across Mesoamerica.',
    quirk: 'Aztecs believed Xolos guided human souls across the river of the underworld (Mictlan) after death, and used their warm bodies as living hot water bottles for arthritis.',
    superpower: 'The same gene controlling their hairlessness also means most Xolos naturally lack premolar teeth.',
    diet: 'Omnivorous canine diet',
    conservationStatus: 'Domesticated',
    iconType: 'dog',
  },
  {
    id: 'bottlenose-dolphin',
    commonName: 'Bottlenose Dolphin',
    scientificName: 'Tursiops truncatus',
    category: 'Cetacean',
    hairStatus: 'Sheds snout whiskers shortly after birth; adult skin is 100% hairless and glassy smooth',
    evolutionaryReason: 'Water is ~800 times denser than air. Hair causes boundary layer turbulence, so dolphins traded fur for laminar skin and thick blubber.',
    quirk: 'Their skin sloughs off and regenerates every 2 hours (up to 9 times faster than human skin) to remain perfectly hydrodynamic.',
    superpower: 'Can swim up to 22 mph (35 km/h) through micro-ridges in the skin that suppress vortex turbulence.',
    diet: 'Fish, squid, and crustaceans',
    conservationStatus: 'Least Concern',
    iconType: 'dolphin',
  },
  {
    id: 'hippopotamus',
    commonName: 'Hippopotamus',
    scientificName: 'Hippopotamus amphibius',
    category: 'Artiodactyl Mammal',
    hairStatus: 'Essentially hairless except for short sensory bristles around mouth and tail tip',
    evolutionaryReason: 'Semi-aquatic lifestyle in tropical waters makes fur unnecessary for warmth and prone to fungal rot.',
    quirk: 'They secrete a reddish-orange fluid called "blood sweat" (hipposudoric acid) which acts as a natural sunscreen, moisturizer, and antibacterial shield.',
    superpower: 'Their dense skin can be up to 2 inches (5 cm) thick, stopping predators and deflecting rival canine bites.',
    diet: 'Herbivore (grazes on up to 80 lbs of grass nightly)',
    conservationStatus: 'Vulnerable',
    iconType: 'hippo',
  },
  {
    id: 'skinny-pig',
    commonName: 'Skinny Pig (Hairless Guinea Pig)',
    scientificName: 'Cavia porcellus',
    category: 'Domestic Rodent',
    hairStatus: 'Completely hairless body with occasional fuzzy snout and paws',
    evolutionaryReason: 'Originated at the Armand Frappier Institute in Montreal (1978) as a spontaneous lab mutation used for dermatological testing.',
    quirk: 'To maintain their core body heat without a coat, their metabolic rate is nearly double that of normal furry guinea pigs.',
    superpower: 'They are extraordinarily popular pets for people with severe allergies to pet dander.',
    diet: 'Hay, vitamin C pellets, fresh bell peppers',
    conservationStatus: 'Domesticated',
    iconType: 'guinea-pig',
  },
  {
    id: 'blue-whale',
    commonName: 'Blue Whale',
    scientificName: 'Balaenoptera musculus',
    category: 'Baleen Whale',
    hairStatus: 'Adults possess only a few dozen tiny sensory hair follicles around the chin and jaws',
    evolutionaryReason: 'At 150+ tons, insulating a massive body in the polar sea requires up to 12 inches of dense blubber, making hair obsolete for thermal retention.',
    quirk: 'Their sparse chin hairs are connected to complex nerve beds, acting like hydrodynamic whiskers to detect krill swarms in total darkness.',
    superpower: 'The largest animal to ever live on Earth, pumping 220 liters of blood per heartbeat.',
    diet: 'Krill (up to 4 tons per day)',
    conservationStatus: 'Endangered',
    iconType: 'whale',
  },
  {
    id: 'axolotl',
    commonName: 'Axolotl',
    scientificName: 'Ambystoma mexicanum',
    category: 'Amphibian',
    hairStatus: '100% hairless (amphibians never evolved mammalian hair follicles)',
    evolutionaryReason: 'Skin must remain moist and permeable for cutaneous respiration (absorbing oxygen directly through the skin surface).',
    quirk: 'They exhibit neoteny—retaining their larval aquatic form with feathery external gills throughout their entire adult life without undergoing metamorphosis.',
    superpower: 'Can regrow entire amputated limbs, spine sections, ovaries, and even parts of their brain without scarring.',
    diet: 'Worms, small crustaceans, and feeder fish',
    conservationStatus: 'Critically Endangered (in the wild, Lake Xochimilco)',
    iconType: 'axolotl',
  },
  {
    id: 'african-elephant',
    commonName: 'African Bush Elephant',
    scientificName: 'Loxodonta africana',
    category: 'Proboscidean',
    hairStatus: 'Sparse, bristly hair (~0.5 hairs per square centimeter)',
    evolutionaryReason: 'Counter-intuitively, physics shows sparse hair on massive animals acts like cooling pin-fins, dissipating heat rather than trapping it!',
    quirk: 'An elephant will spray mud and dust across its wrinkly skin to form an insulating crust against scorching UV radiation and biting tsetse flies.',
    superpower: 'Their trunk contains over 40,000 individual muscle fascicles and can lift over 700 pounds.',
    diet: 'Roots, grasses, fruit, and bark (up to 300 lbs daily)',
    conservationStatus: 'Endangered',
    iconType: 'elephant',
  },
  {
    id: 'babirusa',
    commonName: 'North Sulawesi Babirusa',
    scientificName: 'Babyrousa celebensis',
    category: 'Suidae (Wild Pig)',
    hairStatus: 'Nearly hairless, wrinkled gray-brown hide',
    evolutionaryReason: 'Warm, humid Indonesian rainforest wallows make dense fur a breeding ground for parasites.',
    quirk: 'Males grow dramatic upper tusks that pierce directly through the flesh of their upper snout and curve backwards towards their forehead.',
    superpower: 'Exceptional swimmers capable of paddling between Indonesian offshore islands.',
    diet: 'Foliage, fallen fruits, nuts, and fungi',
    conservationStatus: 'Vulnerable',
    iconType: 'babirusa',
  },
  {
    id: 'leatherback-turtle',
    commonName: 'Leatherback Sea Turtle',
    scientificName: 'Dermochelys coriacea',
    category: 'Marine Reptile',
    hairStatus: 'Completely hairless, covered in tough, rubbery, oil-saturated skin',
    evolutionaryReason: 'Reptilian lineage with no hair genes; evolved a flexible hydrodynamic leathery carapace instead of rigid bony scutes.',
    quirk: 'Their esophagus is lined with hundreds of sharp, backward-pointing fleshy spines (papillae) that prevent slippery jellyfish from escaping.',
    superpower: 'Can dive over 4,000 feet (1,200 meters) deep and survive freezing temperatures via counter-current blood heat exchange.',
    diet: 'Exclusively gelatinous zooplankton (jellyfish)',
    conservationStatus: 'Vulnerable',
    iconType: 'turtle',
  },
  {
    id: 'naked-neck-chicken',
    commonName: 'Naked Neck Chicken (Turken)',
    scientificName: 'Gallus gallus domesticus',
    category: 'Domestic Avian',
    hairStatus: 'Neck and vent completely bare of feathers and down',
    evolutionaryReason: 'Caused by an overproduction of the feather-inhibiting protein BMP12 from an ancient Transylvanian chromosomal mutation.',
    quirk: 'In hot climates, their exposed bare red necks shed body heat dramatically faster than fully feathered poultry.',
    superpower: 'Requires significantly less protein to grow plumage, making them highly resilient egg-layers in drought regions.',
    diet: 'Grains, seeds, insects',
    conservationStatus: 'Domesticated',
    iconType: 'chicken',
  },
];

export const TRIVIA_QUESTIONS: TriviaQuestion[] = [
  // GROUND FLOOR (EASY / FUN INTRO)
  {
    id: 'q-sphynx-origin',
    question: 'Despite their ancient Egyptian name, where did the modern Sphynx cat breed actually originate?',
    options: ['Cairo, Egypt', 'Toronto, Canada', 'Athens, Greece', 'Reykjavik, Iceland'],
    correctIndex: 1,
    explanation: 'The modern Sphynx breed began in 1966 in Toronto, Ontario, when a black and white domestic cat named Elizabeth gave birth to a hairless kitten named Prune!',
    category: 'Mammals',
    difficulty: 'Ground Floor',
    animalFocus: 'Sphynx Cat',
  },
  {
    id: 'q-hippo-sunscreen',
    question: 'What colorful substance does a hippopotamus naturally secrete to protect its nearly hairless skin from the scorching sun?',
    options: ['"Blood sweat" (hipposudoric acid)', 'Neon green slime', 'Blue mineral chalk', 'Sticky amber wax'],
    correctIndex: 0,
    explanation: 'Hippos secrete a reddish-pink oily fluid often called "blood sweat." It is not blood at all, but hipposudoric acid, a potent natural sunscreen and antiseptic!',
    category: 'Mammals',
    difficulty: 'Ground Floor',
    animalFocus: 'Hippopotamus',
  },
  {
    id: 'q-dolphin-hair',
    question: 'Do dolphins have hair at any point in their life cycle?',
    options: [
      'No, dolphins never produce hair at any stage',
      'Yes, newborn calves have whiskers on their snout that soon fall out',
      'Yes, their fins have microscopic fur coats',
      'Only male dolphins grow facial hair during mating season'
    ],
    correctIndex: 1,
    explanation: 'Dolphin fetuses and newborn calves are born with a few whisker-like hairs on their rostrum (snout) which fall out shortly after birth, leaving small sensory pits.',
    category: 'Marine',
    difficulty: 'Ground Floor',
    animalFocus: 'Bottlenose Dolphin',
  },
  {
    id: 'q-mole-rat-queen',
    question: 'The Naked Mole-Rat lives in a social structure like bees and ants, which is called:',
    options: ['Eusociality', 'Solitary matriarchy', 'Nomadic fission', 'Bioluminescent herd'],
    correctIndex: 0,
    explanation: 'Naked mole-rats are one of the only known eusocial mammals! A single queen and one to three fertile males produce all offspring, while sterile workers dig tunnels.',
    category: 'Mammals',
    difficulty: 'Ground Floor',
    animalFocus: 'Naked Mole-Rat',
  },
  {
    id: 'q-amphibian-fur',
    question: 'Which of the following animals is naturally 100% hairless because of its biological class?',
    options: ['Poison Dart Frog', 'Grizzly Bear', 'Red Fox', 'Beaver'],
    correctIndex: 0,
    explanation: 'Amphibians (like frogs, toads, and salamanders) never evolved mammalian hair follicles. Their skin must remain bare and moist to breathe and absorb water!',
    category: 'Amphibians & Reptiles',
    difficulty: 'Ground Floor',
    animalFocus: 'Poison Dart Frog',
  },
  {
    id: 'q-xolo-aztec',
    question: 'The Mexican Hairless Dog (Xoloitzcuintli) was revered by the Aztecs primarily because they believed it would:',
    options: [
      'Guide human souls across the river to the Underworld (Mictlan)',
      'Frighten away rainstorms',
      'Hunt jaguars in dense jungles',
      'Predict volcanic eruptions'
    ],
    correctIndex: 0,
    explanation: 'The name Xoloitzcuintli combines "Xolotl" (god of fire and lightning) and "itzcuintli" (dog). Aztecs believed Xolos guarded the deceased on their journey through the 9 levels of Mictlan.',
    category: 'Mammals',
    difficulty: 'Ground Floor',
    animalFocus: 'Xoloitzcuintli',
  },
  {
    id: 'q-skinny-pig-warmth',
    question: 'Why do pet owners of hairless "Skinny Pigs" (guinea pigs) find themselves buying extra food?',
    options: [
      'Skinny pigs burn nearly double the calories to stay warm without fur',
      'They hide food underground like squirrels',
      'Their lack of hair makes them constantly think they are hungry',
      'They have two stomachs like cows'
    ],
    correctIndex: 0,
    explanation: 'Without insulating fur, hairless guinea pigs lose body heat rapidly and must maintain a substantially higher metabolic rate, eating roughly twice the calories of normal guinea pigs!',
    category: 'Mammals',
    difficulty: 'Ground Floor',
    animalFocus: 'Skinny Pig',
  },
  {
    id: 'q-pangolin-scales',
    question: 'Pangolins look armored and hairless, but what are their protective scales actually made of?',
    options: ['Keratin (the exact same protein as hair and fingernails)', 'Bone and calcium carbonate', 'Chitin (like insect carapaces)', 'Hardened silica crystals'],
    correctIndex: 0,
    explanation: 'Pangolin scales are made of keratin—the same structural protein that forms mammalian hair, horns, claws, and human fingernails!',
    category: 'Evolution',
    difficulty: 'Ground Floor',
    animalFocus: 'Pangolin',
  },

  // MEZZANINE (INTERMEDIATE BIOLOGY & QUIRKY ADAPTATIONS)
  {
    id: 'q-mole-rat-oxygen',
    question: 'Underground tunnels can run out of oxygen. For how long can a Naked Mole-Rat survive in a 0% oxygen environment without brain damage?',
    options: ['Around 18 minutes', 'Only 30 seconds', 'Up to 48 hours', 'Exactly 4 minutes'],
    correctIndex: 0,
    explanation: 'Naked mole-rats can survive 18 minutes of complete anoxia (0% oxygen) by switching their brain metabolism from glucose to fructose, a biochemical trick normally found only in plants!',
    category: 'Weird Science',
    difficulty: 'Mezzanine',
    animalFocus: 'Naked Mole-Rat',
  },
  {
    id: 'q-sphynx-bath',
    question: 'Why do Sphynx cats require weekly warm baths, unlike regular furry cats?',
    options: [
      'Skin oils accumulate on the skin instead of being wicked away by fur',
      'They naturally attract magnetic metal dust',
      'Water helps them grow miniature scales',
      'Their skin absorbs water to hydrate without drinking'
    ],
    correctIndex: 0,
    explanation: 'Cats naturally produce sebum (skin oil). In furry cats, grooming distributes this oil along hairs. In hairless cats, sebum pools on the skin surface and will soil blankets and upholstery if not bathed!',
    category: 'Mammals',
    difficulty: 'Mezzanine',
    animalFocus: 'Sphynx Cat',
  },
  {
    id: 'q-elephant-hair-physics',
    question: 'Princeton researchers discovered a surprising physical function for the sparse, bristly hairs on an elephant. What is it?',
    options: [
      'They act as thermal cooling pin-fins that radiate heat away from the body',
      'They amplify seismic ground vibrations from approaching herds',
      'They deter tick bites through electrostatic repulsion',
      'They collect morning dew for drinking'
    ],
    correctIndex: 0,
    explanation: 'Physics simulations proved that low-density hair (<100 hairs/cm²) increases effective convective heat dissipation by up to 23%, acting like cooling pin-fins on a computer radiator!',
    category: 'Evolution',
    difficulty: 'Mezzanine',
    animalFocus: 'African Elephant',
  },
  {
    id: 'q-xolo-teeth',
    question: 'What dental quirk is genetically linked to hairlessness in Mexican Hairless Dogs and Chinese Crested dogs?',
    options: [
      'Missing premolars and sometimes canine teeth (hypodontia)',
      'Sharp triple-pointed venom fangs',
      'Continuously growing rodent-like incisors',
      'No molars whatsoever, only gums'
    ],
    correctIndex: 0,
    explanation: 'The FOXI3 transcription factor gene controls both hair follicle development and tooth bud development (ectodermal dysplasia). As a result, hairless dogs almost always lack premolars!',
    category: 'Mammals',
    difficulty: 'Mezzanine',
    animalFocus: 'Xoloitzcuintli',
  },
  {
    id: 'q-mole-rat-pain',
    question: 'Naked mole-rats are famously oblivious to what type of physical sensation that would torture other mammals?',
    options: [
      'Acid burns and chili pepper chemical burning (capsaicin)',
      'Freezing water ice baths',
      'Electromagnetic field shocks',
      'High-frequency ultrasonic whistles'
    ],
    correctIndex: 0,
    explanation: 'Naked mole-rats lack the neuropeptide Substance P in cutaneous nerve fibers. Dropping acid on their skin or applying pure chili extract causes zero behavioral pain response!',
    category: 'Weird Science',
    difficulty: 'Mezzanine',
    animalFocus: 'Naked Mole-Rat',
  },
  {
    id: 'q-whale-blubber',
    question: 'Whales replaced fur insulation with blubber. How thick can the blubber layer get on a Bowhead or Blue Whale?',
    options: ['Up to 12 to 20 inches (30 to 50 cm)', 'Never more than 2 inches', 'Around 5 feet', 'Exactly 0.5 inches'],
    correctIndex: 0,
    explanation: 'Bowhead whales hold the record with blubber up to 20 inches (50 cm) thick! This vascularized adipose blanket retains core body heat even in sub-zero Arctic seas.',
    category: 'Marine',
    difficulty: 'Mezzanine',
    animalFocus: 'Blue Whale',
  },
  {
    id: 'q-babirusa-tusks',
    question: 'The nearly hairless Babirusa (deer-pig) of Sulawesi has extraordinary upper tusks that grow in which bizarre manner?',
    options: [
      'They curve upward and pierce right through the top of its snout skin',
      'They spiral outward horizontally like airplane wings',
      'They drop down from inside its ear canal',
      'They point straight backwards into its own throat'
    ],
    correctIndex: 0,
    explanation: 'In male babirusas, the upper canines do not grow into the mouth; instead, they grow vertically upward, puncturing through the snout skin and curving back toward the eyes!',
    category: 'Mammals',
    difficulty: 'Mezzanine',
    animalFocus: 'Babirusa',
  },
  {
    id: 'q-axolotl-regeneration',
    question: 'The hairless Axolotl is celebrated in regenerative medicine because it can regrow:',
    options: [
      'Full limbs, heart muscle, spinal cord segments, and parts of its brain',
      'Only its tail fin',
      'Only its outer gills',
      'Only damaged claw tips'
    ],
    correctIndex: 0,
    explanation: 'Axolotls can regenerate completely functional limbs, lungs, retinas, heart ventricles, spinal cords, and brain tissue without forming scar tissue!',
    category: 'Amphibians & Reptiles',
    difficulty: 'Mezzanine',
    animalFocus: 'Axolotl',
  },
  {
    id: 'q-beluga-skin',
    question: 'Beluga whales are famous for being smooth and hairless. During summer, they enter shallow river estuaries to perform what skin ritual?',
    options: [
      'Rubbing against gravel riverbeds to molt their yellowish outer skin layer',
      'Soaking in mineral brine to grow temporary barnacles',
      'Bleaching their skin with river moss',
      'Absorbing freshwater salt to harden their skull melon'
    ],
    correctIndex: 0,
    explanation: 'Belugas undergo an annual seasonal molt! They visit warm river deltas to rub against coarse gravel and pebble shoals, sloughing off dead, yellowed skin to reveal brilliant white fresh skin.',
    category: 'Marine',
    difficulty: 'Mezzanine',
    animalFocus: 'Beluga Whale',
  },
  {
    id: 'q-leatherback-shell',
    question: 'Unlike all other sea turtles with hard keratin plates, what does a Leatherback Turtle have on its back?',
    options: [
      'A flexible, rubbery skin embedded with thousands of tiny bone plates',
      'An exposed hollow ribcage with no covering',
      'A soft downy coat of microscopic hairs',
      'A single solid chunk of hollow marble'
    ],
    correctIndex: 0,
    explanation: 'Leatherbacks lack a rigid bony shell (scutes). Instead, their carapace is covered by leathery, oil-saturated rubbery skin supported by a mosaic of thousands of tiny polygonal osteoderms.',
    category: 'Amphibians & Reptiles',
    difficulty: 'Mezzanine',
    animalFocus: 'Leatherback Sea Turtle',
  },

  // PENTHOUSE (HIGH-LEVEL TAXONOMY, EVOLUTION & OBSCURITIES)
  {
    id: 'q-mole-rat-cancer',
    question: 'Naked mole-rats can live over 30 years and almost never develop malignant tumors. What unique molecule in their skin tissue triggers this "early contact inhibition"?',
    options: [
      'High-molecular-mass Hyaluronan (HMM-HA)',
      'Chlorophyll-B polymers',
      'Crystalline chitinase',
      'Bovine serum albumin'
    ],
    correctIndex: 0,
    explanation: 'University of Rochester researchers discovered naked mole-rat tissues secrete very dense high-molecular-mass hyaluronan (HMM-HA), which makes cells arrest division whenever crowded!',
    category: 'Weird Science',
    difficulty: 'Penthouse',
    animalFocus: 'Naked Mole-Rat',
  },
  {
    id: 'q-walrus-whiskers',
    question: 'While an adult walrus has virtually hairless, wrinkled skin across its body, its mustache contains around 400 to 700 sensory bristles called:',
    options: ['Vibrissae (mystacial pads)', 'Osteoderms', 'Trichomes', 'Papillae'],
    correctIndex: 0,
    explanation: 'A walrus possesses up to 700 stiff, quill-like vibrissae attached to individual muscle packets and dense blood supplies, letting it detect tiny clams buried in murky sea sediment.',
    category: 'Marine',
    difficulty: 'Penthouse',
    animalFocus: 'Walrus',
  },
  {
    id: 'q-manatee-touch',
    question: 'The hairless-looking West Indian Manatee has sparse, specialized sensory hairs scattered across its entire body that function essentially like:',
    options: [
      'A fish\'s lateral line system to detect water current and pressure changes',
      'Miniature solar collectors that generate body electricity',
      'Parasite traps that squirt digestive enzymes',
      'Antennas that detect submarine radio frequencies'
    ],
    correctIndex: 0,
    explanation: 'Each hair on a manatee\'s body is a tactile sinus hair connected to 20-50 nerve fibers, creating a three-dimensional sensory array analogous to a fish\'s lateral line!',
    category: 'Marine',
    difficulty: 'Penthouse',
    animalFocus: 'West Indian Manatee',
  },
  {
    id: 'q-sphynx-krt71',
    question: 'The hairless trait in the Canadian Sphynx cat is caused by a recessive mutation in which specific gene?',
    options: ['KRT71 (Keratin 71)', 'MC1R (Melanocortin)', 'FOXI3 (Forkhead Box)', 'PAX6 (Ocular Homeobox)'],
    correctIndex: 0,
    explanation: 'The Sphynx mutation affects KRT71, causing defective keratinization in hair follicles. The Devon Rex cat shares mutations in the same gene, producing wavy curls!',
    category: 'Evolution',
    difficulty: 'Penthouse',
    animalFocus: 'Sphynx Cat',
  },
  {
    id: 'q-pterobranchs-hair',
    question: 'Which of the following mammal groups is the ONLY one to have evolved complete hairlessness purely in response to hyper-streamlining in an aquatic environment?',
    options: ['Cetaceans (Whales & Dolphins)', 'Pinnipeds (Seals & Sea Lions)', 'Loricata (Crocodiles)', 'Sirenia (Dugongs)'],
    correctIndex: 0,
    explanation: 'Cetaceans completely surrendered adult body fur for hydrodynamics. Seals and sea lions still retain dense waterproof fur, and Sirenians retain thousands of tactile sensory hairs.',
    category: 'Evolution',
    difficulty: 'Penthouse',
    animalFocus: 'Cetaceans',
  },
  {
    id: 'q-chicken-naked-neck',
    question: 'In the Naked Neck chicken breed (Turken), what genetic mechanism causes the absence of feathers along the neck?',
    options: [
      'Over-expression of the BMP12 (Bone Morphogenetic Protein 12) gene',
      'Deficiency of avian testosterone',
      'A symbiotic virus that dissolves feather quills',
      'Maternal incubation temperature exceeding 105°F'
    ],
    correctIndex: 0,
    explanation: 'A chromosomal inversion places a DNA regulatory block next to BMP12, causing its over-expression and shutting off feather follicle buds strictly around the neck!',
    category: 'Evolution',
    difficulty: 'Penthouse',
    animalFocus: 'Naked Neck Chicken',
  },
  {
    id: 'q-thermoregulation-loss',
    question: 'Biologists theorize that humans lost most of their dense body hair primarily to facilitate:',
    options: [
      'Whole-body eccrine sweating for endurance running in open savannahs',
      'Preventing hair from catching fire near early campfires',
      'Swimming across prehistoric oceans (aquatic ape theory)',
      'Escaping predatory eagles that grabbed hair'
    ],
    correctIndex: 0,
    explanation: 'The dominant evolutionary theory is that shedding dense fur allowed millions of eccrine sweat glands to cool the body efficiently via evaporative sweating during long endurance hunts in midday heat.',
    category: 'Evolution',
    difficulty: 'Penthouse',
    animalFocus: 'Homo sapiens',
  },
  {
    id: 'q-leatherback-papillae',
    question: 'Inside the mouth and esophagus of the hairless Leatherback Sea Turtle are hundreds of scary-looking spikes. What are they made of?',
    options: [
      'Keratinous papillae designed to trap soft jellyfish and expel seawater',
      'Calcite enamel teeth like sharks',
      'Hardened bone spurs from the jawbone',
      'Calcified venom needles'
    ],
    correctIndex: 0,
    explanation: 'Leatherback sea turtles have esophagi lined with conical, downward-pointing keratin papillae. When the turtle vomits out excess seawater, jellyfish stay trapped inside!',
    category: 'Amphibians & Reptiles',
    difficulty: 'Penthouse',
    animalFocus: 'Leatherback Sea Turtle',
  },
];
