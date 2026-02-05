import { memo } from "react";
import type { FC } from "react";
import { Text } from "@/components/Themed/Themed";
import type { MonoTextProps } from "@/types/components";

const MonoTextComponent: FC<MonoTextProps> = (props) => {
  return <Text {...props} style={[props.style, { fontFamily: "SpaceMono" }]} />;
};

export const MonoText = memo(MonoTextComponent);
