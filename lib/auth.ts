import * as SecureStore from 'expo-secure-store';

const PIN_KEY = 'user_pin_code';

export async function hasPin(): Promise<boolean> {
  try {
    const pin = await SecureStore.getItemAsync(PIN_KEY);
    return pin !== null;
  } catch (e) {
    return false;
  }
}

export async function savePin(pin: string): Promise<void> {
  await SecureStore.setItemAsync(PIN_KEY, pin);
}

export async function verifyPin(pin: string): Promise<boolean> {
  const storedPin = await SecureStore.getItemAsync(PIN_KEY);
  return storedPin === pin;
}

export async function removePin(): Promise<void> {
  await SecureStore.deleteItemAsync(PIN_KEY);
}
