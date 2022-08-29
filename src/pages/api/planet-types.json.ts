const PLANETS = [
  {
    id: "mt",
    title: "Multiple Terrain",
  },
  {
    id: "fw",
    title: "Forest & Wilderness",
  },
];

export async function get() {
  return {
    body: JSON.stringify(PLANETS),
  };
}
