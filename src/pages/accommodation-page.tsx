import {
  ActionIcon,
  Box,
  Collapse,
  Container,
  Flex,
  Title,
  Text,
} from "@mantine/core";
import { Breadcrumbs } from "components";
import { FaHouse, FaPlus, FaMinus } from "react-icons/fa6";
import { useParams } from "react-router-dom";
import { ALL_HOTELS } from "constants/hotels";
import { useState } from "react";
import { useDBStore } from "db/store";

const getColumnStyle = (last = false) => {
  return {
    borderBottom: "1px solid #000",
    borderRight: last ? "" : "1px solid #000",
    textTransform: "capitalize",
    padding: "8px 16px",
    display: "flex",
  };
};

const GridHeader = [
  {
    id: "index",
    style: getColumnStyle(),
    label: "",
  },
  {
    id: "name",
    style: getColumnStyle(),
    label: "Name",
  },
  {
    id: "area",
    style: getColumnStyle(),
    label: "Area",
  },
  {
    id: "room",
    style: getColumnStyle(),
    label: "Room",
  },
  {
    id: "cost",
    style: getColumnStyle(),
    label: "Cost (per night)",
  },
  {
    id: "link",
    style: getColumnStyle(),
    label: "Link",
  },
  {
    id: "link",
    style: getColumnStyle(true),
    label: "",
  },
];

const AccommodationPage = () => {
  const { city } = useParams();
  const [selectedCollapse, setSelectedCollapse] = useState<string | null>(null);

  const { currency, rate } = useDBStore((state) => state);

  if (!city) {
    return null;
  }

  const getHotels = () => {
    const hotels = ALL_HOTELS.find(({ type }) => type === city);
    if (hotels) {
      return hotels.hotels;
    }
    return [];
  };

  return (
    <Container py={12} px={24} h="calc(100vh - 60px)" m={0} maw="100%">
      <Breadcrumbs
        items={[
          { title: "Home", to: "/", icon: <FaHouse /> },
          { title: "Cities", to: "/city" },
          { title: city, to: `/city/${city}` },
        ]}
      />
      <Flex direction="column" gap="xl">
        <Box>
          <Flex justify="space-between">
            <Title tt="capitalize">{`${city} Accommodations`}</Title>
          </Flex>
        </Box>
        <Box>
          <Flex
            bg="primary.3"
            bd="6px solid #000"
            bdrs={12}
            w="100%"
            direction="column"
          >
            <Box
              display="grid"
              w="100%"
              bg="#fff"
              style={{
                gridTemplateColumns: "5% 18% 18% 18% 18% 18% 5%",
              }}
            >
              {GridHeader.map(({ id, label, style }) => (
                <Box key={`table-header-${id}`} style={style} fw={600}>
                  {label}
                </Box>
              ))}
            </Box>
            {getHotels()
              .sort((a, b) => a.stars - b.stars)
              .map(({ id, name, area, price, link, room }, index) => (
                <>
                  <Box
                    key={`table-row-${id}`}
                    display="grid"
                    w="100%"
                    fz="sm"
                    bg={index % 2 === 0 ? "purple.2" : "blue.2"}
                    style={{
                      gridTemplateColumns: "5% 18% 18% 18% 18% 18% 5%",
                    }}
                  >
                    <Box style={getColumnStyle()}>
                      <Text size="sm" mt="0.5rem">
                        {index + 1}
                      </Text>
                    </Box>
                    <Box style={getColumnStyle()}>
                      <Text size="sm" mt="0.5rem">
                        {name}
                      </Text>
                    </Box>
                    <Box style={getColumnStyle()}>
                      <Text size="sm" mt="0.5rem">
                        {area ? area : "-"}
                      </Text>
                    </Box>
                    <Box style={getColumnStyle()}>
                      <Text size="sm" mt="0.5rem">
                        {room.title}
                      </Text>
                    </Box>
                    <Box style={getColumnStyle()}>
                      <Text size="sm" mt="0.5rem">
                        {`${currency} ${Math.round(price * rate * 100) / 100}`}
                      </Text>
                    </Box>
                    <Box style={getColumnStyle()}>
                      <Text size="sm" mt="0.5rem">
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
                      </Text>
                    </Box>
                    <Box
                      style={{
                        borderBottom: "1px solid #000",
                        borderRight: "1px solid #000",
                        padding: "8px",
                      }}
                    >
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
                        {selectedCollapse === id ? <FaMinus /> : <FaPlus />}
                      </ActionIcon>
                    </Box>
                  </Box>
                  <Collapse
                    in={selectedCollapse === id}
                    p={12}
                    fz="sm"
                    bg="primary.1"
                  ></Collapse>
                </>
              ))}
          </Flex>
        </Box>
      </Flex>
    </Container>
  );
};

export default AccommodationPage;
