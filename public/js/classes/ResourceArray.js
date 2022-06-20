import Resource from "./Resource.js";

const resourceArray =  [
    /*0*/new Resource("Земля", "ground.glb", -30, [0.2, 0, 0]),
    /*1*/new Resource("Камень", "gravy.glb", -15, [0.3, 0.55, 0.915]),
    /*2*/new Resource("Уголь", "coal.glb", 10, [0.2, 0, 0]),
    /*3*/new Resource("Необработанное жлезо", "iron.glb", 5, [0.15, 0, 0]),
    /*4*/new Resource("Железо", null, 100, [0, 0, 0]),
    /*5*/new Resource("Необработанная медь", "copper.glb", 5, [0.15, 0, 0]),
    /*6*/new Resource("Медь", null, 50, [0, 0, 0]),

    /*7*/new Resource("Сера", "sulfur.glb", 15, [0, 0.2, 0]),
    /*8*/new Resource("Необработанный мрамор", "marble.glb", 5, [0, 0.2, 0]),
    /*9*/new Resource("Мрамор", null, 30, [0, 0, 0]),
    /*10*/new Resource("Необработанный никель", "nickel.glb", 10, [0, 0.05, 0]),
    /*11*/new Resource("Никель", null, 190, [0, 0, 0]),

    /*12*/new Resource("Рубин", "ruby.glb", 3000, [0, 0, 0.005]),
    /*13*/new Resource("Необработанное золото", "gold.glb", 20, [0, 0, 0.05]),
    /*14*/new Resource("Золото", null, 250, [0, 0, 0]),
    /*15*/new Resource("Необработанный вольфрам", "tungsten.glb", 20, [0, 0, 0.03]),
    /*16*/new Resource("Вольфрам", null, 300, [0, 0, 0]),
];

export default resourceArray;