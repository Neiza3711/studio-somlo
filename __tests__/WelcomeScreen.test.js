// __tests__/WelcomeScreen.test.js
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { act } from 'react-test-renderer';
import WelcomeScreen from '../src/screens/WelcomeScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../src/i18n';

// 1) Hacemos que Jest controle los timers
jest.useFakeTimers();

// 2) Mocks globales
jest.mock('@react-native-async-storage/async-storage');
jest.mock('../src/i18n', () => ({
  // simulamos el objeto default con changeLanguage
  changeLanguage: jest.fn(() => Promise.resolve()),
}));
jest.mock('react-i18next', () => ({
  // devolvemos un useTranslation que siempre nos dé t()==key
  useTranslation: () => ({ t: (key) => key }),
}));

describe('WelcomeScreen', () => {
  const navigation = { replace: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe mostrar el modal tras 3s y permitir seleccionar idioma', async () => {
    const { queryByText, getByText } = render(
      <WelcomeScreen navigation={navigation} />
    );

    // Al inicio no existe la opción
    expect(queryByText('Español')).toBeNull();

    // 3s pasan dentro de act() para lanzar la actualización de estado
    await act(async () => {
      jest.advanceTimersByTime(3000);
    });

    // Ahora el modal está visible
    expect(getByText('Español')).toBeTruthy();
    expect(getByText('English')).toBeTruthy();

    // Disparamos el onPress dentro de act() para esperar su lógica asíncrona
    await act(async () => {
      fireEvent.press(getByText('Español'));
    });

    // Y comprobamos las llamadas
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('user-language', 'es');
    expect(i18n.changeLanguage).toHaveBeenCalledWith('es');
    expect(navigation.replace).toHaveBeenCalledWith('Auth');
  });
});
