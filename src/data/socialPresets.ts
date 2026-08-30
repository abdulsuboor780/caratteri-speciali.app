import { SocialCategory, SocialPreset } from '../types';

export interface SocialCategoryInfo {
  id: SocialCategory;
  name: string;
  icon: string;
  description: string;
}

export const SOCIAL_CATEGORIES: SocialCategoryInfo[] = [
  { id: 'tutti', name: 'Tutti i Template', icon: '📱', description: 'Tutte le combinazioni pronte per i social' },
  { id: 'bio_instagram', name: 'Bio Instagram & TikTok', icon: '📸', description: 'Intestazioni, presentazioni e cornici per bio' },
  { id: 'nickname_gaming', name: 'Nickname Gaming', icon: '🎮', description: 'Nomi per Free Fire, PUBG, Discord, Valorant' },
  { id: 'separatori', name: 'Separatori di Testo', icon: '─', description: 'Linee decorative e divisori per post e messaggi' },
  { id: 'cornici', name: 'Cornici & Riquadri', icon: '𓆩♡𓆪', description: 'Decorazioni artistiche per racchiudere parole' },
  { id: 'frecce_social', name: 'Frecce & Puntatori', icon: '➔', description: 'Combinazioni di frecce per link in bio e swipe-up' },
  { id: 'cuori_social', name: 'Amore & Cuori', icon: 'ʚ♡⃛ɞ', description: 'Decorazioni romantiche e cuori simmetrici' },
  { id: 'aesthetic_tiktok', name: 'Aesthetic & Y2K', icon: '✨', description: 'Stili vaporwave, soft aesthetic, coquette e indie' },
];

