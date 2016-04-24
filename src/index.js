import THREE from 'three';

const HEX_COUNT = 40;
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

var scene;
var camera;
var light;
var renderer;

var hexes = []

init();
animate();

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(90, WIDTH / HEIGHT, 0.1, 1000);
  camera.position.set(0, 0, 960);
  scene.add(camera);

  camera.lookAt(new THREE.Vector3(0, 0, 0));
  camera.rotation.z += 0.1;

  light = new THREE.DirectionalLight(0xffffff);
  light.position.set(-200, 100, 1000);
  camera.add(light);

  scene.fog = new THREE.FogExp2(0x000000, 0.004);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setSize(WIDTH, HEIGHT);

  document.body.appendChild(renderer.domElement);

  for(let i = 0; i < HEX_COUNT; i++){
    let posX = randomize(-500, 500);
    let posY = randomize(-500, 500);
    let depth = 1000 / HEX_COUNT;
    let mesh = hex(posX, posY, randomize(0, 200), randomize(0, 10));
    mesh.position.z = depth * i;
    scene.add(mesh);
    hexes.push(mesh);
  }
}

function randomize(min = -1, max = 1) {
  let range = (max - min) / 2;
  let random = Math.random() - 0.5;
  return random * range;
}

function hex(x, y, r, l) {

  let hex = polyShape(x, y, 6, r);
  let hole = polyPath(x, y, 6, r * 0.9);
  hex.holes.push(hole);

  let extrudeSettings = {
    amount: r * l,
    bevelEnabled: false,
    material: 0,
    extrudeMaterial: 0
  };

  let geom = new THREE.ExtrudeGeometry(hex, extrudeSettings);
  let mesh = new THREE.MeshPhongMaterial({
    wireframe: true,
    emissive: 0xffffcc,
    emissiveIntensity: 0.2
  });
  return new THREE.Mesh(geom, mesh);
}


function polyShape(x, y, s, r) {
  let shape = new THREE.Shape();
  let angle = Math.PI / s * 2;

  for(let i = 0; i <= s; i++) {
    let px = x + Math.sin(angle * i) * r;
    let py = y + Math.cos(angle * i) * r;

    if(i === 0){
      shape.moveTo(px, py);
    } else {
      shape.lineTo(px, py);
    }
  }

  return shape;
}

function polyPath(x, y, s, r) {
  let angle = Math.PI / s * 2;
  let points = [];

  for(let i = 0; i <= s; i++) {
    let px = x + Math.sin(angle * i) * r;
    let py = y + Math.cos(angle * i) * r;

    points.push(new THREE.Vector2(px, py));
  }

  points = points.reverse();

  let path = new THREE.Path(points);

  return path;
}


function animate(now) {

  requestAnimationFrame(animate);

  light.intensity = Math.floor(randomize(0, 10));

  for(let i = 0; i < hexes.length; i++) {
    let hex = hexes[i];

    if(hex.position.z > 1000) {
      hex.position.z = 1;
      hex.position.x = randomize(-300, 300);
      hex.position.y = randomize(-300, 300);
    } else {
      hex.position.z += 1;
      hex.rotation.z += 0.0001;
    }
  }

  renderer.render(scene, camera);
}

