import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

const eslintConfig = [
  {
    ignores: ['.next/**', 'node_modules/**', 'sanity_ecommerce/**'],
  },
  ...nextCoreWebVitals,
];

export default eslintConfig;
