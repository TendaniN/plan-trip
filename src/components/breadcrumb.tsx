import { Link } from "react-router-dom";
import { Breadcrumbs as BaseBreadcrumbs, Flex, Anchor } from "@mantine/core";
import { type ReactNode } from "react";

interface ItemProps {
  title: string;
  to: string;
  icon?: ReactNode;
}

export const Breadcrumbs = ({ items }: { items: ItemProps[] }) => (
  <BaseBreadcrumbs>
    {items.map(({ title, to, icon }, idx) => (
      <Anchor key={`breadcrumb-${idx}`} component={Link} to={to} fz="xs">
        <Flex gap={4} my="auto">
          {icon}
          {title}
        </Flex>
      </Anchor>
    ))}
  </BaseBreadcrumbs>
);
