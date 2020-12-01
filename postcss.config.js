const purgecss = [
    '@fullhuman/postcss-purgecss',
    {
      content: ['./components/**/*.js', './components/**/*.tsx', './pages/**/*.js'],
      defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
    },
];
module.exports = {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    }
};
