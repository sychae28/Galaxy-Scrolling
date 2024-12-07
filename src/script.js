import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Textures
const textureLoader = new THREE.TextureLoader();
const loader = new GLTFLoader();

const doorHorrorTexture = textureLoader.load('/textures/door/horror.avif');
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg');
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg');
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg');
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg');

// Bricks Textures
const bricksColorTexture = textureLoader.load('/textures/bricks/color1.jpg');
const bricksAmbientOcclusionTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg');
const bricksNormalTexture = textureLoader.load('/textures/bricks/normal.jpg');
const bricksRoughnessTexture = textureLoader.load('/textures/bricks/roughness.jpg');

// House container
const house = new THREE.Group();
scene.add(house);

// Walls
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({
        map: bricksColorTexture,
        aoMap: bricksAmbientOcclusionTexture,
        normalMap: bricksNormalTexture,
        roughnessMap: bricksRoughnessTexture,
    })
);
walls.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
);
walls.position.y = 1.25;
house.add(walls);

// Roof
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1, 4),
    new THREE.MeshStandardMaterial({ color: '#131412' })
);
roof.rotation.y = Math.PI * 0.25;
roof.position.y = 3;
house.add(roof);

// Door
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2, 100, 100),
    new THREE.MeshStandardMaterial({
        map: doorHorrorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.1,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture,
    })
);
door.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
);
door.position.y = 1;
door.position.z = 2.05; 
house.add(door);

// Door Light
const doorLight = new THREE.PointLight('#ff7d46', 2, 7);
doorLight.position.set(0, 2.2, 2.7);
house.add(doorLight);


//Graves
const graves = new THREE.Group();
scene.add(graves);

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: '#999090' });

for (let i = 0; i < 50; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 3 + Math.random() * 6;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;

    const grave = new THREE.Mesh(graveGeometry, graveMaterial);
    grave.position.set(x, 0.4, z);
    grave.rotation.z = (Math.random() - 0.5) * 0.4;
    grave.rotation.y = (Math.random() - 0.5) * 0.4;
    grave.castShadow = true;

    graves.add(grave);
}


//Fog
const fog = new THREE.Fog('#262837', 1, 30);
scene.fog = fog;

//Lights
const ambientLight = new THREE.AmbientLight('#ffffff', 0.5);
scene.add(ambientLight);

const moonLight = new THREE.DirectionalLight('#ffffff', 0.5);
moonLight.position.set(6, 5, -3);
moonLight.castShadow = true;
scene.add(moonLight);

// GUI controls for Moon Light
const moonLightFolder = gui.addFolder('Moon Light');
moonLightFolder.add(moonLight, 'intensity').min(0).max(2).step(0.01);
moonLightFolder.add(moonLight.position, 'x').min(-10).max(10).step(0.1);
moonLightFolder.add(moonLight.position, 'y').min(-10).max(10).step(0.1);
moonLightFolder.add(moonLight.position, 'z').min(-10).max(10).step(0.1);


//Grass Textures
const grassColorTexture = textureLoader.load('/textures/grass/roughness.jpg');
const grassAmbientOcclusionTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg');
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg');
const grassRoughnessTexture = textureLoader.load('/textures/grass/roughness.jpg');

//Floor Texture
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({
        map: grassColorTexture,
        aoMap: grassAmbientOcclusionTexture,
        normalMap: grassNormalTexture,
        roughnessMap: grassRoughnessTexture,
        side: THREE.DoubleSide
    })
);

floor.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
);

floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;
floor.receiveShadow = true;
scene.add(floor);

//Bush Models
loader.load('textures/tree_scan_free/scene.gltf', (gltf) => {
    const bush1 = gltf.scene;
    bush1.scale.set(0.1, 0.1, 0.1);  
    bush1.position.set(5, 1.8, -3.2);  
    console.log(bush1);
    bush1.castShadow = true
    house.add(bush1);
});

loader.load('textures/tree_scan_free/scene.gltf', (gltf) => {
    const bush2 = gltf.scene;
    bush2.scale.set(0.1, 0.1, 0.1);  
    bush2.position.set(-3, 1.8, 3.2);  
    console.log(bush2);
    bush2.castShadow = true
    house.add(bush2);
});


//Camera
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(4, 2, 5);
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Ghosts
const ghost1 = new THREE.PointLight('#ff00ff', 2, 3)
scene.add(ghost1)
const ghost2 = new THREE.PointLight('#00ffff', 2, 3)
scene.add(ghost2)
const ghost3 = new THREE.PointLight('#ffff00', 2, 3)
scene.add(ghost3)

const clock = new THREE.Clock();
const tick = () => {
    const elapsedTime = clock.getElapsedTime();

const ghost1Angle = elapsedTime * 0.5;
ghost1.position.x = Math.cos(ghost1Angle) * 4;
ghost1.position.z = Math.sin(ghost1Angle) * 4;
ghost1.position.y = Math.sin(elapsedTime * 3);

const ghost2Angle = -elapsedTime * 0.32;
ghost2.position.x = Math.cos(ghost2Angle) * 5;
ghost2.position.z = Math.sin(ghost2Angle) * 5;
ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);
    
const ghost3Angle = -elapsedTime * 0.18;
ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));
ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

controls.update();
renderer.render(scene, camera);

window.requestAnimationFrame(tick);
};


//Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor('#262837');
renderer.shadowMap.enabled = true; // Enable shadows
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.shadowMap.enabled = true;

//Resize Handling
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

tick();
