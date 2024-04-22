import { Box, Group, Text, rem } from "@mantine/core";
import { Color } from "../../types/constant";

export type LegendSettings = {
  borderRadius: string;
  width: string;
  aspectRatio: string;
};

const renderLineLegend = ({ color, title }: LegendCardProps) => {
  return (
    <>
      <Box
        style={{
          borderRadius: "999px",
          width: rem(20),
          aspectRatio: 5,
          backgroundColor: color,
        }}
      />
      <Text size={rem(14)} fw={500} c={"rgb(17, 24, 39)"}>
        {title}
      </Text>
    </>
  );
};
const renderBarLegend = ({ color, title }: LegendCardProps) => {
  return (
    <>
      <Box
        style={{
          borderRadius: "2px",
          width: rem(10),
          aspectRatio: 1,
          backgroundColor: color,
        }}
      />
      <Text size={rem(14)} fw={500} c={"rgb(17, 24, 39)"}>
        {title}
      </Text>
    </>
  );
};
const renderCircleLegend = ({ color, title }: LegendCardProps) => {
  return (
    <>
      <Box
        style={{
          borderRadius: "999px",
          width: rem(10),
          aspectRatio: 1,
          backgroundColor: color,
        }}
      />
      <Text size={rem(14)} fw={500} c={"rgb(17, 24, 39)"}>
        {title}
      </Text>
    </>
  );
};

export const LEGEND_TYPES = {
  LINE: "line",
  BAR: "bar",
  CIRCLE: "circle",
};

const TYPE_MAPPING = {
  [LEGEND_TYPES.LINE]: renderLineLegend,
  [LEGEND_TYPES.BAR]: renderBarLegend,
  [LEGEND_TYPES.CIRCLE]: renderCircleLegend,
};

export type LegendCardProps = {
  color: Color;
  title: string;
  type: string;
};

const LegendCard = ({ color, title, type }: LegendCardProps) => {
  return (
    <Group gap={"sm"} align="center">
      {TYPE_MAPPING[type]({ color, title, type })}
    </Group>
  );
};

export default LegendCard;
