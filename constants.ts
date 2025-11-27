import { StyleCategory, StyleOption } from './types';

// --- HAIR STYLES ---
export const HAIR_OPTIONS: StyleOption[] = [
  // Short
  { id: 'h_buzz', label: 'Buzz Cut', value: 'Short military buzz cut', category: StyleCategory.HAIR },
  { id: 'h_pixie', label: 'Pixie Cut', value: 'Chic short pixie cut', category: StyleCategory.HAIR },
  { id: 'h_crew', label: 'Crew Cut', value: 'Classic crew cut fade', category: StyleCategory.HAIR },
  { id: 'h_undercut', label: 'Undercut', value: 'Edgy undercut hairstyle', category: StyleCategory.HAIR },
  { id: 'h_bald', label: 'Bald', value: 'Completely bald head smooth', category: StyleCategory.HAIR },
  { id: 'h_caesar', label: 'Caesar Cut', value: 'Short Caesar cut with bangs', category: StyleCategory.HAIR },
  { id: 'h_fauxhawk', label: 'Faux Hawk', value: 'Spiky faux hawk hairstyle', category: StyleCategory.HAIR },
  { id: 'h_pompadour', label: 'Pompadour', value: 'Voluminous classic pompadour', category: StyleCategory.HAIR },
  { id: 'h_slickback', label: 'Slicked Back', value: 'Wet look slicked back hair', category: StyleCategory.HAIR },
  // Medium / Bobs
  { id: 'h_bob', label: 'Classic Bob', value: 'Sleek chin-length bob cut', category: StyleCategory.HAIR },
  { id: 'h_messy_bob', label: 'Messy Bob', value: 'Textured messy bob with waves', category: StyleCategory.HAIR },
  { id: 'h_angled_bob', label: 'Angled Bob', value: 'Sharp angled A-line bob', category: StyleCategory.HAIR },
  { id: 'h_lob', label: 'Long Bob (Lob)', value: 'Shoulder-length long bob', category: StyleCategory.HAIR },
  { id: 'h_shag', label: 'Shag Cut', value: 'Messy layered 70s shag haircut', category: StyleCategory.HAIR },
  { id: 'h_mullet', label: 'Modern Mullet', value: 'Modern mullet hairstyle', category: StyleCategory.HAIR },
  { id: 'h_wolf', label: 'Wolf Cut', value: 'Trendy wolf cut with layers', category: StyleCategory.HAIR },
  { id: 'h_afro_short', label: 'Short Afro', value: 'Short rounded afro', category: StyleCategory.HAIR },
  { id: 'h_wetlook', label: 'Wet Look', value: 'Trendy wet look wavy hair', category: StyleCategory.HAIR },
  { id: 'h_spiky', label: 'Spiky', value: 'Messy spiky anime style hair', category: StyleCategory.HAIR },
  { id: 'h_rachel', label: 'The Rachel', value: '90s layered blowout hairstyle', category: StyleCategory.HAIR },
  // Long
  { id: 'h_long_straight', label: 'Long Straight', value: 'Long sleek straight hair', category: StyleCategory.HAIR },
  { id: 'h_long_wavy', label: 'Long Wavy', value: 'Long flowing wavy hair', category: StyleCategory.HAIR },
  { id: 'h_long_curly', label: 'Long Curly', value: 'Long voluminous curly hair', category: StyleCategory.HAIR },
  { id: 'h_layers', label: 'Face Framing', value: 'Long hair with face-framing layers', category: StyleCategory.HAIR },
  { id: 'h_dreads', label: 'Dreadlocks', value: 'Long dreadlocks', category: StyleCategory.HAIR },
  { id: 'h_braids', label: 'Box Braids', value: 'Long box braids', category: StyleCategory.HAIR },
  { id: 'h_hime', label: 'Hime Cut', value: 'Japanese Hime cut with sidelocks', category: StyleCategory.HAIR },
  { id: 'h_goddess', label: 'Goddess Locs', value: 'Faux locs with curly ends', category: StyleCategory.HAIR },
  // Updos & Styles
  { id: 'h_updo', label: 'Elegant Updo', value: 'Elegant formal updo', category: StyleCategory.HAIR },
  { id: 'h_messy_updo', label: 'Messy Updo', value: 'Casual messy textured updo with loose strands', category: StyleCategory.HAIR },
  { id: 'h_bun', label: 'Messy Bun', value: 'Casual high messy bun', category: StyleCategory.HAIR },
  { id: 'h_pony', label: 'High Ponytail', value: 'Sleek high ponytail', category: StyleCategory.HAIR },
  { id: 'h_pigtails', label: 'Pigtails', value: 'Two braided pigtails', category: StyleCategory.HAIR },
  { id: 'h_spacebuns', label: 'Space Buns', value: 'Double space buns', category: StyleCategory.HAIR },
  { id: 'h_cornrows', label: 'Cornrows', value: 'Tight cornrow braids', category: StyleCategory.HAIR },
  { id: 'h_viking', label: 'Viking Braids', value: 'Intricate viking style braids', category: StyleCategory.HAIR },
  { id: 'h_mohawk', label: 'Mohawk', value: 'Punk mohawk hairstyle', category: StyleCategory.HAIR },
  { id: 'h_liberty', label: 'Liberty Spikes', value: 'Tall punk liberty spikes', category: StyleCategory.HAIR },
  { id: 'h_fingerwaves', label: 'Finger Waves', value: 'Vintage 1920s finger waves', category: StyleCategory.HAIR },
  { id: 'h_bangs', label: 'Straight Bangs', value: 'Hair with straight blunt bangs', category: StyleCategory.HAIR },
  { id: 'h_curtain', label: 'Curtain Bangs', value: 'Hair with trendy curtain bangs', category: StyleCategory.HAIR },
  { id: 'h_frosted', label: 'Frosted Tips', value: 'Y2K spiky frosted tips', category: StyleCategory.HAIR },
];