export const SOCIAL_PRESETS: SocialPreset[] = [
  // --- NICKNAME GAMING ---
  {
    id: 'game_wings_1',
    name: 'Ali Gotiche Reali',
    category: 'nickname_gaming',
    template: '꧁༺ {text} ༻꧂',
    description: 'Il classico formato leggendario per clan e gaming',
    tags: ['gaming', 'clan', 'freefire', 'pubg', 'leader'],
  },
  {
    id: 'game_sword_shield',
    name: 'Spada & Scudo',
    category: 'nickname_gaming',
    template: '⚔️『 {text} 』🛡️',
    description: 'Guerriero d’onore pronto alla battaglia',
    tags: ['spada', 'combattimento', 'rpg', 'mmo'],
  },
  {
    id: 'game_crown_king',
    name: 'Corona d’Oro VIP',
    category: 'nickname_gaming',
    template: '👑 亗 {text} 亗 👑',
    description: 'Corona imperiale Kanji con corone dorate',
    tags: ['re', 'corona', 'vip', 'toxic', 'pubg'],
  },
  {
    id: 'game_lightning',
    name: 'Fulmine Elettrico',
    category: 'nickname_gaming',
    template: '⚡ 𝓚 𝓘 𝓛 𝓛 𝓔 𝓡 {text} ⚡',
    description: 'Stile scattante ad alto voltaggio',
    tags: ['elettrico', 'velocita', 'killer'],
  },
  {
    id: 'game_sniper',
    name: 'Mirino Cecchino',
    category: 'nickname_gaming',
    template: '🎯 ︻╦╤─ {text} ─╤╦︻ 🎯',
    description: 'Fucile da cecchino testuale e bersaglio',
    tags: ['sniper', 'fps', 'call of duty', 'csgo'],
  },
  {
    id: 'game_samurai',
    name: 'Samurai del Clan',
    category: 'nickname_gaming',
    template: '父 {text} 父',
    description: 'Leader del dojo / samurai',
    tags: ['samurai', 'giappone', 'clan'],
  },
  {
    id: 'game_devil_horns',
    name: 'Diavolo / Demone',
    category: 'nickname_gaming',
    template: 'ψ(｀∇´)ψ {text} 𓆩😈𓆪',
    description: 'Atmosfera dark & demoniaca',
    tags: ['diavolo', 'dark', 'goth'],
  },

  // --- BIO INSTAGRAM & TIKTOK ---
  {
    id: 'bio_header_sparkle',
    name: 'Intestazione Bio Scintillante',
    category: 'bio_instagram',
    template: '✧･ﾟ: *✧･ﾟ:* {text} *:･ﾟ✧*:･ﾟ✧',
    description: 'Polvere di stelle perfetta per il titolo del tuo profilo',
    tags: ['bio', 'instagram', 'luce', 'sparkle'],
  },
  {
    id: 'bio_clean_quote',
    name: 'Citazione Minimal Orientale',
    category: 'bio_instagram',
    template: '「 {text} 」\n📍 Italy  |  ✈️ Travel  |  ☕ Coffee',
    description: 'Struttura pulita e moderna per bio Instagram e Threads',
    tags: ['bio', 'minimal', 'viaggi', 'lifestyle'],
  },
  {
    id: 'bio_coquette_bow',
    name: 'Coquette Fiocchetto',
    category: 'bio_instagram',
    template: '୨୧ {text} ୨୧\n˗ˏˋ welcome to my diary ˎˊ˗',
    description: 'Stile principesco con fiocchi e nastro',
    tags: ['coquette', 'principessa', 'diary', 'cute'],
  },
  {
    id: 'bio_location_link',
    name: 'Link & Swipe-up Pointer',
    category: 'bio_instagram',
    template: '👇 Scopri di più qui sotto 👇\n🔗 {text}',
    description: 'Invito all’azione per il link in bio',
    tags: ['link', 'bio', 'cta', 'marketing'],
  },

  // --- SEPARATORI DI TESTO ---
  {
    id: 'sep_stars_line',
    name: 'Linea di Stelle Delicate',
    category: 'separatori',
    template: '⋆┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⋆\n{text}\n⋆┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⋆',
    description: 'Divisore sobrio ed elegante per separare paragrafi',
    tags: ['divisore', 'linea', 'stelle', 'post'],
  },
  {
    id: 'sep_diamond_wave',
    name: 'Onda di Diamanti',
    category: 'separatori',
    template: '─── ⋆⋅☆⋅⋆ ───\n{text}\n─── ⋆⋅☆⋅⋆ ───',
    description: 'Bordura simmetrica con stella centrale',
    tags: ['diamante', 'stella', 'simmetria'],
  },
  {
    id: 'sep_hearts_divider',
    name: 'Divisore con Cuoricini',
    category: 'separatori',
    template: '♡━━━━━━ ʚ♡⃛ɞ ━━━━━━♡\n{text}\n♡━━━━━━ ʚ♡⃛ɞ ━━━━━━♡',
    description: 'Separatore romantico con cuori alle estremità',
    tags: ['cuori', 'romantico', 'linea'],
  },
  {
    id: 'sep_music_sound',
    name: 'Equalizzatore Audio',
    category: 'separatori',
    template: 'ıllıllı {text} ıllıllı',
    description: 'Barre di volume sonore e onde musicali',
    tags: ['musica', 'audio', 'volume'],
  },
  {
    id: 'sep_nature_vines',
    name: 'Ramo & Foglie',
    category: 'separatori',
    template: '🌿 ───────── ⋆⋅🍃⋅⋆ ───────── 🌿\n{text}',
    description: 'Divisore a tema botanico e naturale',
    tags: ['natura', 'foglie', 'green'],
  },

  // --- CORNICI & RIQUADRI ---
  {
    id: 'frame_angel_wings',
    name: 'Ali d’Angelo Gotiche',
    category: 'cornici',
    template: '𓆩♡𓆪 {text} 𓆩♡𓆪',
    description: 'Ali di cigno / angelo con cuore centrale',
    tags: ['ali', 'angelo', 'aesthetic'],
  },
  {
    id: 'frame_double_brackets',
    name: 'Cornice Giapponese Nera',
    category: 'cornici',
    template: '【 ✦ {text} ✦ 】',
    description: 'Parentesi piene con scintille d’oro',
    tags: ['parentesi', 'nero', 'evidenza'],
  },
  {
    id: 'frame_soft_bubble',
    name: 'Bolla Soffice',
    category: 'cornici',
    template: '꒰ 🌸 {text} 🌸 ꒱',
    description: 'Parentesi morbida con petali di ciliegio',
    tags: ['sakura', 'morbido', 'cute'],
  },
  {
    id: 'frame_vintage_scroll',
    name: 'Pergamena d’Epoca',
    category: 'cornici',
    template: '📜 ⁅ {text} ⁆ 📜',
    description: 'Stile manoscritto antico con pergamena',
    tags: ['vintage', 'antico', 'storia'],
  },

  // --- CUORI & AMORE SOCIAL ---
  {
    id: 'hearts_side_love',
    name: 'Fascia d’Amore Laterale',
    category: 'cuori_social',
    template: '•.¸♡ {text} ♡¸.•',
    description: 'Dolce abbraccio di onde e cuori',
    tags: ['cuore', 'onde', 'dolce'],
  },
  {
    id: 'hearts_infinity',
    name: 'Amore Infinito',
    category: 'cuori_social',
    template: '♾️ ❤️ {text} ❤️ ♾️',
    description: 'Simbolo dell’infinito e cuore rosso',
    tags: ['infinito', 'per sempre', 'amore'],
  },
  {
    id: 'hearts_korean_cute',
    name: 'Cuoricino Coreano Aesthetic',
    category: 'cuori_social',
    template: '˗ˏˋ ᰔ {text} ᰔ ˎˊ˗',
    description: 'Accenti di luce e cuoricino coreano',
    tags: ['coreano', 'kpop', 'cute', 'bio'],
  },

  // --- FRECCE SOCIAL ---
  {
    id: 'arrows_target',
    name: 'Freccia d’Amore con Bersaglio',
    category: 'frecce_social',
    template: '˚₊· ͟͟͞͞➳❥ {text}',
    description: 'Freccia sfrecciante che colpisce il cuore',
    tags: ['freccia', 'tiro', 'amore', 'instagram'],
  },
  {
    id: 'arrows_flight_path',
    name: 'Rotta Aerea & Viaggio',
    category: 'frecce_social',
    template: '✈️ ─── ➔ {text} ➔ 📍',
    description: 'Tragitto di viaggio tra partenze e destinazioni',
    tags: ['viaggio', 'aereo', 'vacanze'],
  },

  // --- AESTHETIC TIKTOK & Y2K ---
  {
    id: 'aes_clouds_dream',
    name: 'Nuvola dei Desideri',
    category: 'aesthetic_tiktok',
    template: '☁️ ┊͙✧˖*°࿐ {text}',
    description: 'Volo tra le nuvole in stile soft aesthetic',
    tags: ['nuvole', 'aesthetic', 'sogni'],
  },
  {
    id: 'aes_swan_lake',
    name: 'Lago dei Cigni',
    category: 'aesthetic_tiktok',
    template: '₊˚ 🦢・₊✧ {text} ✧₊・🦢 ˚₊',
    description: 'Cigni maestosi e scintille delicate',
    tags: ['cigno', 'eleganza', 'bianco'],
  },
  {
    id: 'aes_pixel_retro',
    name: 'Pixel Retro Y2K',
    category: 'aesthetic_tiktok',
    template: '★ [ 🛸 {text} 🛸 ] ★',
    description: 'Stile anni 2000 spaziale e futuristico',
    tags: ['y2k', 'retro', 'spazio'],
  },
];

export function applySocialPreset(template: string, userText: string): string {
  const replacement = userText.trim() || 'Caratteri Speciali';
  return template.replace(/{text}/g, replacement);
}

export function getSocialPresetsByCategory(cat: SocialCategory): SocialPreset[] {
  if (cat === 'tutti') return SOCIAL_PRESETS;
  return SOCIAL_PRESETS.filter((p) => p.category === cat);
}
