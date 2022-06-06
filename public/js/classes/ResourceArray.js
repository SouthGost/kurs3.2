import Resource from "./Resource.js";

const resourceArray =  [
    new Resource("Земля", "ground", "ground.glb", -20, [0.4, 0.2, 0]),
    new Resource("Обогащенная земля", "jewel_ground", "jewel_ground.glb", 50, [0.2, 0.1, 0.05]),
    new Resource("Гравий", "gravy", "gravy.glb", -10, [0.3, 0.5, 0.5]),
    new Resource("Обогащенный гравий", "jewel_gravy", "jewel_gravy.glb", 200, [0.1, 0.2, 0.45]),
    new Resource("Золото", "gold", "gold.glb", 500, [0, 0, 0]),
];

export default resourceArray;