// --- HAIR LENGTH ---
export const HAIR_LENGTH_OPTIONS: StyleOption[] = [
  { id: 'hl_short', label: 'Short', value: 'Short length', category: StyleCategory.HAIR_LENGTH },
  { id: 'hl_chin', label: 'Chin Length', value: 'Chin length', category: StyleCategory.HAIR_LENGTH },
  { id: 'hl_shoulder', label: 'Shoulder Length', value: 'Shoulder length', category: StyleCategory.HAIR_LENGTH },
  { id: 'hl_medium', label: 'Medium', value: 'Medium length', category: StyleCategory.HAIR_LENGTH },
  { id: 'hl_long', label: 'Long', value: 'Long length', category: StyleCategory.HAIR_LENGTH },
  { id: 'hl_waist', label: 'Waist Length', value: 'Very long waist length', category: StyleCategory.HAIR_LENGTH },
];

// --- HAIR COLORS ---
export const HAIR_COLOR_OPTIONS: StyleOption[] = [
  // Natural
  { id: 'hc_black', label: 'Jet Black', value: 'Jet black', category: StyleCategory.HAIR_COLOR },
  { id: 'hc_darkbrown', label: 'Dark Brown', value: 'Deep dark brown', category: StyleCategory.HAIR_COLOR },
  { id: 'hc_chestnut', label: 'Chestnut', value: 'Rich chestnut brown', category: StyleCategory.HAIR_COLOR },
  { id: 'hc_honey', label: 'Honey Blonde', value: 'Warm honey blonde', category: StyleCategory.HAIR_COLOR },
  { id: 'hc_platinum', label: 'Platinum', value: 'Icy platinum blonde', category: StyleCategory.HAIR_COLOR },
  { id: 'hc_auburn', label: 'Auburn', value: 'Deep auburn red', category: StyleCategory.HAIR_COLOR },
  { id: 'hc_ginger', label: 'Ginger', value: 'Natural bright ginger', category: StyleCategory.HAIR_COLOR },
  { id: 'hc_saltpepper', label: 'Salt & Pepper', value: 'Natural salt and pepper grey', category: StyleCategory.HAIR_COLOR },
  { id: 'hc_silver', label: 'Silver', value: 'Metallic silver grey', category: StyleCategory.HAIR_COLOR },
  { id: 'hc_white', label: 'Pure White', value: 'Stark pure white', category: StyleCategory.HAIR_COLOR },
  // Vivid
  { id: 'hc_pastelpink', label: 'Pastel Pink', value: 'Soft pastel pink', category: StyleCategory.HAIR_COLOR },
  { id: 'hc_hotpink', label: 'Hot Pink', value: 'Vibrant hot pink', category: StyleCategory.HAIR_COLOR },
  { id: 'hc_rose', label: 'Rose Gold', value: 'Metallic rose gold', category: StyleCategory.HAIR_COLOR },
  { id: 'hc_red', label: 'Fire Red', value: 'Bright fire engine red', category: StyleCategory.HAIR_COLOR },
  { id: 'hc_orange', label: 'Neon Orange', value: 'Bright neon orange', category: StyleCategory.HAIR_COLOR },
  { id: 'hc_yellow', label: 'Yellow', value: 'Bright sunflower yellow', category: StyleCategory.HAIR_COLOR },
  { id: 'hc_green', label: 'Emerald', value: 'Deep emerald green', category: StyleCategory.HAIR_COLOR },
  { id: 'hc_slime', label: 'Neon Green', value: 'Bright slime neon green', category: StyleCategory.HAIR_COLOR },
  { id: 'hc_mint', label: 'Mint', value: 'Pastel mint green', category: StyleCategory.HAIR_COLOR },
  { id: 'hc_blue', label: 'Electric Blue', value: 'Vibrant electric blue', category: StyleCategory.HAIR_COLOR },
  { id: 'hc_navy', label: 'Navy', value: 'Dark navy blue', category: StyleCategory.HAIR_COLOR },
  { id: 'hc_purple', label: 'Purple', value: 'Deep royal purple', category: StyleCategory.HAIR_COLOR },
  { id: 'hc_lavender', label: 'Lavender', value: 'Soft pastel lavender', category: StyleCategory.HAIR_COLOR },
  // Multi
  { id: 'hc_rainbow', label: 'Rainbow', value: 'Multicolor rainbow', category: StyleCategory.HAIR_COLOR },
  { id: 'hc_ombre', label: 'Ombre', value: 'Dark roots fading to blonde ends', category: StyleCategory.HAIR_COLOR },
  { id: 'hc_split', label: 'Split Dye', value: 'Split dyed half black half white', category: StyleCategory.HAIR_COLOR },
  { id: 'hc_galaxy', label: 'Galaxy', value: 'Galaxy mix of purple blue and black', category: StyleCategory.HAIR_COLOR },
  { id: 'hc_highlights', label: 'Chunky Highlights', value: 'Y2K chunky highlights', category: StyleCategory.HAIR_COLOR },
  { id: 'hc_peekaboo', label: 'Peek-a-Boo', value: 'Hidden bright color layer underneath', category: StyleCategory.HAIR_COLOR },
];

