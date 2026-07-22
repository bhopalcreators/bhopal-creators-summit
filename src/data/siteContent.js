// This file mimics the shape data will come back in from the future CMS API
// (GET /api/content/home, /api/content/site-settings, etc). Keeping it as one
// typed module now means swapping in a real fetch later touches this file only.

export const siteSettings = {
  brand: 'iAMA Bhopali Creator',
  eventName: 'Bhopal Creators Summit 2025',
  tagline: 'UNITE. CREATE. CELEBRATE.',
  date: '31 AUG',
  dateFull: '31-AUG-2025',
  venue: 'Hotel Pride Kolar',
  venueFull: 'Hotel Pride Kolar, Bhopal',
  email: 'bhopalcreatorssummit@gmail.com',
  phones: ['+91 91 79 5523 97', '+91-8319527668'],
  instagramHandle: '@iamabhopalicreator',
};

export const navLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Competitions', href: '#competitions' },
  { label: 'Workshops', href: '#workshops' },
  { label: 'Awards', href: '#awards' },
  { label: 'Tickets', href: '#tickets' },
];

export const heroCtas = [
  { label: 'Awards', href: '#awards' },
  { label: 'Workshops', href: '#workshops' },
  { label: 'Competitions', href: '#competitions' },
  { label: 'Tickets Live Now', href: '#tickets', variant: 'light' },
];

export const aboutContent = {
  eyebrow: 'UNITE. CREATE. CELEBRATE.',
  title: 'About the Summit',
  paragraphs: [
    "The Bhopal Creators Summit returns in 2025, bigger and bolder with the continued support of MP Tourism. After three impactful editions, including one that brought together 450+ creators and over 30M+ in reach, this year's summit aims to take creative networking and collaboration to the next level.",
    "As one of the region's largest creator gatherings, it celebrates digital talent across fields while spotlighting the rich culture and artistic spirit of Madhya Pradesh.",
  ],
  highlights: [
    {
      icon: 'Mic',
      title: 'Live Performances',
      copy: 'Featuring electrifying dance acts, soul-stirring music, and hilarious stand-up comedy.',
    },
    {
      icon: 'Heart',
      title: 'Collaboration Zone',
      copy: 'A dedicated space for creators and brands to collaborate, exchange ideas, and form partnerships that pave the way for groundbreaking projects.',
    },
    {
      icon: 'Presentation',
      title: 'Creator Talks',
      copy: 'Candid conversations and panel discussions with the creators shaping the region\u2019s digital culture.',
    },
  ],
};

export const stats = [
  { value: '450+', label: 'Creators Attended' },
  { value: '20M+', label: 'Overall Reach' },
  { value: '1L+', label: 'Impressions' },
  { value: '20+', label: 'Brands Associations' },
  { value: '\u221E', label: 'Networking' },
];

export const sponsors = [
  { name: 'SAM Global University' },
  { name: 'Ratnesh Communications' },
  { name: 'Snapchat' },
  { name: 'Canon' },
  { name: 'Pride Hotel Bhopal' },
  { name: 'OM System' },
  { name: '94.3 My FM' },
  { name: 'bv' },
  { name: 'Vistaar WebX' },
  { name: 'US Media Works' },
];

export const competitions = [
  {
    slug: 'photography',
    title: 'Photography',
    copy: 'Hey photographers! Ready to show MP the way you see it? Your vision. Your lens. Your rules.',
    image: 'camera',
  },
  {
    slug: 'collabverse-2025',
    title: 'Content Collaboration',
    copy: 'A unique virtual competition where creators from different art forms collaborate to make something original.',
    image: 'collab',
  },
];

export const workshops = [
  {
    title: 'AI Integration in Content',
    facilitator: 'Naman Deshmukh',
    copy: 'Decode the future\u2014how AI can power up your content game.',
    image: 'ai',
  },
  {
    title: 'Entrepreneurship',
    facilitator: 'Harsh Surana',
    copy: 'From ideas to income\u2014build, brand, and break through.',
    image: 'entrepreneurship',
  },
  {
    title: 'Theatre Workshop',
    facilitator: null,
    copy: 'Channel emotion, own the stage\u2014where stories come alive.',
    image: 'theatre',
  },
  {
    title: 'Marketing Workshop',
    facilitator: null,
    copy: 'Crack the algorithm\u2014turn attention into audience.',
    image: 'marketing',
  },
  {
    title: 'Photography & Videography',
    facilitator: null,
    copy: 'Frame it, shoot it, tell it\u2014craft visuals that stop the scroll.',
    image: 'photo',
  },
  {
    title: 'Music Workshop',
    facilitator: null,
    copy: 'Find your sound and learn to share it with the room.',
    image: 'music',
  },
];

