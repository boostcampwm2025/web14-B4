const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
  rules: {
      // 추가 커스터마이징
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
  },
};

export default config;
