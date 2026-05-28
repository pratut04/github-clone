import HeatMap from "@uiw/react-heat-map";

const HeatMapProfile = () => {

  const value = [
    { date: "2025-01-01", count: 2 },
    { date: "2025-01-02", count: 6 },
    { date: "2025-01-03", count: 12 },
    { date: "2025-01-04", count: 4 },
    { date: "2025-01-05", count: 9 },
    { date: "2025-01-06", count: 16 },
  ];

  return (
    <div>

      <h2
        style={{
          marginBottom: "20px",
        }}
      >
        Contribution Activity
      </h2>

      <HeatMap
        value={value}
        width={900}
        rectSize={16}
        space={5}
        startDate={
          new Date("2025-01-01")
        }
        panelColors={{
          0: "#161b22",
          2: "#0e4429",
          4: "#006d32",
          10: "#26a641",
          20: "#39d353",
        }}
      />

    </div>
  );
};

export default HeatMapProfile;