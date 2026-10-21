import {
  Archivo,
  Barlow,
  Barlow_Condensed,
  Bricolage_Grotesque,
  DM_Sans,
  Fraunces,
  Manrope,
  Oswald,
  Rubik,
  Space_Grotesk,
} from 'next/font/google';

const oswald = Oswald({ subsets: ['latin'], variable: '--sf-oswald', display: 'swap' });
const barlow = Barlow({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--sf-barlow', display: 'swap' });
const barlowCondensed = Barlow_Condensed({ subsets: ['latin'], weight: ['600', '700', '800'], variable: '--sf-barlow-condensed', display: 'swap' });
const manrope = Manrope({ subsets: ['latin'], variable: '--sf-manrope', display: 'swap' });
const archivo = Archivo({ subsets: ['latin'], variable: '--sf-archivo', display: 'swap' });
const fraunces = Fraunces({ subsets: ['latin'], variable: '--sf-fraunces', display: 'swap' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--sf-space-grotesk', display: 'swap' });
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--sf-dm-sans', display: 'swap' });
const rubik = Rubik({ subsets: ['latin'], variable: '--sf-rubik', display: 'swap' });
const bricolage = Bricolage_Grotesque({ subsets: ['latin'], variable: '--sf-bricolage', display: 'swap' });

/** Classes à poser sur la racine d'un site pour rendre toutes les polices disponibles */
export const siteFontClasses = [
  oswald,
  barlow,
  barlowCondensed,
  manrope,
  archivo,
  fraunces,
  spaceGrotesk,
  dmSans,
  rubik,
  bricolage,
]
  .map((f) => f.variable)
  .join(' ');
