import './App.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js';
import { PMREMGenerator } from 'three';

function App() {

  // Scene added
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);


  // Renderer
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  camera.position.z = 7;

  // ------ Background ------
  const loader = new EXRLoader();
  loader.load('src/textures/nightsky.exr', function (texture) {
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    const envMap = pmremGenerator.fromEquirectangular(texture).texture;

    scene.environment = envMap;

    // Display backgorund image
    // scene.background = envMap;

    texture.dispose();
    pmremGenerator.dispose();

    render();
  });

  const controls = new OrbitControls(camera, renderer.domElement);

  // ------ Lights ------
  // --- Ambient Light ---
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  // --- Directional light ---
  const directionalLight = new THREE.DirectionalLight(0xffffff, 10);
  directionalLight.position.x += 3.5;

  scene.add(ambientLight)
  scene.add(directionalLight);

  // ------ Shapes ------
  const planeGeo = new THREE.PlaneGeometry(10, 10);
  const planeMat = new THREE.MeshBasicMaterial(
    {
      color: 0xad6242,
      side: THREE.DoubleSide
    }
  );
  const plane = new THREE.Mesh(planeGeo, planeMat);
  plane.rotation.x = 4.7
  plane.position.y = -1

  // Windshield
  const windShieldGeo = new THREE.CapsuleGeometry(0.4, 0.3, 32, 32);
  const windShieldMat = new THREE.MeshPhysicalMaterial({
    color: 0x333333,
    opacity: 0.8,
    transparent: true,
    roughness: 0.1,
    metalness: 0.5,
    reflectivity: 1,
  });
  const windShield = new THREE.Mesh(windShieldGeo, windShieldMat);
  windShield.rotation.x += 4.80;
  windShield.rotation.z += 4.79;

  // Main Body
  const mainBodyGeo = new THREE.CapsuleGeometry(0.8, 1.5, 1, 10);
  const mainBodyMat = new THREE.MeshPhysicalMaterial({
    color: 0xf5f5f,
    roughness: 0.1,
    metalness: 0.5,
    reflectivity: 1,
  });
  const mainBody = new THREE.Mesh(mainBodyGeo, mainBodyMat);
  mainBody.rotation.x += 4.80;
  mainBody.position.y -= 0.6;

  // Wings
  const wingGeo = new THREE.BoxGeometry(1.5, 0.2, 0.9);
  const wingMat = new THREE.MeshPhysicalMaterial({
    color: 0xf5f5f,
    roughness: 0.1,
    metalness: 0.5,
    reflectivity: 1,
  });
  const leftWing = new THREE.Mesh(wingGeo, wingMat);
  leftWing.position.x -= 1
  leftWing.position.y -= 0.5
  const rightWing = new THREE.Mesh(wingGeo, wingMat);
  rightWing.position.x += 1
  rightWing.position.y -= 0.5

  // Engines
  const engineGeo = new THREE.ConeGeometry(0.3, 0.4, 32);
  const engineMat = new THREE.MeshPhysicalMaterial({
    color: 0xf5f5f,
    roughness: 0.1,
    metalness: 0.5,
    reflectivity: 1,
  });
  const leftEngine = new THREE.Mesh(engineGeo, engineMat)
  leftEngine.position.z += 1.2;
  leftEngine.rotation.x += 4.80;
  leftEngine.position.y -= 1;
  leftEngine.position.x -= 0.4;
  const rightEngine = new THREE.Mesh(engineGeo, engineMat)
  rightEngine.position.z += 1.2;
  rightEngine.rotation.x += 4.80;
  rightEngine.position.y -= 1;
  rightEngine.position.x += 0.4;

  // Engines acceleration 
  const accelerationGeo = new THREE.SphereGeometry(0.2, 32, 16);
  const accelerationMat = new THREE.MeshStandardMaterial({
      color: 0xffff52,
      emissive: 0xffff00,
      emissiveIntensity: 50
  });
  const acceleration = new THREE.Mesh(accelerationGeo,accelerationMat);
  acceleration.position.z += 1.5;
  acceleration.position.y -= 1;
  acceleration.position.x -= 0.4;

  // Light emmision
  const accelerationLight = new THREE.PointLight(0xffff00, 80, 10);
  accelerationLight.position.z += 1.6;
  accelerationLight.position.y -= 1;
  accelerationLight.position.x -= 0.4;
  scene.add(accelerationLight);

  //Group
  const spaceship = new THREE.Group();
  spaceship.add(windShield);
  spaceship.add(mainBody);
  spaceship.add(leftWing);
  spaceship.add(rightWing);
  spaceship.add(leftEngine);
  spaceship.add(rightEngine);

  // Add to scene
  // scene.add(plane);
  scene.add(spaceship);
  scene.add(acceleration)



  // Responsive design
  window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
  });


  document.body.addEventListener('keydown', function (e) {
    const key = e.key;
    switch (key) {
      case "ArrowUp":
        spaceship.position.z -= 0.1;
        console.log("Up Key pressed")
        break;
      case "ArrowDown":
        spaceship.position.z += 0.1;
        break;
      case "ArrowLeft":
        spaceship.rotation.z -= 0.1;
        break;
      case "ArrowRight":
        spaceship.rotation.z += 0.1;
        break;
    }
  })

  function animate() {

    controls.update();

    renderer.render(scene, camera);
  }
  renderer.setAnimationLoop(animate);

}

export default App
