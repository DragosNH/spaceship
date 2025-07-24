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


  const windShieldGeo = new THREE.CapsuleGeometry( 1, 1, 4, 8 );
  const windShieldMat = new THREE.MeshBasicMaterial({ color: 0x00aa00 });
  const windShield = new THREE.Mesh(windShieldGeo, windShieldMat);
  windShield.rotation.x += 4.80

  //Scenes
  scene.add(plane);
  scene.add(windShield);



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
        windShield.rotation.y -= 0.1;
        break;
      case "ArrowRight":
        windShield.rotation.y += 0.1;
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
