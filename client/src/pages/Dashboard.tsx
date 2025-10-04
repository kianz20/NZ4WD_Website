import { useState } from "react";
import { Typography, Button, Menu, MenuItem, Box } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import GridLayout, { type Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { Header, Navbar, HeadlineBanner, InfoCard } from "../components";
import { useRequireAuth } from "../hooks";

// Define all possible cards outside the component
// This acts as the single source of truth for available cards.
const ALL_CARDS = [
  {
    id: "scheduled",
    title: "Scheduled Articles",
    defaultLayout: { i: "scheduled", x: 0, y: 0, w: 4, h: 2 },
  },
  {
    id: "analytics",
    title: "Analytics",
    defaultLayout: { i: "analytics", x: 4, y: 0, w: 4, h: 2 },
  },
  {
    id: "quickActions",
    title: "Quick Actions",
    defaultLayout: { i: "quickActions", x: 8, y: 0, w: 4, h: 2 },
  },
];

const Dashboard = () => {
  useRequireAuth();

  // --- State Management ---

  // State for which cards are visible
  const [visibleCards, setVisibleCards] = useState<string[]>(() => {
    const savedVisible = localStorage.getItem("dashboardVisibleCards");
    return savedVisible ? JSON.parse(savedVisible) : ALL_CARDS.map((c) => c.id);
  });

  // State for the layout of visible cards
  const [layout, setLayout] = useState<Layout[]>(() => {
    const savedLayout = localStorage.getItem("dashboardLayout");
    // Only load layouts for cards that are supposed to be visible
    const initialLayouts = savedLayout
      ? JSON.parse(savedLayout)
      : ALL_CARDS.map((c) => c.defaultLayout);
    return initialLayouts.filter((l: { i: string }) =>
      visibleCards.includes(l.i)
    );
  });

  // State for the "Add Card" menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  // --- Helper variables ---
  const hiddenCards = ALL_CARDS.filter(
    (card) => !visibleCards.includes(card.id)
  );

  // --- Event Handlers ---

  const handleLayoutChange = (newLayout: Layout[]) => {
    setLayout(newLayout);
    localStorage.setItem("dashboardLayout", JSON.stringify(newLayout));
  };

  const handleRemoveCard = (cardIdToRemove: string) => {
    console.log(cardIdToRemove);
    // Remove from visible list
    const newVisibleCards = visibleCards.filter((id) => id !== cardIdToRemove);
    setVisibleCards(newVisibleCards);
    localStorage.setItem(
      "dashboardVisibleCards",
      JSON.stringify(newVisibleCards)
    );

    // Remove from layout
    const newLayout = layout.filter((l) => l.i !== cardIdToRemove);
    setLayout(newLayout);
    localStorage.setItem("dashboardLayout", JSON.stringify(newLayout));
  };

  const handleAddCard = (cardToAdd: (typeof ALL_CARDS)[0]) => {
    // Add to visible list
    const newVisibleCards = [...visibleCards, cardToAdd.id];
    setVisibleCards(newVisibleCards);
    localStorage.setItem(
      "dashboardVisibleCards",
      JSON.stringify(newVisibleCards)
    );

    // Add its default layout to the layout state
    const newLayout = [...layout, cardToAdd.defaultLayout];
    setLayout(newLayout);
    localStorage.setItem("dashboardLayout", JSON.stringify(newLayout));

    handleMenuClose();
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Header />
      <Navbar />
      <HeadlineBanner />

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4" component="h1">
          Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleMenuClick}
          disabled={hiddenCards.length === 0}
        >
          Add Card
        </Button>
        <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose}>
          {hiddenCards.map((card) => (
            <MenuItem key={card.id} onClick={() => handleAddCard(card)}>
              {card.title}
            </MenuItem>
          ))}
        </Menu>
      </Box>

      <GridLayout
        className="layout"
        layout={layout}
        cols={12}
        rowHeight={150}
        width={2000}
        onLayoutChange={handleLayoutChange}
      >
        {ALL_CARDS.filter((card) => visibleCards.includes(card.id)).map(
          (card) => (
            <div key={card.id}>
              {/* Assuming InfoCard can take a custom action component */}
              <InfoCard title={card.title}>
                <>
                  <Button
                    onClick={() => handleRemoveCard(card.id)}
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    Remove From Dash
                  </Button>
                </>
              </InfoCard>
            </div>
          )
        )}
      </GridLayout>
    </>
  );
};

export default Dashboard;
