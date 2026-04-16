import { Box, useRecipe } from "@chakra-ui/react";
import type { BoxProps } from "@chakra-ui/react";
import { forwardRef } from "react";

interface PanelProps extends BoxProps {
  variant?: "editable";
}

export const Panel = forwardRef<HTMLDivElement, PanelProps>(
  function Panel({ variant, ...props }, ref) {
    const recipe = useRecipe({ key: "card" });
    const styles = recipe({ variant });
    return <Box ref={ref} css={styles} {...props} />;
  }
);
