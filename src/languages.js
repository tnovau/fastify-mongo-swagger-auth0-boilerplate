const languages = [
  {
    id: 'en-GB',
    iso_code_lang: 'en',
    iso_code_country: 'GB',
  },
  {
    id: 'es-ES',
    iso_code_lang: 'es',
    iso_code_country: 'ES',
  },
];

export const getLanguagesIds = () => languages.map(({ id }) => id);

export default languages;
