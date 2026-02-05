// Mock expo-linking
jest.mock("expo-linking", () => ({
  parse: jest.fn((url) => {
    const urlObj = new URL(url, "http://localhost");
    const queryParams = {};
    urlObj.searchParams.forEach((value, key) => {
      queryParams[key] = value;
    });
    return { queryParams };
  }),
  addEventListener: jest.fn(() => ({ remove: jest.fn() })),
  getInitialURL: jest.fn(() => Promise.resolve(null)),
}));

// Mock expo-web-browser
jest.mock("expo-web-browser", () => ({
  openAuthSessionAsync: jest.fn(),
  openBrowserAsync: jest.fn(),
}));

// Mock expo-router
jest.mock("expo-router", () => {
  const { Text, Pressable } = require("react-native");
  return {
    router: {
      replace: jest.fn(),
    },
    Link: ({ children, onPress, ...props }) => (
      <Pressable onPress={(e) => onPress?.({ ...e, preventDefault: jest.fn() })} {...props}>
        <Text>{children}</Text>
      </Pressable>
    ),
  };
});

// Mock expo-secure-store
jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn().mockResolvedValue(null),
  setItemAsync: jest.fn().mockResolvedValue(undefined),
  deleteItemAsync: jest.fn().mockResolvedValue(undefined),
}));

// Mock expo-device
jest.mock("expo-device", () => ({
  isDevice: false,
}));

// Mock @tanstack/react-query
jest.mock("@tanstack/react-query", () => ({
  useQueryClient: jest.fn(() => ({
    clear: jest.fn(),
  })),
  QueryClient: jest.fn(),
  QueryClientProvider: ({ children }) => children,
}));

// Global mocks
global.__DEV__ = true;
