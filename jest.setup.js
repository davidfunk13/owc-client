jest.mock("react-native-reanimated", () => ({}));

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

jest.mock("expo-web-browser", () => ({
  openAuthSessionAsync: jest.fn(),
  openBrowserAsync: jest.fn(),
}));

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

jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn().mockResolvedValue(null),
  setItemAsync: jest.fn().mockResolvedValue(undefined),
  deleteItemAsync: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("expo-device", () => ({
  isDevice: false,
}));

jest.mock("expo-image", () => {
  const { View } = require("react-native");
  const React = require("react");
  return {
    Image: ({ source, accessibilityLabel, contentFit, transition, placeholder, ...rest }) => {
      const uri = typeof source === "object" && source !== null ? source.uri : source;
      return React.createElement(View, {
        accessibilityLabel,
        accessibilityRole: "image",
        ...rest,
        "data-source-uri": uri,
      });
    },
  };
});

require("react-native-gesture-handler/jestSetup");

global.__DEV__ = true;
