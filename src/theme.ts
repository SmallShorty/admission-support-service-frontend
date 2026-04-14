import {
  createSystem,
  defineConfig,
  defaultConfig,
  defineRecipe,
} from "@chakra-ui/react";

const buttonRecipe = defineRecipe({
  base: {
    colorPalette: "teal",
  },
});

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        bg: {
          pure: { value: "#FFFFFF" },
          soft: { value: "#F9FBFB" },
          muted: { value: "#F0F4F4" },
        },
      },
    },
    semanticTokens: {
      colors: {
        mainBg: {
          value: {
            base: "{colors.bg.muted}",
            _dark: "{colors.gray.900}",
          },
        },
      },
    },
    breakpoints: {
      sm: "320px",
      md: "768px",
      lg: "960px",
      xl: "1200px",
    },
    recipes: {
      button: buttonRecipe,
    },
  },
});

export const system = createSystem(defaultConfig, config);
