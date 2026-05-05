import { Badge } from "@chakra-ui/react";

interface PriorityBadgeProps {
  value: number;
}

const getPriorityPalette = (val: number) => {
  if (val >= 85) return "red";
  if (val >= 70) return "orange";
  if (val >= 40) return "yellow";
  return "teal";
};

export const PriorityBadge = ({ value }: PriorityBadgeProps) => (
  <Badge
    variant="solid"
    colorPalette={getPriorityPalette(value)}
    size="sm"
    borderRadius="md"
    minW="6"
    display="inline-flex"
    alignItems="center"
    justifyContent="center"
    textAlign="center"
  >
    {value}
  </Badge>
);
