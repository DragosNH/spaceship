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

  // camera.position.z = 7;

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
  const accelerationLeft = new THREE.Mesh(accelerationGeo, accelerationMat);
  accelerationLeft.position.z += 1.5;
  accelerationLeft.position.y -= 1;
  accelerationLeft.position.x -= 0.4;
  const accelerationRight = new THREE.Mesh(accelerationGeo, accelerationMat);
  accelerationRight.position.z += 1.5;
  accelerationRight.position.y -= 1;
  accelerationRight.position.x += 0.4;

  // Light emmision
  // Left
  const accelerationLightLeft = new THREE.PointLight(0xffff00, 80, 10);
  accelerationLightLeft.position.z += 1.6;
  accelerationLightLeft.position.y -= 1;
  accelerationLightLeft.position.x -= 0.4;
  // Right
  const accelerationLightRight = new THREE.PointLight(0xffff00, 80, 10);
  accelerationLightRight.position.z += 1.6;
  accelerationLightRight.position.y -= 1;
  accelerationLightRight.position.x += 0.4;

  // meteorites
  let meteorites = []

  for (let i = 0; i < 10000; i++) {
    const radius = Math.random() * 3 + 0.5;
    const meteorGeo = new THREE.SphereGeometry(radius, 32, 16);
    const meteorMat = new THREE.MeshBasicMaterial({ color: 0xa5a5a5 });

    const meteor = new THREE.Mesh(meteorGeo, meteorMat);

    meteor.position.set(
      (Math.random() - 0.5) * 1000,
      (Math.random() - 0.5) * 1000,
      Math.random() * -2000 - 10
    );

    scene.add(meteor);
    meteorites.push(meteor);
  }

  //Group
  const spaceship = new THREE.Group();
  spaceship.add(windShield);
  spaceship.add(mainBody);
  spaceship.add(leftWing);
  spaceship.add(rightWing);
  spaceship.add(leftEngine);
  spaceship.add(rightEngine);
  spaceship.add(accelerationLightLeft);
  spaceship.add(accelerationLightRight);
  spaceship.add(accelerationLeft);
  spaceship.add(accelerationRight);

  // Add to scene
  scene.add(plane);
  scene.add(spaceship);




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
        spaceship.position.y += 0.1;
        break;
      case "ArrowDown":
        spaceship.position.y -= 0.1;
        break;
      case "ArrowLeft":
        if (spaceship.rotation.z < 0.5) {
          spaceship.rotation.z += 0.1;
        }
        spaceship.position.x -= 0.1;
        break;
      case "ArrowRight":
        if (spaceship.rotation.z > -0.5) {
          spaceship.rotation.z -= 0.1;
        }
        spaceship.position.x += 0.1;
        break;
    }
  })

  function animate() {

    spaceship.position.z -= 0.1;

    const relativeCameraOffset = new THREE.Vector3(0, 2, 6);

    const cameraOffset = relativeCameraOffset.clone().applyMatrix4(spaceship.matrixWorld);

    camera.position.lerp(cameraOffset, 0.1);

    camera.lookAt(spaceship.position);

    renderer.render(scene, camera);
  }
  renderer.setAnimationLoop(animate);

}

export default App
