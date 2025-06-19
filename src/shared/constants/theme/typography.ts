import AffixLightOtf from '~/assets/fonts/Affix/Affix-Light.otf';
import AffixLight from '~/assets/fonts/Affix/Affix-Light.woff2';
import AffixLightItalicOtf from '~/assets/fonts/Affix/Affix-LightItalic.otf';
import AffixLightItalic from '~/assets/fonts/Affix/Affix-LightItalic.woff2';
import AffixMediumOtf from '~/assets/fonts/Affix/Affix-Medium.otf';
import AffixMedium from '~/assets/fonts/Affix/Affix-Medium.woff2';
import AffixMediumItalicOtf from '~/assets/fonts/Affix/Affix-MediumItalic.otf';
import AffixMediumItalic from '~/assets/fonts/Affix/Affix-MediumItalic.woff2';
import LatoBlack from '~/assets/fonts/Lato/Lato-Black.ttf';
import LatoBlackItalic from '~/assets/fonts/Lato/Lato-BlackItalic.ttf';
import LatoItalic from '~/assets/fonts/Lato/Lato-Italic.ttf';
import LatoRegular from '~/assets/fonts/Lato/Lato-Regular.ttf';
import ModeratBold from '~/assets/fonts/Moderat/Moderat-Bold.woff';
import ModeratBold2 from '~/assets/fonts/Moderat/Moderat-Bold.woff2';
import ModeratRegular from '~/assets/fonts/Moderat/Moderat-Regular.woff';
import ModeratRegular2 from '~/assets/fonts/Moderat/Moderat-Regular.woff2';

export const typography = `
@font-face {
	font-family: 'Affix';
	font-style: normal;
	font-weight: 300;
	src: url(${AffixLight}) format('woff2'), url(${AffixLightOtf}) format('opentype')
}
@font-face {
	font-family: 'Affix';
	font-style: italic;
	font-weight: 300;
	src: url(${AffixLightItalic}) format('woff2'), url(${AffixLightItalicOtf}) format('opentype')
}
@font-face {
  font-family: 'Affix';
  font-style: normal;
  font-weight: 500;
  src: url(${AffixMedium}) format('woff2'), url(${AffixMediumOtf}) format('opentype')
}
@font-face {
  font-family: 'Affix';
  font-style: italic;
  font-weight: 500;
  src: url(${AffixMediumItalic}) format('woff2'), url(${AffixMediumItalicOtf}) format('opentype')
}
@font-face {
	font-family: 'Moderat';
	font-style: normal;
	font-weight: 400;
	src: url(${ModeratRegular}) format('woff'), url(${ModeratRegular2}) format('woff2')
}
@font-face {
  font-family: 'Moderat';
  font-style: normal;
  font-weight: 700;
  src: url(${ModeratBold}) format('woff'), url(${ModeratBold2}) format('woff2')
}
@font-face {
  font-family: 'Lato';
  font-style: normal;
  font-weight: 400;
  src: url(${LatoRegular}) format('truetype');
	font-display: swap;
  unicode-range: U+0370-03FF;
}
@font-face {
  font-family: 'Lato';
  font-style: italic;
  font-weight: 400;
  src: url(${LatoItalic}) format('truetype');
	font-display: swap;
  unicode-range: U+0370-03FF;
}
@font-face {
  font-family: 'Lato';
  font-style: normal;
  font-weight: 700;
  src: url(${LatoBlack}) format('truetype');
	font-display: swap;
  unicode-range: U+0370-03FF;
}
@font-face {
  font-family: 'Lato';
  font-style: italic;
  font-weight: 700;
  src: url(${LatoBlackItalic}) format('truetype');
	font-display: swap; 
  unicode-range: U+0370-03FF;
}
`;
