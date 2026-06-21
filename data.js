const GRAPH_DATA = {
  nodes: [
    {
      id: "kawaii",
      icon: "🐰",
      label: {
        ja: "かわいいものたち",
        en: "Cute Things",
      },
      description: {
        ja: "日々の中で出会うかわいいものを集めています。ときめきは大切に。",
        en: "A collection of cute things I encounter in everyday life.",
      },
      photos: [],
    },
    {
      id: "food",
      icon: "🍜",
      label: {
        ja: "すきなたべもの",
        en: "Favourite Food",
      },
      description: {
        ja: "おいしいものを食べることが幸せの基本。いつか食べたいものも。",
        en: "Good food is the foundation of happiness. Also things I want to try someday.",
      },
      photos: [],
    },
    {
      id: "spots",
      icon: "🏠",
      label: {
        ja: "おきにいりのお店",
        en: "Favourite Spots",
      },
      description: {
        ja: "また行きたいと思えるお店や場所。雰囲気も大事。",
        en: "Places I keep wanting to go back to. Atmosphere matters as much as the food.",
      },
      photos: [],
    },
    {
      id: "london",
      icon: "🇬🇧",
      label: {
        ja: "ロンドンぐらし",
        en: "London Life",
      },
      description: {
        ja: "2025年秋からロンドン在住。日々の発見と驚き。",
        en: "Living in London since autumn 2025. Daily discoveries and surprises.",
      },
      photos: [],
    },
    {
      id: "weekend",
      icon: "☕",
      label: {
        ja: "週末のたのしみ",
        en: "Weekend Pleasures",
      },
      description: {
        ja: "平日を乗り越えるための週末の小さな楽しみたち。",
        en: "The small joys that make the weekdays worth it.",
      },
      photos: [],
    },
  ],
  links: [
    { source: "food", target: "spots" },
    { source: "food", target: "london" },
    { source: "food", target: "weekend" },
    { source: "kawaii", target: "london" },
    { source: "kawaii", target: "weekend" },
    { source: "kawaii", target: "spots" },
    { source: "weekend", target: "spots" },
    { source: "london", target: "spots" },
  ],
};
