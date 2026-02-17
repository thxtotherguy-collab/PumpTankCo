const PRODUCTS = {
  pumps: [
    {
      id: "booster-075",
      name: "Booster / Pressure Pump 0.75kW",
      category: "Booster",
      use: ["Home pressure", "Small irrigation"],
      flow_lpm: 40,
      head_m: 35,
      power_kw: 0.75,
      price: null,
      note: "Great for boosting municipal or tank-fed pressure."
    },
    {
      id: "selfprim-110",
      name: "Self-Priming Pump 1.1kW",
      category: "Self-priming",
      use: ["Water transfer", "Irrigation"],
      flow_lpm: 60,
      head_m: 45,
      power_kw: 1.1,
      price: null,
      note: "Reliable transfer pump; ideal where suction lift is needed."
    },
    {
      id: "submersible-1100",
      name: "Submersible / Borehole Pump 1.1kW",
      category: "Submersible",
      use: ["Borehole", "Filling tanks", "Irrigation"],
      flow_lpm: 55,
      head_m: 70,
      power_kw: 1.1,
      price: null,
      note: "For boreholes; match to borehole diameter + depth."
    }
  ],
  tanks: [
    {
      id: "tank-2500v",
      name: "Vertical Water Tank 2500L",
      category: "Vertical",
      litres: 2500,
      material: "UV-stabilised polyethylene",
      price: null,
      note: "Popular home backup size."
    },
    {
      id: "tank-5000v",
      name: "Vertical Water Tank 5000L",
      category: "Vertical",
      litres: 5000,
      material: "UV-stabilised polyethylene",
      price: null,
      note: "Good for irrigation + backup supply."
    },
    {
      id: "tank-2000slim",
      name: "Slimline Tank 2000L",
      category: "Slimline",
      litres: 2000,
      material: "UV-stabilised polyethylene",
      price: null,
      note: "Fits tight side passages."
    }
  ]
};