// --- EXPRESSIONS ---
export const EXPRESSION_OPTIONS: StyleOption[] = [
  // Positive
  { id: 'ex_smile', label: 'Smile', value: 'Happy smiling expression', category: StyleCategory.EXPRESSION },
  { id: 'ex_grin', label: 'Big Grin', value: 'Wide cheerful grin showing teeth', category: StyleCategory.EXPRESSION },
  { id: 'ex_laugh', label: 'Laughing', value: 'Joyful laughing expression', category: StyleCategory.EXPRESSION },
  { id: 'ex_beaming', label: 'Beaming', value: 'Radiant beaming smile', category: StyleCategory.EXPRESSION },
  { id: 'ex_chuckle', label: 'Chuckle', value: 'Subtle amused chuckle', category: StyleCategory.EXPRESSION },
  { id: 'ex_content', label: 'Content', value: 'Peaceful content expression', category: StyleCategory.EXPRESSION },
  
  // Flirty / Romantic
  { id: 'ex_smirk', label: 'Smirk', value: 'Confident asymmetrical smirk', category: StyleCategory.EXPRESSION },
  { id: 'ex_wink', label: 'Wink', value: 'Playful winking expression', category: StyleCategory.EXPRESSION },
  { id: 'ex_seductive', label: 'Sultry', value: 'Sultry seductive gaze', category: StyleCategory.EXPRESSION },
  { id: 'ex_kiss', label: 'Blowing Kiss', value: 'Blowing a kiss expression', category: StyleCategory.EXPRESSION },
  { id: 'ex_lipbite', label: 'Lip Bite', value: 'Biting lower lip flirty', category: StyleCategory.EXPRESSION },
  
  // Cool / Serious
  { id: 'ex_neutral', label: 'Neutral', value: 'Calm neutral expression', category: StyleCategory.EXPRESSION },
  { id: 'ex_serious', label: 'Serious', value: 'Serious intense expression', category: StyleCategory.EXPRESSION },
  { id: 'ex_focused', label: 'Focused', value: 'Intensely focused concentration', category: StyleCategory.EXPRESSION },
  { id: 'ex_suspicious', label: 'Suspicious', value: 'Narrowed eyes suspicious look', category: StyleCategory.EXPRESSION },
  { id: 'ex_stoic', label: 'Stoic', value: 'Emotionless stoic face', category: StyleCategory.EXPRESSION },
  { id: 'ex_brow_raise', label: 'Raised Brow', value: 'One eyebrow raised inquisitively', category: StyleCategory.EXPRESSION },

  // Negative / Sad
  { id: 'ex_sad', label: 'Sad', value: 'Sad unhappy expression', category: StyleCategory.EXPRESSION },
  { id: 'ex_frown', label: 'Frown', value: 'Disappointed frown', category: StyleCategory.EXPRESSION },
  { id: 'ex_crying', label: 'Crying', value: 'Tearful crying expression', category: StyleCategory.EXPRESSION },
  { id: 'ex_angry', label: 'Angry', value: 'Angry furious expression', category: StyleCategory.EXPRESSION },
  { id: 'ex_disgusted', label: 'Disgusted', value: 'Disgusted cringe expression', category: StyleCategory.EXPRESSION },
  { id: 'ex_pout', label: 'Pout', value: 'Cute upset pouting expression', category: StyleCategory.EXPRESSION },
  { id: 'ex_grimace', label: 'Grimace', value: 'Awkward grimace baring teeth', category: StyleCategory.EXPRESSION },
  
  // Surprised / Shocked
  { id: 'ex_surprised', label: 'Surprised', value: 'Wide-eyed surprised expression', category: StyleCategory.EXPRESSION },
  { id: 'ex_shocked', label: 'Shocked', value: 'Jaw dropped shocked expression', category: StyleCategory.EXPRESSION },
  { id: 'ex_confused', label: 'Confused', value: 'Confused tilted head expression', category: StyleCategory.EXPRESSION },
  { id: 'ex_terrified', label: 'Terrified', value: 'Scared terrified expression', category: StyleCategory.EXPRESSION },
  { id: 'ex_scream', label: 'Screaming', value: 'Screaming with wide open mouth', category: StyleCategory.EXPRESSION },
  
  // Fun / Silly
  { id: 'ex_tongue', label: 'Tongue Out', value: 'Sticking tongue out playfully', category: StyleCategory.EXPRESSION },
  { id: 'ex_duck', label: 'Duck Face', value: 'Silly duck face selfie expression', category: StyleCategory.EXPRESSION },
  { id: 'ex_rolleyes', label: 'Eye Roll', value: 'Rolling eyes annoyed expression', category: StyleCategory.EXPRESSION },
  { id: 'ex_yawn', label: 'Yawning', value: 'Wide yawning tired expression', category: StyleCategory.EXPRESSION },
  { id: 'ex_sneeze', label: 'Sneezing', value: 'Mid-sneeze funny face', category: StyleCategory.EXPRESSION },
  { id: 'ex_puff', label: 'Puffed Cheeks', value: 'Holding breath with puffed cheeks', category: StyleCategory.EXPRESSION },
];

// --- ACCESSORIES (Broken down) ---

