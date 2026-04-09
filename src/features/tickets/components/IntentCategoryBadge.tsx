import { Badge, BadgeProps, HStack, Icon, Text } from "@chakra-ui/react";
import { Tag } from "lucide-react";
import { INTENT_METADATA } from "../model/intentMetadata";
import { AdmissionIntentCategory } from "../model/types";

interface IntentCategoryBadgeProps extends BadgeProps {
  category: AdmissionIntentCategory;
  showIcon?: boolean;
}

export const IntentCategoryBadge = ({
  category,
  showIcon = false,
  ...props
}: IntentCategoryBadgeProps) => {
  const metadata = INTENT_METADATA[category];
  if (!metadata) return null;
  return (
    <Badge
      variant="subtle"
      size="sm"
      px="2"
      py="0.5"
      borderRadius="md"
      textTransform="none"
      fontWeight="medium"
      css={{
        bg: `${metadata.color}15`,
        color: metadata.color,
        borderColor: `${metadata.color}30`,
        borderWidth: "1px",
      }}
      {...props}
    >
      <HStack gap="1">
        {showIcon && (
          <Icon asChild>
            <Tag size="10px" />
          </Icon>
        )}
        <Text as="span" fontSize="11px">
          {metadata.label}
        </Text>
      </HStack>
    </Badge>
  );
};
