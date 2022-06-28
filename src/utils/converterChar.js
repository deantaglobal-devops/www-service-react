export default function converter(targetString) {
  let result = targetString;
  result = result.replaceAll('Á¯¿½', '€');
  result = result.replaceAll('Ã–z', 'Ö');
  result = result.replaceAll('Ã¼', 'ü');
  result = result.replaceAll('â€"', '–');
  result = result.replaceAll('â€“', '–');
  result = result.replaceAll('â€', '"');
  result = result.replaceAll('â€¢', '-');
  result = result.replaceAll('â€œ', '"');
  result = result.replaceAll('Â¡', '¡');
  result = result.replaceAll('Â¢', '¢');
  result = result.replaceAll('Â£', '£');
  result = result.replaceAll('Â¤', '¤');
  result = result.replaceAll('Â¥', '¥');
  result = result.replaceAll('Â¦', '¦');
  result = result.replaceAll('Â§', '§');
  result = result.replaceAll('Â¨', '¨');
  result = result.replaceAll('Â©', '©');
  result = result.replaceAll('Âª', 'ª');
  result = result.replaceAll('Â«', '«');
  result = result.replaceAll('Â¬', '¬');
  // This one looks like it's missing a character, but it's there. 0xad
  result = result.replaceAll('Â', '');
  result = result.replaceAll('Â®', '®');
  result = result.replaceAll('Â¯', '¯');
  result = result.replaceAll('Â°', '°');
  result = result.replaceAll('Â±', '±');
  result = result.replaceAll('Â²', '²');
  result = result.replaceAll('Â³', '³');
  result = result.replaceAll('Â´', '´');
  result = result.replaceAll('Âµ', 'µ');
  result = result.replaceAll('Â¶', '¶');
  result = result.replaceAll('Â·', '·');
  result = result.replaceAll('Â¸', '¸');
  result = result.replaceAll('Â¹', '¹');
  result = result.replaceAll('Âº', 'º');
  result = result.replaceAll('Â»', '»');
  result = result.replaceAll('Â¼', '¼');
  result = result.replaceAll('Â½', '½');
  result = result.replaceAll('Â¾', '¾');
  result = result.replaceAll('Â¿', '¿');
  result = result.replaceAll('Ã€', 'À');
  // This one looks like it's missing a character, but it's there. 0x81
  result = result.replaceAll('Ã', 'Á');
  result = result.replaceAll('Ã‚', 'Â');
  result = result.replaceAll('Ãƒ', 'Ã');
  result = result.replaceAll('Ã„', 'Ä');
  result = result.replaceAll('Ã…', 'Å');
  result = result.replaceAll('Ã†', 'Æ');
  result = result.replaceAll('Ã‡', 'Ç');
  result = result.replaceAll('Ãˆ', 'È');
  result = result.replaceAll('Ã‰', 'É');
  result = result.replaceAll('ÃŠ', 'Ê');
  result = result.replaceAll('Ã‹', 'Ë');
  result = result.replaceAll('ÃŒ', 'Ì');
  // This one looks like it's missing a character, but it's there. 0x8d
  result = result.replaceAll('Ã', 'Í');
  result = result.replaceAll('ÃŽ', 'Î');
  // This one looks like it's missing a character, but it's there. 0x8f
  result = result.replaceAll('Ã', 'Ï');
  // This one looks like it's missing a character, but it's there. 0x90
  result = result.replaceAll('Ã', 'Ð');
  result = result.replaceAll("Ã'", 'Ñ');
  result = result.replaceAll(`Ã\'`, 'Ò');
  result = result.replaceAll(`Ã"`, 'Ó');
  result = result.replaceAll('Ã"', 'Ô');
  result = result.replaceAll('Ã•', 'Õ');
  result = result.replaceAll('Ã–', 'Ö');
  result = result.replaceAll('Ã—', '×');
  result = result.replaceAll('Ã˜', 'Ø');
  result = result.replaceAll('Ã™', 'Ù');
  result = result.replaceAll('Ãš', 'Ú');
  result = result.replaceAll('Ã›', 'Û');
  result = result.replaceAll('Ãœ', 'Ü');
  // This one looks like it's missing a character, but it's there. 0x9d
  result = result.replaceAll('Ã', 'Ý');
  result = result.replaceAll('Ãž', 'Þ');
  result = result.replaceAll('ÃŸ', 'ß');
  result = result.replaceAll('Ã ', 'à');
  result = result.replaceAll('Ã¡', 'á');
  result = result.replaceAll('Ã¢', 'â');
  result = result.replaceAll('Ã£', 'ã');
  result = result.replaceAll('Ã¤', 'ä');
  result = result.replaceAll('Ã¥', 'å');
  result = result.replaceAll('Ã¦', 'æ');
  result = result.replaceAll('Ã§', 'ç');
  result = result.replaceAll('Ã¨', 'è');
  result = result.replaceAll('Ã©', 'é');
  result = result.replaceAll('Ãª', 'ê');
  result = result.replaceAll('Ã«', 'ë');
  result = result.replaceAll('Ã¬', 'ì');
  // This one looks like it's missing a character, but it's there. 0xad
  result = result.replaceAll('Ã', 'í');
  result = result.replaceAll('Ã®', 'î');
  result = result.replaceAll('Ã¯', 'ï');
  result = result.replaceAll('Ã°', 'ð');
  result = result.replaceAll('Ã±', 'ñ');
  result = result.replaceAll('Ã²', 'ò');
  result = result.replaceAll('Ã³', 'ó');
  result = result.replaceAll('Ã´', 'ô');
  result = result.replaceAll('Ãµ', 'õ');
  result = result.replaceAll('Ã¶', 'ö');
  result = result.replaceAll('Ã·', '÷');
  result = result.replaceAll('Ã¸', 'ø');
  result = result.replaceAll('Ã¹', 'ù');
  result = result.replaceAll('Ãº', 'ú');
  result = result.replaceAll('Ã»', 'û');
  result = result.replaceAll('Ã¼', 'ü');
  result = result.replaceAll('Ã½', 'ý');
  result = result.replaceAll('Ã¾', 'þ');
  result = result.replaceAll('Ã¿', 'ÿ');
  // rogue chars
  result = result.replaceAll('Î¿', 'o');
  result = result.replaceAll('Î¹', 'i');
  result = result.replaceAll('Á§', 'ç');

  return result;
}