export const GLASSES_OPTIONS: StyleOption[] = [
  { id: 'a_aviator', label: 'Aviators', value: 'Aviator sunglasses', category: StyleCategory.ACCESSORIES },
  { id: 'a_wayfarer', label: 'Wayfarers', value: 'Classic black Wayfarer sunglasses', category: StyleCategory.ACCESSORIES },
  { id: 'a_round', label: 'Round Wire', value: 'Round wire-frame glasses', category: StyleCategory.ACCESSORIES },
  { id: 'a_cateye', label: 'Cat Eye', value: 'Vintage cat-eye glasses', category: StyleCategory.ACCESSORIES },
  { id: 'a_thick', label: 'Thick Rimmed', value: 'Thick black hipster glasses', category: StyleCategory.ACCESSORIES },
  { id: 'a_clear', label: 'Clear Frames', value: 'Trendy transparent frame glasses', category: StyleCategory.ACCESSORIES },
  { id: 'a_rimless', label: 'Rimless', value: 'Minimalist rimless glasses', category: StyleCategory.ACCESSORIES },
  { id: 'a_shield', label: 'Shield Shades', value: 'Futuristic shield sunglasses', category: StyleCategory.ACCESSORIES },
  { id: 'a_tinted_red', label: 'Red Tint', value: 'Red tinted sunglasses', category: StyleCategory.ACCESSORIES },
  { id: 'a_tinted_blue', label: 'Blue Tint', value: 'Blue tinted sunglasses', category: StyleCategory.ACCESSORIES },
  { id: 'a_tinted_yellow', label: 'Yellow Tint', value: 'Yellow tinted aviator sunglasses', category: StyleCategory.ACCESSORIES },
  { id: 'a_monocle', label: 'Monocle', value: 'Antique gold monocle', category: StyleCategory.ACCESSORIES },
  { id: 'a_heart', label: 'Heart Shape', value: 'Heart shaped sunglasses', category: StyleCategory.ACCESSORIES },
  { id: 'a_star', label: 'Star Shape', value: 'Star shaped sunglasses', category: StyleCategory.ACCESSORIES },
  { id: 'a_flame', label: 'Flame Shape', value: 'Trendy flame shaped sunglasses', category: StyleCategory.ACCESSORIES },
  { id: 'a_pixel', label: '8-Bit Pixel', value: 'Black 8-bit pixel sunglasses', category: StyleCategory.ACCESSORIES },
  { id: 'a_steampunk', label: 'Steampunk', value: 'Brass steampunk goggles', category: StyleCategory.ACCESSORIES },
  { id: 'a_cyber_goggles', label: 'Cyber Goggles', value: 'Futuristic cyberpunk goggles', category: StyleCategory.ACCESSORIES },
  { id: 'a_ski_goggles', label: 'Ski Goggles', value: 'Reflective ski goggles', category: StyleCategory.ACCESSORIES },
  { id: 'a_visor', label: 'Sci-Fi Visor', value: 'Futuristic Cyberpunk LED Visor', category: StyleCategory.ACCESSORIES },
  { id: 'a_shutter', label: 'Shutter Shades', value: 'Kanye style shutter shades', category: StyleCategory.ACCESSORIES },
];

export const PIERCING_OPTIONS: StyleOption[] = [
  { id: 'a_nose_stud', label: 'Nose Stud', value: 'Small diamond nose stud', category: StyleCategory.ACCESSORIES },
  { id: 'a_nose_ring', label: 'Nose Hoop', value: 'Gold nose ring hoop', category: StyleCategory.ACCESSORIES },
  { id: 'a_septum', label: 'Septum', value: 'Silver septum clicker ring', category: StyleCategory.ACCESSORIES },
  { id: 'a_septum_gold', label: 'Gold Septum', value: 'Ornate gold septum ring', category: StyleCategory.ACCESSORIES },
  { id: 'a_bridge', label: 'Bridge', value: 'Bridge piercing across nose', category: StyleCategory.ACCESSORIES },
  { id: 'a_eyebrow', label: 'Eyebrow', value: 'Silver eyebrow barbell', category: StyleCategory.ACCESSORIES },
  { id: 'a_eyebrow_ring', label: 'Eyebrow Ring', value: 'Silver eyebrow ring', category: StyleCategory.ACCESSORIES },
  { id: 'a_anti_eyebrow', label: 'Anti-Eyebrow', value: 'Dermal piercing on cheekbone', category: StyleCategory.ACCESSORIES },
  { id: 'a_lip_side', label: 'Lip Ring', value: 'Side lip ring hoop', category: StyleCategory.ACCESSORIES },
  { id: 'a_labret', label: 'Labret', value: 'Center lip labret stud', category: StyleCategory.ACCESSORIES },
  { id: 'a_medusa', label: 'Medusa', value: 'Medusa piercing above lip', category: StyleCategory.ACCESSORIES },
  { id: 'a_monroe', label: 'Monroe', value: 'Monroe piercing above lip', category: StyleCategory.ACCESSORIES },
  { id: 'a_snakebites', label: 'Snake Bites', value: 'Snake bite lip piercings', category: StyleCategory.ACCESSORIES },
  { id: 'a_spiderbites', label: 'Spider Bites', value: 'Spider bite paired lip piercings', category: StyleCategory.ACCESSORIES },
  { id: 'a_dimple', label: 'Dimple', value: 'Cheek dimple piercings', category: StyleCategory.ACCESSORIES },
  { id: 'a_industrial', label: 'Industrial', value: 'Industrial ear bar piercing', category: StyleCategory.ACCESSORIES },
  { id: 'a_gauges', label: 'Stretched Ears', value: 'Stretched ear gauges/plugs', category: StyleCategory.ACCESSORIES },
  { id: 'a_tragus', label: 'Tragus', value: 'Tragus ear piercing', category: StyleCategory.ACCESSORIES },
  { id: 'a_multiple_ear', label: 'Stacked Ear', value: 'Multiple stacked ear piercings', category: StyleCategory.ACCESSORIES },
  // Ear Piercings & Earrings
  { id: 'a_lobe_stud', label: 'Lobe Studs', value: 'Classic diamond stud earrings', category: StyleCategory.ACCESSORIES },
  { id: 'a_lobe_hoop', label: 'Lobe Hoops', value: 'Gold hoop earrings', category: StyleCategory.ACCESSORIES },
  { id: 'a_huggie', label: 'Huggie Hoops', value: 'Small huggie hoop earrings', category: StyleCategory.ACCESSORIES },
  { id: 'a_ear_cuff', label: 'Ear Cuff', value: 'Trendy ear cuff jewelry', category: StyleCategory.ACCESSORIES },
  { id: 'a_dangly', label: 'Dangly Earrings', value: 'Long dangly statement earrings', category: StyleCategory.ACCESSORIES },
  { id: 'a_chandelier', label: 'Chandelier', value: 'Elegant chandelier drop earrings', category: StyleCategory.ACCESSORIES },
  { id: 'a_pearl_ear', label: 'Pearl Studs', value: 'Classic pearl stud earrings', category: StyleCategory.ACCESSORIES },
];

