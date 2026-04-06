import {
  ActionIcon,
  Box,
  Collapse,
  Container,
  Flex,
  Title,
  Text,
  Loader,
  Table,
} from "@mantine/core";
import { Breadcrumbs } from "components";
import { FaHouse, FaPlus, FaMinus } from "react-icons/fa6";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Hotel } from "types";
import { searchHotels } from "api/hotel";
import logger from "utils/logger";
import { AccommodationTableHeader } from "constants/headers";

const AccommodationPage = () => {
  const { city } = useParams();
  const [selectedCollapse, setSelectedCollapse] = useState<string | null>(null);
  const [loadingHotels, setLoadingHotels] = useState(false);
  const [hotelOptions, setHotelOptions] = useState<
    { value: string; label: string; hotel: Hotel }[]
  >([]);

  useEffect(() => {
    const loadHotels = async () => {
      if (!city) return;

      setLoadingHotels(true);

      try {
        const { combined } = await searchHotels(city);

        setHotelOptions(
          combined.map((hotel) => ({
            value: hotel.placeId,
            label: `${hotel.name} (${hotel.rating ?? "-"}⭐)`,
            hotel,
          })),
        );
      } catch (err) {
        logger.error("Failed to load hotels", err);
      }

      setLoadingHotels(false);
    };

    loadHotels();
  }, [city]);

  if (!city) {
    return null;
  }

  return (
    <Container py={12} px={24} h="calc(100vh - 60px)" m={0} maw="100%">
      <Breadcrumbs
        items={[
          { title: "Home", to: "/", icon: <FaHouse /> },
          { title: "Cities", to: "/city" },
          { title: city, to: `/city/${city}` },
        ]}
      />
      {loadingHotels ? (
        <Loader type="" />
      ) : (
        <Flex direction="column" gap="xl">
          <Box>
            <Flex justify="space-between">
              <Title tt="capitalize">{`${city} Accommodations`}</Title>
            </Flex>
          </Box>
          <Table
            bg="primary.3"
            bd="6px solid #000"
            bdrs={12}
            w="100%"
            layout="fixed"
            borderColor="#000"
            withRowBorders
            withColumnBorders
          >
            <Table.Thead>
              <Table.Tr bg="#fff">
                {AccommodationTableHeader.map(({ id, label }) => (
                  <Table.Th key={`table-header-${id}`} fw={600}>
                    {label}
                  </Table.Th>
                ))}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {hotelOptions
                .sort((a, b) => a.hotel.reviewCount - b.hotel.reviewCount)
                .map(
                  (
                    { hotel: { id, link, name, rating, description } },
                    index,
                  ) => (
                    <>
                      <Table.Tr
                        key={`table-row-${id}`}
                        bg={index % 2 === 0 ? "purple.2" : "blue.2"}
                      >
                        <Table.Td tt="capitalize" fz="sm" mt="0.5rem">
                          {index + 1}
                        </Table.Td>
                        <Table.Td tt="capitalize" fz="sm" mt="0.5rem">
                          {name}
                        </Table.Td>
                        <Table.Td tt="capitalize" fz="sm" mt="0.5rem">
                          {rating}
                        </Table.Td>
                        <Table.Td tt="capitalize" fz="sm" mt="0.5rem">
                          <span
                            style={{
                              wordBreak: "break-all",
                              width: "88%",
                              lineHeight: 1.5,
                              height: 26,
                              overflow: "clip",
                              margin: "auto 0",
                            }}
                          >
                            {link}
                          </span>
                        </Table.Td>
                        <Table.Td tt="capitalize" fz="sm" mt="0.5rem">
                          {description && (
                            <ActionIcon
                              variant="light"
                              color="blue.9"
                              mt="0.5rem"
                              onClick={() =>
                                setSelectedCollapse(
                                  selectedCollapse === id ? null : id,
                                )
                              }
                            >
                              {selectedCollapse === id ? (
                                <FaMinus />
                              ) : (
                                <FaPlus />
                              )}
                            </ActionIcon>
                          )}
                        </Table.Td>
                      </Table.Tr>
                      <Collapse
                        in={selectedCollapse === id}
                        p={12}
                        fz="sm"
                        bg="primary.1"
                      >
                        <Box p={8}>
                          <Text
                            size="sm"
                            mt="0.5rem"
                            styles={{
                              root: {
                                cursor: "pointer",
                                display: "flex",
                                gap: "0.5rem",
                                "&:hover": {
                                  textDecoration: "underline",
                                },
                              },
                            }}
                          >
                            {description}
                          </Text>
                        </Box>
                      </Collapse>
                    </>
                  ),
                )}
            </Table.Tbody>
          </Table>
        </Flex>
      )}
    </Container>
  );
};

export default AccommodationPage;
