import { Badge } from "@chakra-ui/react";

export const RoleBadge = ({ role }: { role: string }) => {
  const configs: Record<string, { color: string; label: string }> = {
    Admin: { color: "orange", label: "Админ" },
    "Senior Op": { color: "purple", label: "Старший оп." },
    Operator: { color: "blue", label: "Оператор" },
    Applicant: { color: "teal", label: "Абитуриент" },
  };

  const config = configs[role] || { color: "gray", label: role };

  return (
    <Badge
      colorPalette={config.color}
      variant="outline"
      size="md"
      borderRadius="md"
    >
      {config.label}
    </Badge>
  );
};