export const HEADWEAR_OPTIONS: StyleOption[] = [
  { id: 'a_cap', label: 'Baseball Cap', value: 'Classic baseball cap', category: StyleCategory.ACCESSORIES },
  { id: 'a_snapback', label: 'Snapback', value: 'Flat brim snapback hat', category: StyleCategory.ACCESSORIES },
  { id: 'a_beanie', label: 'Beanie', value: 'Knitted beanie hat', category: StyleCategory.ACCESSORIES },
  { id: 'a_bucket', label: 'Bucket Hat', value: 'Trendy bucket hat', category: StyleCategory.ACCESSORIES },
  { id: 'a_fedora', label: 'Fedora', value: 'Stylish fedora hat', category: StyleCategory.ACCESSORIES },
  { id: 'a_trilby', label: 'Trilby', value: 'Narrow brim trilby hat', category: StyleCategory.ACCESSORIES },
  { id: 'a_panama', label: 'Panama Hat', value: 'Classic Panama hat', category: StyleCategory.ACCESSORIES },
  { id: 'a_widebrim', label: 'Sun Hat', value: 'Wide brimmed straw sun hat', category: StyleCategory.ACCESSORIES },
  { id: 'a_beret', label: 'Beret', value: 'French artist beret', category: StyleCategory.ACCESSORIES },
  { id: 'a_newsboy', label: 'Newsboy', value: 'Vintage newsboy cap', category: StyleCategory.ACCESSORIES },
  { id: 'a_cowboy', label: 'Cowboy Hat', value: 'Western cowboy hat', category: StyleCategory.ACCESSORIES },
  { id: 'a_tophat', label: 'Top Hat', value: 'Formal top hat', category: StyleCategory.ACCESSORIES },
  { id: 'a_bandana', label: 'Bandana', value: 'Bandana tied as headband', category: StyleCategory.ACCESSORIES },
  { id: 'a_headband', label: 'Sport Headband', value: 'Sporty fabric headband', category: StyleCategory.ACCESSORIES },
  { id: 'a_hair_ribbon', label: 'Satin Ribbon', value: 'Satin hair ribbon bow', category: StyleCategory.ACCESSORIES },
  { id: 'a_clips', label: 'Hair Clips', value: '90s butterfly hair clips', category: StyleCategory.ACCESSORIES },
  { id: 'a_flower', label: 'Flower Crown', value: 'Boho flower crown', category: StyleCategory.ACCESSORIES },
  { id: 'a_tiara', label: 'Tiara', value: 'Sparkling crystal tiara', category: StyleCategory.ACCESSORIES },
  { id: 'a_crown_gold', label: 'Gold Crown', value: 'Medieval gold crown', category: StyleCategory.ACCESSORIES },
  { id: 'a_crown_dark', label: 'Dark Crown', value: 'Gothic black metal crown', category: StyleCategory.ACCESSORIES },
  { id: 'a_hijab', label: 'Hijab', value: 'Elegant hijab headscarf', category: StyleCategory.ACCESSORIES },
  { id: 'a_turban', label: 'Turban', value: 'Stylish turban wrap', category: StyleCategory.ACCESSORIES },
  { id: 'a_headphones_cat', label: 'Cat Ears HP', value: 'Gaming headphones with cat ears', category: StyleCategory.ACCESSORIES },
  { id: 'a_helmet_moto', label: 'Motorcycle Helmet', value: 'Open face motorcycle helmet', category: StyleCategory.ACCESSORIES },
  { id: 'a_bunny', label: 'Bunny Ears', value: 'Cute bunny ears headband', category: StyleCategory.ACCESSORIES },
  { id: 'a_halo', label: 'Halo', value: 'Angelic halo headpiece', category: StyleCategory.ACCESSORIES },
  { id: 'a_horns', label: 'Devil Horns', value: 'Small devil horns headband', category: StyleCategory.ACCESSORIES },
];

export const JEWELRY_OPTIONS: StyleOption[] = [
  { id: 'a_hoops', label: 'Large Hoops', value: 'Large gold hoop earrings', category: StyleCategory.ACCESSORIES },
  { id: 'a_hoops_silver', label: 'Silver Hoops', value: 'Thick silver hoop earrings', category: StyleCategory.ACCESSORIES },
  { id: 'a_studs', label: 'Diamond Studs', value: 'Classic diamond stud earrings', category: StyleCategory.ACCESSORIES },
  { id: 'a_pearl_ear', label: 'Pearl Earrings', value: 'Pearl drop earrings', category: StyleCategory.ACCESSORIES },
  { id: 'a_dangle', label: 'Chandelier', value: 'Crystal chandelier earrings', category: StyleCategory.ACCESSORIES },
  { id: 'a_cross', label: 'Cross Earrings', value: 'Dangling cross earrings', category: StyleCategory.ACCESSORIES },
  { id: 'a_safety', label: 'Safety Pin', value: 'Punk safety pin earrings', category: StyleCategory.ACCESSORIES },
  { id: 'a_choker', label: 'Velvet Choker', value: 'Black velvet choker necklace', category: StyleCategory.ACCESSORIES },
  { id: 'a_choker_spike', label: 'Spike Choker', value: 'Punk spiked leather choker', category: StyleCategory.ACCESSORIES },
  { id: 'a_goldchain', label: 'Gold Chain', value: 'Thick gold chain necklace', category: StyleCategory.ACCESSORIES },
  { id: 'a_silverchain', label: 'Silver Chain', value: 'Sterling silver curb chain', category: StyleCategory.ACCESSORIES },
  { id: 'a_layered', label: 'Layered Chains', value: 'Multiple layered gold necklaces', category: StyleCategory.ACCESSORIES },
  { id: 'a_locket', label: 'Locket', value: 'Vintage heart locket necklace', category: StyleCategory.ACCESSORIES },
  { id: 'a_pendant', label: 'Crystal Pendant', value: 'Large crystal pendant necklace', category: StyleCategory.ACCESSORIES },
  { id: 'a_pearls', label: 'Pearl Necklace', value: 'String of pearls necklace', category: StyleCategory.ACCESSORIES },
  { id: 'a_headphones', label: 'Headphones', value: 'Large over-ear headphones around neck', category: StyleCategory.ACCESSORIES },
  { id: 'a_earcuff', label: 'Ear Cuff', value: 'Ornate silver ear cuff', category: StyleCategory.ACCESSORIES },
  { id: 'a_shell', label: 'Shell Necklace', value: 'Puka shell necklace', category: StyleCategory.ACCESSORIES },
  { id: 'a_scarf', label: 'Silk Scarf', value: 'Elegant silk neck scarf', category: StyleCategory.ACCESSORIES },
  { id: 'a_bowtie', label: 'Bow Tie', value: 'Formal black bow tie', category: StyleCategory.ACCESSORIES },
];

