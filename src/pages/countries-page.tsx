import {
  Box,
  Container,
  Flex,
  Image,
  SimpleGrid,
  Title,
  Text,
  ScrollArea,
  Collapse,
  ActionIcon,
} from "@mantine/core";
import { Breadcrumbs } from "components";
import { FaHouse, FaPlus, FaMinus } from "react-icons/fa6";
import { CITY_MAP } from "constants/city";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const CountriesPage = () => {
  const { hash } = useLocation();
  const [selectedCollapse, setSelectedCollapse] = useState<string | null>(null);

  useEffect(() => {
    if (hash !== "") {
      setSelectedCollapse(decodeURIComponent(hash.replaceAll("#", "")));
    }
  }, [hash]);

  return (
    <Container py={12} px={24} h="calc(100vh - 60px)" m={0} maw="100%">
      <Breadcrumbs
        items={[
          { title: "Home", to: "/", icon: <FaHouse /> },
          { title: "Cities", to: "/city" },
        ]}
      />
      <Flex direction="column" gap="xl">
        <Box>
          <Flex justify="space-between">
            <Title>Cities</Title>
          </Flex>
        </Box>
        <ScrollArea
          offsetScrollbars
          type="auto"
          h={800}
          scrollbarSize={12}
          px="lg"
          overscrollBehavior="contain"
        >
          <Flex direction="column" gap="1.5rem">
            {CITY_MAP.map(({ country, cities }) => (
              <Flex
                key={`${country}-section`}
                direction="column"
                p={12}
                bg="blue.2"
                bdrs={12}
                bd="4px solid #000"
              >
                <Title
                  order={3}
                  tt="capitalize"
                  id={country}
                  display="flex"
                  w="100%"
                  style={{
                    gap: "1rem",
                    justifyContent: "space-between",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    setSelectedCollapse(
                      selectedCollapse === country ? null : country,
                    )
                  }
                >
                  {country}
                  <ActionIcon variant="filled" color="primary.5" my="auto">
                    {selectedCollapse === country ? <FaMinus /> : <FaPlus />}
                  </ActionIcon>
                </Title>
                <Collapse
                  in={selectedCollapse === country}
                  p={16}
                  fz="sm"
                  bdrs={12}
                >
                  <SimpleGrid cols={3} spacing="xs">
                    {cities.map((city) => (
                      <Link
                        style={{
                          position: "relative",
                        }}
                        to={`/country/${city}/accommodation`}
                        key={`country-${country}-city-${city}`}
                      >
                        <Image
                          radius="md"
                          src={`src/assets/${city}.jpg`}
                          mah={245}
                          loading="lazy"
                          styles={{
                            root: {
                              border: "4px solid transparent",

                              "&:hover": {
                                border:
                                  "4px solid var(--mantine-color-secondary-3)",
                              },
                            },
                          }}
                        />
                        <Text
                          tt="capitalize"
                          pos="absolute"
                          left={4}
                          top={4}
                          px={16}
                          py={8}
                          bdrs="md"
                          bd="1px solid #000"
                          bg="secondary.2"
                          c="#000"
                        >
                          {city}
                        </Text>
                      </Link>
                    ))}
                  </SimpleGrid>
                </Collapse>
              </Flex>
            ))}
          </Flex>
        </ScrollArea>
      </Flex>
    </Container>
  );
};

export default CountriesPage;
