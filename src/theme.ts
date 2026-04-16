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

const cardRecipe = defineRecipe({
  base: {
    bg: "bg.panel",
    borderRadius: "xl",
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
    transition: "box-shadow 0.2s ease",
  },
  variants: {
    variant: {
      editable: {
        cursor: "pointer",
        _hover: {
          boxShadow: "0 4px 16px rgba(0,0,0,0.16)",
        },
      },
    },
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
      card: cardRecipe,
    },
  },
});

export const system = createSystem(defaultConfig, config);