export const FACE_EXTRAS_OPTIONS: StyleOption[] = [
  { id: 'a_freckles', label: 'Freckles', value: 'Dusted with natural freckles', category: StyleCategory.ACCESSORIES },
  { id: 'a_freckles_heart', label: 'Heart Freckles', value: 'Cute heart shaped faux freckles', category: StyleCategory.ACCESSORIES },
  { id: 'a_mole', label: 'Beauty Mark', value: 'Classic beauty mark mole', category: StyleCategory.ACCESSORIES },
  { id: 'a_facetattoo', label: 'Face Tattoo', value: 'Small artistic face tattoo near eye', category: StyleCategory.ACCESSORIES },
  { id: 'a_tattoo_neck', label: 'Neck Tattoo', value: 'Artistic ink tattoo on neck', category: StyleCategory.ACCESSORIES },
  { id: 'a_bindi', label: 'Bindi', value: 'Traditional forehead bindi', category: StyleCategory.ACCESSORIES },
  { id: 'a_gems', label: 'Face Gems', value: 'Rhinestone face gems', category: StyleCategory.ACCESSORIES },
  { id: 'a_glitter', label: 'Cheek Glitter', value: 'Glitter dusted on cheekbones', category: StyleCategory.ACCESSORIES },
  { id: 'a_scar', label: 'Eye Scar', value: 'Badass scar across eyebrow', category: StyleCategory.ACCESSORIES },
  { id: 'a_scar_cheek', label: 'Cheek Scar', value: 'Faint scar on cheek', category: StyleCategory.ACCESSORIES },
  { id: 'a_bandaid', label: 'Nose Band-Aid', value: 'Cute colorful band-aid on nose bridge', category: StyleCategory.ACCESSORIES },
  { id: 'a_bandaid_cheek', label: 'Cheek Band-Aid', value: 'Hello Kitty band-aid on cheek', category: StyleCategory.ACCESSORIES },
  { id: 'a_grillz', label: 'Gold Grillz', value: 'Gold teeth grillz', category: StyleCategory.ACCESSORIES },
  { id: 'a_silver_grillz', label: 'Silver Grillz', value: 'Silver diamond grillz', category: StyleCategory.ACCESSORIES },
  { id: 'a_vampire', label: 'Vampire Fangs', value: 'Subtle vampire fangs', category: StyleCategory.ACCESSORIES },
  { id: 'a_cyber_lines', label: 'Cyber Lines', value: 'Futuristic cyberpunk face panel lines', category: StyleCategory.ACCESSORIES },
  { id: 'a_robot_jaw', label: 'Cyborg Jaw', value: 'Metallic cyborg jaw piece', category: StyleCategory.ACCESSORIES },
  { id: 'a_mask_surgical', label: 'Black Mask', value: 'Black streetwear face mask', category: StyleCategory.ACCESSORIES },
];

// --- MAKEUP ---
export const MAKEUP_OPTIONS: StyleOption[] = [
  // Base Styles
  { id: 'm_none', label: 'No Makeup', value: 'Completely bare face no makeup', category: StyleCategory.MAKEUP },
  { id: 'm_natural', label: 'Clean Girl', value: 'Minimal "clean girl" aesthetic makeup', category: StyleCategory.MAKEUP },
  { id: 'm_dewy', label: 'Glass Skin', value: 'Dewy glass skin high-shine base', category: StyleCategory.MAKEUP },
  { id: 'm_matte', label: 'Full Matte', value: 'Flawless full-coverage matte foundation', category: StyleCategory.MAKEUP },
  { id: 'm_highlight', label: 'Strobing', value: 'Intense highlighter strobing effect', category: StyleCategory.MAKEUP },
  { id: 'm_contour', label: 'Heavy Contour', value: 'Sculpted heavy contour makeup', category: StyleCategory.MAKEUP },
  { id: 'm_softglam', label: 'Soft Glam', value: 'Soft glam bridal style makeup', category: StyleCategory.MAKEUP },
  { id: 'm_fullglam', label: 'Full Glam', value: 'Heavy contour and highlight full glam', category: StyleCategory.MAKEUP },
  { id: 'm_igari', label: 'Igari Blush', value: 'Igari style heavy blush under eyes', category: StyleCategory.MAKEUP },
  { id: 'm_sunkissed', label: 'Sun Kissed', value: 'Sun kissed burnt blush look', category: StyleCategory.MAKEUP },
  { id: 'm_vintage', label: 'Vintage 50s', value: 'Vintage 1950s pin-up makeup', category: StyleCategory.MAKEUP },
  { id: 'm_goth', label: 'Goth', value: 'Dark pale goth makeup', category: StyleCategory.MAKEUP },
  { id: 'm_grunge', label: '90s Grunge', value: 'Smudged messy 90s grunge makeup', category: StyleCategory.MAKEUP },
  { id: 'm_egirl', label: 'E-Girl', value: 'E-girl style with heavy blush on nose', category: StyleCategory.MAKEUP },
  { id: 'm_bronzed', label: 'Bronzed', value: 'Heavy bronzer sun-kissed look', category: StyleCategory.MAKEUP },
  { id: 'm_vampy', label: 'Vampy', value: 'Vampy style makeup', category: StyleCategory.MAKEUP },
  { id: 'm_avant', label: 'Avant-Garde', value: 'Artistic avant-garde high fashion makeup', category: StyleCategory.MAKEUP },
  { id: 'm_clown', label: 'Clown Core', value: 'Artistic cute clown makeup', category: StyleCategory.MAKEUP },
  { id: 'm_tribal', label: 'Tribal', value: 'Minimalist tribal face paint', category: StyleCategory.MAKEUP },
  { id: 'm_neon', label: 'Neon Lines', value: 'Futuristic neon lines makeup', category: StyleCategory.MAKEUP },
];

