import { Box, Group, Text, rem } from "@mantine/core";
import { Color } from "../../types/constant";

export type LegendCardProps = {
  color: Color;
  title: string;
  type: "line" | "bar";
};

const LegendCard = ({ color, title, type }: LegendCardProps) => {
  return (
    <Group gap={"sm"}>
      <Box
        style={{
          borderRadius: type == "line" ? "999px" : "2px",
          width: type == "line" ? rem(20) : rem(10),
          aspectRatio: type == "line" ? 5 : 1,
          backgroundColor: color,
        }}
      />
      <Text size={rem(14)} fw={500} c={"rgb(17, 24, 39)"}>
        {title}
      </Text>
    </Group>
  );
};

export default LegendCard;
