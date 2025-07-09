
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Star, Rocket, Zap } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const knowledgeBase = {
  // Solar System - Comprehensive
  "what is the sun": "The Sun is a G-type main-sequence star at the center of our solar system. It's a massive ball of hot plasma held together by gravity, with a core temperature of about 15 million degrees Celsius. The Sun generates energy through nuclear fusion, converting 600 million tons of hydrogen into helium every second, releasing the energy equivalent of 100 billion nuclear bombs per second. It contains 99.86% of the solar system's mass and could fit 1.3 million Earths inside it.",
  "how many planets": "There are 8 planets in our solar system: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Pluto was reclassified as a dwarf planet in 2006 by the International Astronomical Union because it doesn't meet all three criteria for a planet: it must orbit the Sun, have sufficient mass to be roughly round, and clear its orbital neighborhood.",
  "solar system formation": "Our solar system formed about 4.6 billion years ago from the gravitational collapse of a giant molecular cloud. The Sun formed at the center, while planets formed from the accretion of dust and gas in the surrounding protoplanetary disk. Inner planets are rocky due to high temperatures, while outer planets are gas/ice giants because volatiles could condense in the cooler outer regions.",
  "mercury facts": "Mercury is the smallest planet and closest to the Sun. It has extreme temperature variations (427°C day, -173°C night), no atmosphere, and takes 88 Earth days to orbit the Sun. One day on Mercury lasts 59 Earth days due to its slow rotation.",
  "venus facts": "Venus is the hottest planet with surface temperatures of 462°C due to its thick carbon dioxide atmosphere creating a runaway greenhouse effect. It rotates backwards (retrograde) and has the longest day of any planet - 243 Earth days.",
  "earth facts": "Earth is the only known planet with life. It's 71% water-covered, has one moon that stabilizes its rotation, and sits in the 'Goldilocks zone' - the perfect distance from the Sun for liquid water to exist.",
  "mars facts": "Mars is called the Red Planet due to iron oxide (rust) on its surface. It has two small moons (Phobos and Deimos), the largest volcano in the solar system (Olympus Mons), and evidence of ancient water flows. A day on Mars is 24.6 hours.",
  "jupiter facts": "Jupiter is the largest planet, containing more mass than all other planets combined. It has 95 known moons including the four Galilean moons. Its Great Red Spot is a storm larger than Earth that's been raging for centuries.",
  "saturn facts": "Saturn is famous for its prominent ring system made of ice and rock particles. It's less dense than water and has 146 known moons, including Titan which has lakes of liquid methane.",
  "uranus facts": "Uranus rotates on its side (98° tilt) likely due to an ancient collision. It's an ice giant with 27 moons and was the first planet discovered with a telescope in 1781 by William Herschel.",
  "neptune facts": "Neptune is the windiest planet with speeds up to 2,100 km/h. It was discovered mathematically before being observed, and takes 165 Earth years to orbit the Sun.",

  // Space Phenomena
  "what is a black hole": "A black hole is a region of spacetime where gravity is so strong that nothing, not even light, can escape once it crosses the event horizon. They form when massive stars (over 20-25 solar masses) collapse at the end of their lives. The closest known black hole to Earth is Sagittarius A* at the center of our galaxy.",
  "what are neutron stars": "Neutron stars are incredibly dense remnants of massive stars that exploded in supernovas. They're only about 20 km across but contain more mass than our Sun. A teaspoon of neutron star material would weigh about 6 billion tons on Earth.",
  "what are pulsars": "Pulsars are rapidly rotating neutron stars that emit beams of radiation from their magnetic poles. As they spin, these beams sweep across space like lighthouse beams, creating regular pulses we can detect on Earth.",
  "what are quasars": "Quasars are extremely luminous active galactic nuclei powered by supermassive black holes. They're among the most distant and brightest objects in the universe, some shining with the light of trillions of stars.",
  "what are supernovas": "Supernovas are explosive deaths of massive stars, releasing more energy in seconds than our Sun will produce in its entire 10-billion-year lifetime. They create and scatter heavy elements throughout the universe, making life possible.",
  "gamma ray bursts": "Gamma-ray bursts are the most energetic explosions in the universe since the Big Bang. They can release more energy in 10 seconds than the Sun will in its entire lifetime, and can be seen from billions of light-years away.",

  // Cosmology and Universe
  "how big is the universe": "The observable universe is about 93 billion light-years in diameter. However, the entire universe might be infinite. We can only see a portion of it due to the finite speed of light and the age of the universe (13.8 billion years).",
  "what is dark matter": "Dark matter is a mysterious form of matter that makes up about 27% of the universe. It doesn't emit, absorb, or reflect light, making it invisible. We know it exists because of its gravitational effects on visible matter and galaxy formation.",
  "what is dark energy": "Dark energy makes up about 68% of the universe and is causing the expansion of the universe to accelerate. Its nature is one of the biggest mysteries in cosmology.",
  "big bang theory": "The Big Bang theory describes how the universe expanded from an initial state of high density and temperature about 13.8 billion years ago. It's supported by evidence like cosmic microwave background radiation and the abundance of light elements.",
  "how old is the universe": "The universe is approximately 13.8 billion years old, as determined by observations of the cosmic microwave background radiation and other astronomical measurements using the Planck satellite.",
  "what is cosmic microwave background": "The cosmic microwave background (CMB) is the afterglow of the Big Bang, filling the entire universe. It's the oldest light in the universe, released when the universe became transparent about 380,000 years after the Big Bang.",

  // Stars and Stellar Evolution
  "how are stars born": "Stars form in nebulae when gravity causes clouds of gas and dust to collapse. As the material contracts, it heats up until nuclear fusion begins in the core, marking the birth of a new star.",
  "stellar evolution": "Stars evolve based on their mass. Low-mass stars like our Sun become red giants then white dwarfs. Massive stars become supergiants, explode as supernovas, and leave behind neutron stars or black holes.",
  "what are red giants": "Red giants are evolved stars that have exhausted hydrogen in their cores and expanded dramatically. Our Sun will become a red giant in about 5 billion years, growing large enough to potentially engulf Earth.",
  "what are white dwarfs": "White dwarfs are the hot, dense cores left behind when low to medium-mass stars shed their outer layers. They're about the size of Earth but contain about half the mass of the Sun.",
  "brown dwarfs": "Brown dwarfs are 'failed stars' - objects too small to sustain nuclear fusion. They're larger than planets but smaller than stars, glowing dimly from leftover heat from their formation.",

  // Extended Knowledge Base - Comprehensive Space Topics
  "alien life": "While we haven't found definitive proof of extraterrestrial life, scientists search using the Drake Equation and look for biosignatures on exoplanets. The discovery of extremophiles on Earth suggests life could exist in harsh conditions elsewhere.",
  "exoplanets": "Over 5,500 confirmed exoplanets have been discovered. Notable ones include Proxima Centauri b (closest to Earth), Kepler-452b ('Earth's cousin'), and TRAPPIST-1 system with 7 Earth-sized planets.",
  "space exploration history": "Space exploration began with Sputnik 1 (1957), followed by Yuri Gagarin's first human spaceflight (1961), Apollo 11 moon landing (1969), Voyager missions (1977), Hubble Space Telescope (1990), and ongoing Mars exploration.",
  "international space station": "The ISS orbits Earth at ~408km altitude, traveling at 28,000 km/h. It's been continuously occupied since 2000 and serves as a research laboratory for microgravity experiments and space technology development.",
  "space telescopes": "Major space telescopes include Hubble (visible/UV light), Spitzer (infrared, now retired), Kepler/TESS (planet hunting), and James Webb Space Telescope (infrared, most powerful ever built).",
  "mars exploration": "Mars has been explored by numerous missions: Viking landers (1976), Mars Pathfinder (1997), Spirit/Opportunity rovers, Curiosity (2012), Perseverance (2021), and Ingenuity helicopter.",
  "asteroid belt location": "The asteroid belt lies between Mars and Jupiter, containing millions of rocky objects. Ceres is the largest object in the belt and is classified as a dwarf planet.",
  "kuiper belt": "The Kuiper Belt extends from Neptune's orbit (30 AU) to about 50 AU from the Sun. It contains icy bodies including Pluto, Eris, Makemake, and Haumea, plus countless smaller objects.",
  "oort cloud": "The Oort Cloud is a spherical shell of icy objects surrounding our solar system at distances of 2,000-100,000 AU. It's the source of long-period comets.",
  "comets": "Comets are 'dirty snowballs' of ice and dust from the outer solar system. Famous ones include Halley's Comet (76-year orbit), Hale-Bopp, and NEOWISE.",
  "meteorites": "Meteorites are space rocks that survive atmospheric entry. Types include stony meteorites (most common), iron meteorites (metal-rich), and stony-iron meteorites (mixed composition).",
  "space weather": "Space weather includes solar flares, coronal mass ejections, and solar wind that can affect satellites, power grids, and create auroras. Solar activity follows an 11-year cycle.",
  "gravity waves": "Gravitational waves are ripples in spacetime caused by accelerating massive objects like merging black holes or neutron stars. First detected by LIGO in 2015.",
  "multiverse theory": "The multiverse hypothesis suggests our universe might be one of many. Types include bubble universes from eternal inflation and many-worlds interpretation of quantum mechanics.",
  "time dilation": "Time dilation occurs due to high speeds (special relativity) or strong gravity (general relativity). Astronauts on the ISS age slightly slower than people on Earth.",
  "wormholes": "Wormholes are theoretical 'shortcuts' through spacetime that could connect distant regions of the universe. They remain speculative and would likely be unstable.",
  "space mining": "Space mining involves extracting resources from asteroids, the Moon, or other celestial bodies. Potential targets include water ice, rare metals, and helium-3.",
  "space colonization": "Space colonization proposals include Mars settlements, lunar bases, and orbital habitats. Challenges include radiation, life support, psychological factors, and resource utilization.",

  // Galaxies
  "what is the milky way": "The Milky Way is our home galaxy, containing over 100 billion stars. It's a barred spiral galaxy about 100,000 light-years across. Our solar system is located about 26,000 light-years from the galactic center in the Orion Arm.",
  "types of galaxies": "There are three main types of galaxies: spiral (like the Milky Way), elliptical (oval-shaped), and irregular (no defined shape). Galaxies can contain anywhere from millions to trillions of stars.",
  "andromeda galaxy": "The Andromeda Galaxy (M31) is the nearest major galaxy to the Milky Way, located about 2.5 million light-years away. It's approaching us and will collide with the Milky Way in about 4.5 billion years.",
  "galaxy clusters": "Galaxy clusters are the largest gravitationally bound structures in the universe, containing hundreds to thousands of galaxies held together by dark matter and hot gas.",

  // Space Exploration
  "apollo missions": "The Apollo program successfully landed 12 astronauts on the Moon between 1969-1972. Apollo 11 achieved the first Moon landing on July 20, 1969, with Neil Armstrong and Buzz Aldrin walking on the lunar surface.",
  "iss details": "The ISS is a habitable artificial satellite in low Earth orbit. It's been continuously occupied since 2000 and serves as a laboratory for scientific research in microgravity.",
  "mars rover missions": "Mars has been explored by numerous missions including rovers like Curiosity, Perseverance, and Opportunity. These missions have found evidence of ancient water activity and are searching for signs of past or present life.",
  "voyager missions": "Voyager 1 and 2, launched in 1977, have provided incredible images and data about the outer solar system. Voyager 1 is now in interstellar space, making it humanity's most distant spacecraft.",
  "james webb telescope": "The James Webb Space Telescope is the most powerful space telescope ever built, designed to observe the universe in infrared light. It can see the first galaxies formed after the Big Bang.",
  "hubble telescope": "The Hubble Space Telescope has been operating since 1990, providing stunning images and crucial data about the universe. It has helped determine the age of the universe and the existence of dark energy.",

  // Physics and Space
  "how do rockets work": "Rockets work on Newton's third law: for every action, there's an equal and opposite reaction. They burn fuel to create hot gases that are expelled downward, which pushes the rocket upward. They carry their own oxygen supply to work in the vacuum of space.",
  "what is gravity": "Gravity is a fundamental force that attracts objects with mass toward each other. According to Einstein's theory of general relativity, massive objects actually curve spacetime, and this curvature is what we experience as gravity.",
  "speed of light": "Light travels at 299,792,458 meters per second in vacuum. Nothing with mass can travel faster than light, and this speed limit has profound implications for space travel and communication across cosmic distances.",
  "escape velocity": "Escape velocity is the minimum speed needed to escape a celestial body's gravitational pull. For Earth, it's about 11.2 km/s (25,000 mph). This is why rockets need to be so powerful.",
  "orbital mechanics": "Objects orbit when they're moving fast enough horizontally that they continuously fall around a larger body. The International Space Station, for example, is constantly falling toward Earth but moving so fast it keeps missing.",

  // Astrobiology
  "search for life": "Scientists search for extraterrestrial life through projects like SETI (Search for Extraterrestrial Intelligence), studying extremophiles on Earth, and looking for biosignatures on exoplanets.",
  "habitable zone": "The habitable zone, or 'Goldilocks zone,' is the region around a star where liquid water could exist on a planet's surface. It's not too hot, not too cold, but just right for life as we know it.",
  "planet hunting": "Exoplanets are planets orbiting stars other than our Sun. Over 5,000 have been confirmed, with many potentially habitable worlds discovered by missions like Kepler and TESS.",
  "extremophiles": "Extremophiles are organisms that thrive in extreme conditions (high temperature, radiation, acidity). They show that life might exist in places previously thought uninhabitable, like Mars or Jupiter's moons.",

  // Time and Space
  "light year": "A light-year is the distance light travels in one year - about 9.46 trillion kilometers or 5.88 trillion miles. It's used to measure vast distances in space.",
  "parsec": "A parsec is about 3.26 light-years, used by astronomers to measure stellar distances. The nearest star, Proxima Centauri, is about 1.3 parsecs away.",
  "redshift": "Redshift occurs when light from distant objects is stretched to longer, redder wavelengths due to the expansion of the universe. It helps us measure how far away and how fast objects are moving.",
  "doppler effect": "The Doppler effect causes the frequency of waves to change when the source is moving relative to the observer. It's how we detect if stars are moving toward or away from us.",

  // Space Weather and Phenomena
  "solar wind": "Solar wind is a stream of charged particles flowing from the Sun at speeds of 300-800 km/s. It interacts with Earth's magnetic field to create phenomena like auroras.",
  "solar flares": "Solar flares are intense bursts of radiation from the Sun's surface that can disrupt satellite communications and power grids on Earth. They're caused by magnetic field reconnection.",
  "coronal mass ejections": "CMEs are huge bubbles of magnetic field and plasma ejected from the Sun's corona. When they hit Earth, they can cause geomagnetic storms and beautiful auroras.",
  "auroras": "Auroras (Northern and Southern Lights) occur when solar wind particles interact with Earth's magnetic field and atmosphere, creating colorful displays of light near the poles.",

  // Moons and Satellites
  "earth's moon": "Earth's Moon is the fifth largest moon in the solar system. It's about 384,400 km away and is gradually moving away from Earth at about 3.8 cm per year due to tidal forces.",
  "europa": "Europa, Jupiter's moon, has a subsurface ocean beneath its icy crust that may contain twice as much water as all of Earth's oceans. It's a prime target in the search for extraterrestrial life.",
  "titan": "Titan, Saturn's largest moon, has a thick atmosphere and lakes of liquid methane and ethane. It's the only moon in our solar system with a substantial atmosphere and stable bodies of surface liquid.",
  "enceladus": "Enceladus, one of Saturn's moons, has geysers of water ice erupting from its south pole, indicating a subsurface ocean. It's another promising location to search for life.",

  // Space Technology
  "space elevators": "Space elevators are theoretical structures that could provide access to space using a cable extending from Earth's surface to beyond geostationary orbit, potentially making space travel much cheaper.",
  "ion drives": "Ion drives use electricity to accelerate ions to very high speeds, providing efficient propulsion for long-duration space missions. They produce very little thrust but can operate for years.",
  "nuclear propulsion": "Nuclear propulsion could dramatically reduce travel times to Mars and other planets. Concepts include nuclear thermal rockets and nuclear electric propulsion systems.",
  "generation ships": "Generation ships are hypothetical spacecraft that could support human populations for the centuries-long journeys to other star systems, with multiple generations living and dying aboard.",

  // Recent Discoveries
  "gravitational waves": "Gravitational waves are ripples in spacetime caused by accelerating massive objects, predicted by Einstein and first detected in 2015. They open a new window for studying the universe.",
  "first black hole image": "In 2019, the Event Horizon Telescope captured the first image of a black hole's event horizon in galaxy M87, confirming Einstein's predictions about how black holes bend light.",
  "water on mars": "Recent missions have confirmed that water exists on Mars as ice at the poles and possibly as seasonal brines. Ancient Mars had rivers, lakes, and possibly oceans.",
  "potentially habitable exoplanets": "Thousands of potentially habitable exoplanets have been discovered, including Kepler-452b (Earth's cousin), Proxima Centauri b (closest exoplanet), and many others in their star's habitable zone.",

  // Advanced Physics and Cosmology
  "multiverse hypothesis": "The multiverse hypothesis suggests our universe might be one of many universes. Different types include: the Many Worlds interpretation of quantum mechanics, cosmic inflation creating bubble universes, and mathematical universe hypothesis where every mathematical structure exists as a physical reality.",
  "string theory": "String theory proposes that fundamental particles are tiny vibrating strings rather than point particles. It attempts to unify quantum mechanics and general relativity, predicting extra spatial dimensions beyond our observed three. Different vibration modes of strings correspond to different particles.",
  "quantum mechanics space": "Quantum mechanics reveals that space itself has inherent uncertainty and fluctuations. Virtual particles constantly pop in and out of existence, and quantum entanglement shows that widely separated particles can be instantly connected, challenging our classical understanding of space and locality.",
  "spacetime curvature": "According to Einstein's general relativity, massive objects curve spacetime, and this curvature is what we experience as gravity. The more massive an object, the more it warps spacetime. GPS satellites must account for both special and general relativistic effects to maintain accuracy.",
  "hawking radiation": "Black holes aren't completely black - they emit Hawking radiation due to quantum effects near the event horizon. This causes black holes to slowly evaporate over time. Smaller black holes radiate faster than larger ones, and stellar-mass black holes would take longer than the age of the universe to evaporate.",
  "spacetime tunnels": "Wormholes are theoretical passages through spacetime that could connect distant regions of the universe or even different universes. While mathematically possible in Einstein's equations, they would require exotic matter with negative energy density to remain stable.",

  // Deep Space Objects and Phenomena
  "magnetars": "Magnetars are neutron stars with magnetic fields a trillion times stronger than Earth's. Their magnetic fields are so intense they can strip electrons from atoms and cause starquakes that release more energy in seconds than our Sun produces in years.",
  "strange matter": "Strange matter is a hypothetical form of matter containing strange quarks. If it exists, it might be more stable than normal matter, potentially converting everything it touches into strange matter - a scenario called 'strange matter conversion' or 'ice-nine scenario'.",
  "cosmic strings": "Cosmic strings are hypothetical one-dimensional topological defects in spacetime that might have formed during the early universe's phase transitions. They would be incredibly thin but enormously massive, potentially causing observable gravitational effects.",
  "vacuum decay": "Vacuum decay is a theoretical scenario where our universe's vacuum state might not be the lowest energy state possible. If the Higgs field found a lower energy configuration, it could create a bubble of true vacuum that expands at light speed, fundamentally altering physics.",

  // Space Exploration - Extended
  "space elevator": "A space elevator would be a cable extending from Earth's surface to beyond geostationary orbit, held up by centrifugal force. Materials like carbon nanotubes might make this possible, potentially reducing launch costs to $100/kg compared to current $10,000/kg.",
  "lunar base": "Plans for permanent lunar bases include NASA's Artemis program and private initiatives. The Moon offers advantages like low gravity (1/6th Earth's), no atmosphere for easy launches, and potential resources like water ice at the poles for fuel and life support.",
  "mars terraforming": "Terraforming Mars would involve thickening its atmosphere, warming the planet, and creating breathable air. Proposed methods include releasing greenhouse gases, melting polar ice caps, and importing volatiles from asteroids or comets. This could take thousands of years.",
  "asteroid mining": "Asteroids contain enormous wealth in precious metals and rare earth elements. A single metallic asteroid could contain more platinum than has ever been mined on Earth. Water from asteroids could also fuel deep space missions.",
  "interstellar travel": "Interstellar travel faces enormous challenges due to vast distances. Proposed solutions include fusion ramjets, antimatter drives, solar sails, and generation ships. Even at 10% light speed, reaching Proxima Centauri would take 43 years.",

  // Cosmic Phenomena - Advanced
  "dark flow": "Dark flow is a controversial observation suggesting that galaxy clusters are moving in a particular direction, possibly influenced by structures beyond the observable universe. This could indicate the presence of other universes or large-scale structures we cannot see.",
  "great attractor": "The Great Attractor is a gravitational anomaly in intergalactic space that's pulling our Local Group of galaxies and thousands of others toward it at 600 km/s. It's partially obscured by the Milky Way, making it difficult to study directly.",
  "boötes void": "The Boötes Void, also called the Great Nothing, is an enormous region of space containing very few galaxies. It's about 330 million light-years in diameter and represents a significant challenge to our understanding of cosmic structure formation.",
  "cosmic web": "The cosmic web is the largest-scale structure of the universe, consisting of galaxy filaments separated by vast voids. Dark matter forms the scaffolding of this web, with normal matter following its gravitational pull to form the galaxies we observe.",

  // Astrobiology - Comprehensive
  "fermi paradox": "The Fermi Paradox asks: if the universe should be teeming with life, where is everybody? Proposed solutions include the Great Filter (a step in evolution that's extremely unlikely), self-destruction of civilizations, or that we're among the first intelligent species.",
  "drake equation": "The Drake Equation estimates the number of communicating civilizations in our galaxy by multiplying factors like star formation rate, fraction of stars with planets, fraction with life, etc. Estimates range from 1 (just us) to millions of civilizations.",
  "panspermia": "Panspermia is the hypothesis that life on Earth originated from microorganisms or chemical precursors from outer space, possibly transported by asteroids, comets, or meteorites. Some evidence includes organic compounds found in meteorites.",
  "biosignatures": "Biosignatures are indicators of life that we can detect remotely, such as oxygen and methane in an atmosphere (which react together and require continuous replenishment), specific isotope ratios, or seasonal changes in atmospheric composition.",

  // Space Technology - Cutting Edge
  "fusion propulsion": "Fusion rockets could achieve specific impulses 10 times higher than chemical rockets, making Mars trips possible in weeks rather than months. Challenges include containing the fusion reaction and converting the energy to thrust efficiently.",
  "breakthrough starshot": "Breakthrough Starshot aims to send tiny probes to Proxima Centauri using powerful laser arrays to accelerate light sails to 20% light speed. The gram-scale probes would reach the star in 20 years and beam data back.",
  "space tether": "Space tethers are long cables deployed from spacecraft that can generate electricity from Earth's magnetic field, provide artificial gravity through rotation, or even boost satellites to higher orbits without using fuel.",
  "alcubierre drive": "The Alcubierre drive is a theoretical faster-than-light propulsion system that works by contracting space in front of a spacecraft and expanding it behind, effectively moving space itself rather than the ship through space."
};