// --- LIPS ---
export const LIP_OPTIONS: StyleOption[] = [
  { id: 'l_nude', label: 'Matte Nude', value: 'Matte nude lipstick', category: StyleCategory.LIPS },
  { id: 'l_gloss', label: 'Clear Gloss', value: 'High shine clear lip gloss', category: StyleCategory.LIPS },
  { id: 'l_red', label: 'Classic Red', value: 'Classic bright red lipstick', category: StyleCategory.LIPS },
  { id: 'l_burgundy', label: 'Burgundy', value: 'Deep burgundy wine lipstick', category: StyleCategory.LIPS },
  { id: 'l_pink', label: 'Hot Pink', value: 'Bright hot pink lipstick', category: StyleCategory.LIPS },
  { id: 'l_black', label: 'Black', value: 'Jet black matte lipstick', category: StyleCategory.LIPS },
  { id: 'l_purple', label: 'Purple', value: 'Vibrant purple lipstick', category: StyleCategory.LIPS },
  { id: 'l_ombre', label: 'Ombre', value: 'Korean style gradient ombre lips', category: StyleCategory.LIPS },
  { id: 'l_lined', label: '90s Lined', value: '90s brown lip liner with lighter center', category: StyleCategory.LIPS },
  { id: 'l_glitter', label: 'Glitter', value: 'Sparkling glitter lips', category: StyleCategory.LIPS },
  { id: 'l_blue', label: 'Blue', value: 'Bold blue lipstick', category: StyleCategory.LIPS },
  { id: 'l_green', label: 'Green', value: 'Dark forest green lipstick', category: StyleCategory.LIPS },
];

// --- EYES ---
export const EYE_OPTIONS: StyleOption[] = [
  { id: 'e_natural', label: 'Mascara Only', value: 'Natural lashes with mascara only', category: StyleCategory.EYES },
  { id: 'e_falsies', label: 'False Lashes', value: 'Dramatic long false eyelashes', category: StyleCategory.EYES },
  { id: 'e_smokey', label: 'Classic Smokey', value: 'Black and grey smokey eye', category: StyleCategory.EYES },
  { id: 'e_smokey_brown', label: 'Brown Smokey', value: 'Warm brown matte smokey eye', category: StyleCategory.EYES },
  { id: 'e_cateye', label: 'Cat Eye Wing', value: 'Sharp black winged eyeliner', category: StyleCategory.EYES },
  { id: 'e_graphic', label: 'Graphic Liner', value: 'Geometric graphic eyeliner art', category: StyleCategory.EYES },
  { id: 'e_cutcrease', label: 'Cut Crease', value: 'Sharp cut crease eyeshadow', category: StyleCategory.EYES },
  { id: 'e_fox', label: 'Fox Eye', value: 'Lifted fox eye makeup look', category: StyleCategory.EYES },
  { id: 'e_siren', label: 'Siren Eye', value: 'Sultry elongated siren eye makeup', category: StyleCategory.EYES },
  { id: 'e_blue', label: 'Blue Shadow', value: 'Vibrant blue 80s eyeshadow', category: StyleCategory.EYES },
  { id: 'e_purple', label: 'Purple Haze', value: 'Purple eyeshadow blend', category: StyleCategory.EYES },
  { id: 'e_green', label: 'Emerald', value: 'Emerald green eyeshadow', category: StyleCategory.EYES },
  { id: 'e_gold', label: 'Gold Glitter', value: 'Heavy gold glitter on lids', category: StyleCategory.EYES },
  { id: 'e_glossy', label: 'Glossy Lids', value: 'Wet look glossy eyelids', category: StyleCategory.EYES },
  { id: 'e_white', label: 'White Liner', value: 'Trendy white graphic eyeliner', category: StyleCategory.EYES },
  { id: 'e_rhinestone', label: 'Rhinestone Eyes', value: 'Eyes embellished with rhinestones', category: StyleCategory.EYES },
  { id: 'e_contacts_blue', label: 'Blue Contacts', value: 'Bright blue colored contact lenses', category: StyleCategory.EYES },
  { id: 'e_contacts_green', label: 'Green Contacts', value: 'Vivid green colored contact lenses', category: StyleCategory.EYES },
  { id: 'e_contacts_purple', label: 'Purple Contacts', value: 'Mystical purple contact lenses', category: StyleCategory.EYES },
  { id: 'e_contacts_red', label: 'Red Contacts', value: 'Vampire red contact lenses', category: StyleCategory.EYES },
  { id: 'e_contacts_white', label: 'Whiteout Eyes', value: 'Spooky whiteout contact lenses', category: StyleCategory.EYES },
  { id: 'e_contacts_cat', label: 'Cat Eyes', value: 'Vertical slit cat eye contacts', category: StyleCategory.EYES },
];

