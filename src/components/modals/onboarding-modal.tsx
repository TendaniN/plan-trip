import { Modal, Text, List, Stack } from "@mantine/core";
import { Button } from "components";

interface Props {
  opened: boolean;
  onClose: () => void;
}

export const OnboardingModal = ({ opened, onClose }: Props) => {
  return (
    <Modal opened={opened} onClose={onClose} title="Welcome 👋" centered>
      <Stack gap="md">
        <Text>Here’s how to plan your trip from start to finish:</Text>

        <List>
          <List.Item>Create a trip with dates and a city</List.Item>
          <List.Item>Add locations and accommodation</List.Item>
          <List.Item>Plan daily activities</List.Item>
          <List.Item>Review your budget</List.Item>
          <List.Item>Export everything when ready</List.Item>
        </List>

        <Text c="dimmed" size="sm">
          You can reopen this guide anytime from the Help page.
        </Text>

        <Button onClick={onClose} fullWidth>
          Get started
        </Button>
      </Stack>
    </Modal>
  );
};
