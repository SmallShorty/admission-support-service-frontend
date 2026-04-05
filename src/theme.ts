import { createSystem, defineConfig, defaultConfig } from "@chakra-ui/react";
const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: {
            value: "#e6f2ff",
          },
          500: {
            value: "#0078ff",
          },
          900: {
            value: "#003a80",
          },
        },
      },
    },
    semanticTokens: {
      colors: {
        mainBg: {
          value: {
            base: "{colors.white}",
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
  },
});
export const system = createSystem(defaultConfig, config);
