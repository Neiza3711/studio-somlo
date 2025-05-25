jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem:   jest.fn(() => Promise.resolve(null)),
    setItem:   jest.fn(() => Promise.resolve()),
    multiSet:  jest.fn(() => Promise.resolve()),
    clear:     jest.fn(() => Promise.resolve()),
  }));
  