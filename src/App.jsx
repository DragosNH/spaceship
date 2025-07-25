import './App.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function App() {

  // Scene added
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);


  // Renderer
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  camera.position.z = 5;

  const controls = new OrbitControls(camera, renderer.domElement);

  // Shapes
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
  const windShieldGeo = new THREE.CapsuleGeometry( 0.4, 0.3, 32, 32 );
  const windShieldMat = new THREE.MeshBasicMaterial({ color: 0x333333 });
  const windShield = new THREE.Mesh(windShieldGeo, windShieldMat);
  windShield.rotation.x += 4.80;
  windShield.rotation.z += 4.79;

  // Main Body
  const mainBodyGeo = new THREE.CapsuleGeometry( 0.8, 1.5, 1, 10 );
  const mainBodyMat = new THREE.MeshBasicMaterial({
    color: 0xf5f5f
  });
  const mainBody = new THREE.Mesh(mainBodyGeo, mainBodyMat);
  mainBody.rotation.x += 4.80;
  mainBody.position.y -= 0.6;

  // Wings
  const wingGeo = new THREE.BoxGeometry(1.5, 0.2, 0.9);
  const wingMat = new THREE.MeshBasicMaterial({
    color: 0xf5f5f
  });
  const leftWing = new THREE.Mesh(wingGeo, wingMat);
  leftWing.position.x -= 1
  leftWing.position.y -= 0.5
  const rightWing = new THREE.Mesh(wingGeo, wingMat);
  rightWing.position.x += 1
  rightWing.position.y -= 0.5

  // Engines
  const engineGeo = new THREE.ConeGeometry(0.3 , 0.4, 32);
  const engineMat = new THREE.MeshBasicMaterial({
    color: 0xf6f6f
  })
  const leftEngine = new THREE.Mesh(engineGeo,engineMat)
  leftEngine.position.z += 1.2;
  leftEngine.rotation.x += 4.80;
  leftEngine.position.y -= 1;
  leftEngine.position.x -= 0.4;
  const rightEngine = new THREE.Mesh(engineGeo,engineMat)
  rightEngine.position.z += 1.2;
  rightEngine.rotation.x += 4.80;
  rightEngine.position.y -= 1;
  rightEngine.position.x += 0.4;


  //Scenes
  // scene.add(plane);
  scene.add(windShield);
  scene.add(mainBody);
  scene.add(leftWing);
  scene.add(rightWing);
  scene.add(leftEngine);
  scene.add(rightEngine);



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
        windShield.position.z -= 0.1;
        console.log("Up Key pressed")
        break;
      case "ArrowDown":
        windShield.position.z += 0.1;
        break;
      case "ArrowLeft":
        windShield.rotation.z -= 0.1;
        break;
      case "ArrowRight":
        windShield.rotation.z += 0.1;
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
