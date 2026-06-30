// Type-only re-export. Metro resolves the platform-specific variant
// (.ios.tsx / .android.tsx / .web.tsx) at runtime; this file exists only
// so TypeScript can resolve the bare `@/components/KeyboardSafeView/KeyboardSafeView`
// import path used by consumers.
export { KeyboardSafeView } from "./KeyboardSafeView.web";