export default function CosmosAI() {
  // Load messages from localStorage on component mount
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cosmos-ai-messages');
      return saved ? JSON.parse(saved) : [
        {
          id: 1,
          text: "Hello! I'm Nova, your personal cosmic intelligence assistant! 🚀 I have extensive knowledge about space, astronomy, physics, and the universe. I can answer questions about planets, stars, galaxies, black holes, space exploration, the Big Bang, and much more. What cosmic mystery would you like to explore today?",
          isUser: false,
          timestamp: new Date()
        }
      ];
    }
    return [
      {
        id: 1,
        text: "Hello! I'm Nova, your personal cosmic intelligence assistant! 🚀 I have extensive knowledge about space, astronomy, physics, and the universe. I can answer questions about planets, stars, galaxies, black holes, space exploration, the Big Bang, and much more. What cosmic mystery would you like to explore today?",
        isUser: false,
        timestamp: new Date()
      }
    ];
  });
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cosmos-ai-messages', JSON.stringify(messages));
    }
  }, [messages]);

  const generateResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    // Check for exact matches first
    for (const [key, response] of Object.entries(knowledgeBase)) {
      if (lowerQuestion.includes(key.toLowerCase())) {
        return response;
      }
    }
    
    // Advanced keyword matching
    const keywords = [
      { words: ['planet', 'planets'], response: "Planets are celestial bodies that orbit stars. In our solar system, we have 8 planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Each has unique characteristics - would you like to know about a specific planet?" },
      { words: ['star', 'stars'], response: "Stars are massive, luminous balls of plasma held together by gravity. They generate energy through nuclear fusion in their cores. Our Sun is a medium-sized star, and there are over 100 billion stars in our galaxy alone! Stars come in many types and sizes." },
      { words: ['galaxy', 'galaxies'], response: "Galaxies are massive collections of stars, gas, dust, and dark matter held together by gravity. Our Milky Way contains over 100 billion stars and is just one of trillions of galaxies in the observable universe." },
      { words: ['moon', 'moons'], response: "Moons are natural satellites that orbit planets. Earth has one moon, but some planets have many - Jupiter has 95 confirmed moons! They form through various processes and can be quite diverse in size and composition." },
      { words: ['space', 'cosmos', 'universe'], response: "The universe is everything that exists - all matter, energy, space, and time. It's about 13.8 billion years old and contains billions of galaxies. Space is the vast, mostly empty region beyond Earth's atmosphere." },
      { words: ['astronaut', 'space travel', 'rocket'], response: "Space travel involves overcoming Earth's gravity using rockets that work on Newton's third law. Astronauts are trained explorers who conduct research in space. Current missions go to the International Space Station and we're planning returns to the Moon and trips to Mars." },
      { words: ['alien', 'life', 'extraterrestrial'], response: "The search for extraterrestrial life is one of the most exciting areas of astronomy! While we haven't found definitive proof yet, scientists are actively searching through SETI, studying extremophiles, and examining potentially habitable exoplanets." },
      { words: ['time', 'relativity'], response: "Time is relative according to Einstein's theories. Time passes differently depending on gravity and speed. Near massive objects or at high speeds, time slows down relative to other reference frames - this is called time dilation." },
      { words: ['energy', 'fusion', 'nuclear'], response: "Stars generate energy through nuclear fusion, converting hydrogen into helium and releasing tremendous amounts of energy. This same process powers the Sun and all other stars, and it's what makes life on Earth possible." },
      { words: ['distance', 'measurement'], response: "Cosmic distances are measured in light-years (distance light travels in a year) and parsecs. The nearest star is 4.24 light-years away, and the observable universe is about 93 billion light-years across." }
    ];

    for (const keyword of keywords) {
      if (keyword.words.some(word => lowerQuestion.includes(word))) {
        return keyword.response;
      }
    }
    
    // Common greetings and responses
    if (lowerQuestion.includes('hello') || lowerQuestion.includes('hi')) {
      return "Hello there, cosmic explorer! I'm excited to help you discover the wonders of the universe. What aspect of space and astronomy interests you most today?";
    }
    
    if (lowerQuestion.includes('thank')) {
      return "You're very welcome! I love sharing the amazing secrets of the cosmos with curious minds like yours. The universe is full of incredible discoveries waiting to be explored! 🌟";
    }
    
    if (lowerQuestion.includes('how are you')) {
      return "I'm doing wonderfully, thank you! I'm always energized when I get to talk about the incredible universe we live in. There's so much amazing stuff out there to discover and discuss!";
    }

    if (lowerQuestion.includes('help') || lowerQuestion.includes('what can you')) {
      return "I can help you learn about astronomy, space exploration, physics, planets, stars, galaxies, black holes, the Big Bang, dark matter, exoplanets, space missions, and much more! Try asking me about any cosmic topic that interests you.";
    }
    
    // Default response for unmatched questions
    return "That's an intriguing question about the cosmos! While I have extensive knowledge about space and astronomy, I might not have specific information about that particular topic. Try asking me about planets, stars, galaxies, black holes, space exploration, the Big Bang, dark matter, or any other astronomical phenomena!";
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const response = generateResponse(inputText);
      const aiMessage: Message = {
        id: Date.now() + 1,
        text: response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 800 + Math.random() * 1200); // Random delay between 0.8-2 seconds
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    "What is a black hole?",
    "How are stars born?",
    "What is dark matter?",
    "Tell me about Mars exploration",
    "How big is the universe?",
    "What are exoplanets?",
    "Explain the Big Bang theory",
    "What are neutron stars?"
  ];

  const handleSuggestionClick = (question: string) => {
    setInputText(question);
  };

  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-8">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 space-text">Meet Nova</h2>
        <p className="text-xl text-gray-200 space-text">Your Personal Cosmic Intelligence Assistant</p>
        <Badge variant="outline" className="border-purple-400 text-purple-400 mt-2 bg-black/20">
          Advanced Space Knowledge AI
        </Badge>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card className="space-card border-white/20 h-[600px] flex flex-col bg-black/40">
          <CardHeader className="flex-shrink-0">
            <CardTitle className="text-white space-text flex items-center gap-2">
              <div className="relative">
                <Settings className="h-6 w-6 text-purple-400 animate-spin" style={{ animationDuration: '3s' }} />
                <Star className="absolute inset-0 h-6 w-6 text-yellow-400 animate-pulse" />
              </div>
              Nova - Cosmic AI Assistant
              <div className="ml-auto flex items-center gap-2">
                <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-400">Online</span>
              </div>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0 min-h-0">
            {/* Messages Area */}
            <div 
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0"
              style={{ maxHeight: 'calc(100% - 120px)' }}
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-lg ${
                      message.isUser
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                        : 'bg-white/10 text-white border border-white/20'
                    }`}
                  >
                    <p className="space-text">{message.text}</p>
                    <span className="text-xs opacity-70 mt-2 block">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/10 p-4 rounded-lg border border-white/20">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-gray-300 text-sm space-text">Nova is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions */}
            {messages.length <= 1 && (
              <div className="px-6 py-2 flex-shrink-0">
                <p className="text-gray-300 text-sm mb-3 space-text">Try asking Nova about:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((question, index) => (
                    <Button
                      key={index}
                      onClick={() => handleSuggestionClick(question)}
                      variant="outline"
                      size="sm"
                      className="border-white/20 text-white hover:bg-white/10 text-xs bg-black/20"
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-6 border-t border-white/10 flex-shrink-0">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask Nova anything about space and the cosmos..."
                  className="flex-1 p-3 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:border-purple-400 focus:outline-none"
                  disabled={isTyping}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isTyping}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 px-6"
                >
                  <Rocket className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
