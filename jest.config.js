module.exports = {
    preset: 'react-native',
  
    // 1) Transformamos .js .jsx .ts .tsx y .mjs con babel-jest
    transform: {
      '^.+\\.(js|jsx|ts|tsx|mjs)$': 'babel-jest',
    },
  
    // 2) No ignoramos (i.e. sí transformamos) los módulos que listamos aquí:
    transformIgnorePatterns: [
      'node_modules/(?!(react-native|@react-native|react-native-modal|react-native-animatable|@react-native-async-storage|@react-navigation|expo|@unimodules|firebase|@firebase)/)',
    ],
  
    // 3) Setup global para mocks (no se trata como test)
    setupFiles: ['<rootDir>/jestSetup.js'],
  
    // 4) Matchers de Testing Library
    setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  
    // 5) Sólo archivos *.test.js en __tests__/
    testMatch: ['**/__tests__/**/*.test.js'],
  
    // 6) Reconoce también módulos .mjs
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'mjs'],
  };
  