// --- FACIAL HAIR (Fun for everyone!) ---
export const FACIAL_HAIR_OPTIONS: StyleOption[] = [
  // Clean
  { id: 'fh_none', label: 'Clean Shaven', value: 'Completely clean shaven face', category: StyleCategory.FACIAL_HAIR },
  
  // Stubble
  { id: 'fh_stubble_light', label: 'Light Stubble', value: '5 o\'clock shadow light stubble', category: StyleCategory.FACIAL_HAIR },
  { id: 'fh_stubble', label: 'Designer Stubble', value: 'Trimmed designer stubble beard', category: StyleCategory.FACIAL_HAIR },
  { id: 'fh_stubble_heavy', label: 'Heavy Stubble', value: 'Heavy 3-day stubble beard', category: StyleCategory.FACIAL_HAIR },
  
  // Mustaches
  { id: 'fh_stache_thin', label: 'Pencil Stache', value: 'Thin pencil mustache', category: StyleCategory.FACIAL_HAIR },
  { id: 'fh_stache_chevron', label: 'Chevron', value: 'Thick chevron mustache like Tom Selleck', category: StyleCategory.FACIAL_HAIR },
  { id: 'fh_stache_handlebar', label: 'Handlebar', value: 'Curled handlebar mustache', category: StyleCategory.FACIAL_HAIR },
  { id: 'fh_stache_horseshoe', label: 'Horseshoe', value: 'Horseshoe biker mustache', category: StyleCategory.FACIAL_HAIR },
  { id: 'fh_stache_walrus', label: 'Walrus', value: 'Thick bushy walrus mustache', category: StyleCategory.FACIAL_HAIR },
  { id: 'fh_stache_fu', label: 'Fu Manchu', value: 'Long droopy Fu Manchu mustache', category: StyleCategory.FACIAL_HAIR },
  { id: 'fh_stache_dali', label: 'Dali', value: 'Thin waxed Salvador Dali mustache with curled tips', category: StyleCategory.FACIAL_HAIR },
  
  // Beards - Short/Medium
  { id: 'fh_goatee', label: 'Goatee', value: 'Classic goatee beard', category: StyleCategory.FACIAL_HAIR },
  { id: 'fh_vandyke', label: 'Van Dyke', value: 'Van Dyke pointed goatee with separate mustache', category: StyleCategory.FACIAL_HAIR },
  { id: 'fh_anchor', label: 'Anchor', value: 'Anchor style pointed chin beard', category: StyleCategory.FACIAL_HAIR },
  { id: 'fh_circle', label: 'Circle Beard', value: 'Rounded circle beard goatee', category: StyleCategory.FACIAL_HAIR },
  { id: 'fh_chinstrap', label: 'Chinstrap', value: 'Thin chinstrap beard along jawline', category: StyleCategory.FACIAL_HAIR },
  { id: 'fh_short', label: 'Short Beard', value: 'Short trimmed full beard', category: StyleCategory.FACIAL_HAIR },
  { id: 'fh_boxed', label: 'Boxed Beard', value: 'Neatly shaped boxed beard', category: StyleCategory.FACIAL_HAIR },
  
  // Beards - Full/Long
  { id: 'fh_full', label: 'Full Beard', value: 'Natural full grown beard', category: StyleCategory.FACIAL_HAIR },
  { id: 'fh_yeard', label: 'Yeard', value: 'Long year-length full beard', category: StyleCategory.FACIAL_HAIR },
  { id: 'fh_wizard', label: 'Wizard Beard', value: 'Very long flowing wizard beard', category: StyleCategory.FACIAL_HAIR },
  { id: 'fh_viking_beard', label: 'Viking Beard', value: 'Wild braided viking warrior beard', category: StyleCategory.FACIAL_HAIR },
  { id: 'fh_lumberjack', label: 'Lumberjack', value: 'Thick bushy lumberjack beard', category: StyleCategory.FACIAL_HAIR },
  
  // Sideburns
  { id: 'fh_burns_mutton', label: 'Mutton Chops', value: 'Thick mutton chop sideburns', category: StyleCategory.FACIAL_HAIR },
  { id: 'fh_burns_lamb', label: 'Lamb Chops', value: 'Lamb chop sideburns without chin connection', category: StyleCategory.FACIAL_HAIR },
  { id: 'fh_burns_elvis', label: 'Elvis Burns', value: 'Classic Elvis style sideburns', category: StyleCategory.FACIAL_HAIR },
  { id: 'fh_burns_friendly', label: 'Friendly Chops', value: 'Friendly mutton chops connected to mustache', category: StyleCategory.FACIAL_HAIR },
  
  // Fun/Novelty
  { id: 'fh_soul_patch', label: 'Soul Patch', value: 'Small soul patch below lip', category: StyleCategory.FACIAL_HAIR },
  { id: 'fh_balbo', label: 'Balbo', value: 'Balbo beard style like Tony Stark', category: StyleCategory.FACIAL_HAIR },
  { id: 'fh_verdi', label: 'Verdi', value: 'Rounded full beard with styled mustache', category: StyleCategory.FACIAL_HAIR },
  { id: 'fh_ducktail', label: 'Ducktail', value: 'Full beard shaped to a point like a ducktail', category: StyleCategory.FACIAL_HAIR },
  { id: 'fh_santa', label: 'Santa Beard', value: 'Long fluffy white Santa Claus beard', category: StyleCategory.FACIAL_HAIR },
];