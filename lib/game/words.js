export const PASSAGES = [
  {
    id: "short-1",
    title: "Neon Horizon",
    length: "short",
    category: "Cyberpunk",
    text: "The neon lights reflect across the wet asphalt as engines roar into the digital night. Every keystroke ignites pure acceleration.",
  },
  {
    id: "short-2",
    title: "Apex Velocity",
    length: "short",
    category: "Racing",
    text: "Hugging the inside curb at two hundred miles per hour requires absolute precision and unwavering focus. There is zero room for hesitation.",
  },
  {
    id: "short-3",
    title: "Binary Highway",
    length: "short",
    category: "Tech",
    text: "Streams of data flash across the head-up display. Synchronize your fingers with the rhythm of the machine to unlock maximum speed.",
  },
  {
    id: "short-4",
    title: "Turbo Shift",
    length: "short",
    category: "Racing",
    text: "Grip the wheel and floor the throttle. When the green lights flash, instinct takes over and the world blurs into pure speed.",
  },
  {
    id: "short-5",
    title: "Circuit Breaker",
    length: "short",
    category: "Arcade",
    text: "Push past your limits on the final lap. Lightning reflexes and continuous momentum will propel your machine straight across the finish line.",
  },
  {
    id: "med-1",
    title: "Midnight Grand Prix",
    length: "medium",
    category: "Racing",
    text: "The countdown echoes through the stadium as tires grip the starting grid. When the lights turn green, acceleration presses you deep into your seat. Focus on every word ahead. Accuracy builds momentum, continuous streaks charge your nitro boosters, and hesitation will cost you the victory.",
  },
  {
    id: "med-2",
    title: "Cybernetic Drift",
    length: "medium",
    category: "Cyberpunk",
    text: "Under the towering skyscrapers of Neo-Tokyo, customized racers compete for supremacy on the elevated skyways. Synthetic engines hum with electric voltage as each corner demands split-second timing. Keep your cadence steady and smooth, because in this race, rhythm is more powerful than raw brute force.",
  },
  {
    id: "med-3",
    title: "The Art of Speed",
    length: "medium",
    category: "Philosophy",
    text: "Great drivers know that speed is not merely about pressing harder on the gas pedal. True velocity is born from calm deliberation and fluid movement. When your hands move without friction and your eyes anticipate each line before it arrives, the machine and driver become one unstoppable force.",
  },
  {
    id: "med-4",
    title: "Quantum Overdrive",
    length: "medium",
    category: "Sci-Fi",
    text: "Engaging warp injection stabilizes the vehicle across the magnetic track. As the speedometer climbs past critical thresholds, visual distortion stretches the horizon. Stay locked onto the target stream. Every character typed correctly feeds energy directly into your twin plasma turbines for unprecedented overdrive.",
  },
  {
    id: "long-1",
    title: "The Final Lap of Champions",
    length: "long",
    category: "Championship",
    text: "Rain lashes against the windshield as you enter the decisive lap of the championship grand prix. Behind you, rival engines snarl in hot pursuit, waiting for the slightest mistake to seize the lead. Your fingers dance across the controls with effortless grace. Each sentence conquered pushes your vehicle further ahead of the pack. Feel the pulse of the race track beneath your wheels, monitor your telemetry closely, and unleash full nitro power as the checkered flag appears through the mist.",
  },
  {
    id: "long-2",
    title: "Hyperlane Syndicate",
    length: "long",
    category: "Cyberpunk",
    text: "Beyond the neon sprawl of the lower sectors lies the infamous orbital speedway. Racers from every corner of the grid gather to push experimental prototypes beyond their safety limits. Laser markers illuminate the boundary lines while holographic banners cheer above the roaring grandstands. To achieve legend status, you must maintain unflinching accuracy through the most intricate chicanes and high-speed straightaways without dropping a single combo.",
  },
  {
    id: "long-3",
    title: "The Speed of Thought",
    length: "long",
    category: "Philosophy",
    text: "In the arena of competitive typing racing, thought and execution must collapse into a singular instant. When you read the text, do not analyze each letter individually; instead, perceive entire phrases as unified melodies. Allow muscle memory to execute the keystrokes naturally while your mind remains calm, centered, and laser-focused on the road ahead. Mastery belongs to those who turn chaotic speed into perfect harmony.",
  },
];

export function getPassage(length = "medium", excludeId = null) {
  let candidates = PASSAGES;
  if (length && length !== "any") {
    candidates = PASSAGES.filter((p) => p.length === length);
  }
  if (excludeId && candidates.length > 1) {
    candidates = candidates.filter((p) => p.id !== excludeId);
  }
  if (candidates.length === 0) candidates = PASSAGES;
  
  const randomIndex = Math.floor(Math.random() * candidates.length);
  return candidates[randomIndex];
}