export const awards = [
  { title: 'Most Engaging Male Creator', copy: "Every post, a hook\u2014he's got the audience on their toes." },
  { title: 'Most Engaging Female Creator', copy: 'She doesn\u2019t just post, she pulls you in\u2014scroll-stopping energy.' },
  { title: 'Most Influential Male Creator', copy: 'More than followers\u2014it\u2019s the ripple effect of his voice.' },
  { title: 'Most Influential Female Creator', copy: 'When she speaks, trends follow\u2014impact beyond numbers.' },
  { title: 'Creator of the Year', copy: 'The all-rounder who raised the bar and redefined the game.' },
  { title: 'Most Innovative Creator', copy: 'For the one who dared to do different\u2014and nailed it.' },
  { title: 'Trendsetter of the Year', copy: "They didn't follow trends, they made them." },
  { title: 'Community Champion', copy: 'Building, supporting, uplifting\u2014a creator who creates space for others.' },
  { title: 'Most Consistent Creator', copy: 'No off days\u2014just pure, passionate posting day after day.' },
  { title: 'Creator for Social Impact', copy: 'For using content as a catalyst for change.' },
  { title: 'Storyteller of the Year', copy: 'Words, visuals, or reels\u2014they turn stories into magic.' },
  { title: 'Visual Aestheticist', copy: 'Painting the city through the lens\u2014beauty, culture, and soul.' },
  { title: 'Best Collaborative Creator', copy: 'Teamwork that hits different\u2014creating magic with others.' },
  { title: 'Creator Beyond Age', copy: 'Proof that great content has no age limit.' },
  { title: 'Fastest Growing Influencer', copy: 'From unknown to unstoppable\u2014skyrocketing reach, one post at a time.' },
];

export const activities = [
  {
    title: 'Photography Exhibition',
    copy: '50 frames. Endless stories. A visual love letter to Madhya Pradesh.',
    image: 'exhibition',
  },
  {
    title: 'Panel Discussion with Top-Tier Creators',
    copy: 'Real talk, raw journeys, and unfiltered insights from the best in the game.',
    image: 'panel',
  },
  {
    title: '6 Workshops Across Different Categories',
    copy: 'Skill up, level up \u2014 hands-on sessions to fuel your creative fire.',
    image: 'workshops-grid',
  },
];

export const testimonials = [
  {
    handle: '@nanukasafar',
    quote: 'Honoured to receive the Youngest Creator Award.',
  },
  {
    handle: '@bazarvilleindia',
    quote: 'This event truly pushed our creative boundaries.',
  },
  {
    handle: '@techplusgadgets',
    quote: 'One of the best creator events I\u2019ve ever been part of.',
  },
];

export const tickets = [
  {
    id: 'first100',
    label: 'FIRST 100',
    date: '31-AUG-2025',
    price: 300,
    originalPrice: null,
    status: 'sold-out',
  },
  {
    id: 'early-bird',
    label: 'Early Bird',
    date: '31-AUG-2025',
    price: 500,
    originalPrice: 750,
    status: 'available',
  },
  {
    id: 'standard',
    label: 'Standard',
    date: '31-AUG-2025',
    price: null,
    startsFrom: '25th August',
    status: 'upcoming',
  },
];

export const agenda = [
  {
    title: 'Power-Packed Workshops',
    time: '11:00 AM \u2013 2:00 PM',
    open: true,
    body: 'intro',
    items: [
      'AI Integration in content',
      'Marketing Workshop',
      'Entrepreneurship Workshop',
      'Photography & Videography',
      'Theatre & Acting',
      'Music Workshop',
      'Stage Presence',
    ],
  },
  {
    title: 'Panel Discussions & Keynote Sessions',
    time: '2:30 PM \u2013 4:30 PM',
    open: false,
    items: [],
  },
  {
    title: 'Awards & Performances',
    time: '5:00 PM \u2013 8:00 PM',
    open: false,
    items: [],
  },
  {
    title: 'Live Music & DJ Night',
    time: '8:30 PM \u2013 10:00 PM',
    open: false,
    items: [],
  },
];

export const footerLinks = [
  { label: 'About', href: '/about' },
  { label: 'Contact Us', href: '#contact' },
  { label: '2024 Highlights', href: '#highlights' },
  { label: 'Sponsors', href: '#sponsors' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms & Conditions', href: '/terms' },
  { label: 'Shipping & Delivery Policy', href: '/shipping-policy' },
];
