import "./style.css";
import * as THREE from "three";

import debounce from "lodash.debounce";
import { Color, Loader, MOUSE, QuadraticBezierCurve, SphereGeometry } from "three";

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
import { GUI } from "three/examples/jsm/libs/dat.gui.module";
import {GLTFLoader} from 'THREE/examples/jsm/loaders/GLTFLoader.js';

// import vertexShader from './shaders/vertex.glsl';


const scene = new THREE.Scene()

const axesHelper = new THREE.AxesHelper(5)
// scene.add(axesHelper)

const ambientLight = new THREE.AmbientLight(0x363636)
scene.add(ambientLight)

const light = new THREE.DirectionalLight(0xffffff, 2)
light.position.set(0, 1, 20)
light.castShadow = true
light.shadow.bias = -0.003
light.shadow.mapSize.width = 2048
light.shadow.mapSize.height = 2048
light.shadow.camera.left = -2
light.shadow.camera.right = 2
light.shadow.camera.top = -2
light.shadow.camera.bottom = 2
light.shadow.camera.near = 1
light.shadow.camera.far = 5

const helper = new THREE.CameraHelper(light.shadow.camera)
// scene.add(helper)

const lightPivot = new THREE.Object3D()
lightPivot.add(light)
scene.add(lightPivot)





const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100
)
camera.position.set(7,0,0)


const renderer = new THREE.WebGLRenderer({antialias: true})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio) // better resolution
document.body.appendChild(renderer.domElement)

const locationDataElem = document.getElementById(
    'locationData'
) as HTMLDivElement
let locationDataText = ''

const controls = new OrbitControls(camera, renderer.domElement)
controls.addEventListener('change', () => {
    locationDataText =
        ((controls.getPolarAngle() / -Math.PI) * 180 + 90).toFixed(6) +
        ' ' +
        ((controls.getAzimuthalAngle() / Math.PI) * 180).toFixed(6)
    // locationDataElem.innerText = locationDataText
})
controls.screenSpacePanning = true


// ===========================================================================

const sphereGeometry = new THREE.SphereGeometry(3, 720, 360)
const innerSphereGeometry = new THREE.SphereGeometry(1, 6, 6)

const material = new THREE.MeshPhongMaterial()
// const shaderMaterial = new THREE.ShaderMaterial({
//     vertexShader: vertexShader,
//     fragmentShader: "hei"
// })


material.shininess = 4;





// textures and create sphere =============================================================

const globeTexture = new THREE.TextureLoader().load('src/img/globewrap3.jpg')
globeTexture.anisotropy = renderer.capabilities.getMaxAnisotropy()
material.map = globeTexture



const displacementMap = new THREE.TextureLoader().load('src/img/elev_bump_4k.jpg')
material.displacementMap = displacementMap
material.displacementScale = 0.02


const sphere = new THREE.Mesh(sphereGeometry, material)
const innerSphere = new THREE.Mesh(innerSphereGeometry, new THREE.MeshBasicMaterial())

// sphere.rotation.y = -Math.PI / 1
sphere.rotation.y = -0.4101524
sphere.castShadow = true
sphere.receiveShadow = true
innerSphere.rotation.y = 1.1*Math.PI;
scene.add(sphere)
scene.add(innerSphere)



// cube =====================================

const boxGeometry = new THREE.BoxGeometry(0.1 , 0.1 , 0.1);

const material2 = new THREE.MeshLambertMaterial({
    color: 0x657686,
});
const cube = new THREE.Mesh(boxGeometry, material2);
cube.position.set(3, 0.3, 2);
cube.scale.x = 0.1;
cube.scale.y = 0.15;
cube.scale.z = 0.1;
cube.castShadow = true;
sphere.add(cube);





// Clouds and stars ==========================================


function createClouds() {
    return new THREE.Mesh(
        new THREE.SphereGeometry(3 + 0.023, 720, 360),			
        new THREE.MeshPhongMaterial({
            map:         THREE.ImageUtils.loadTexture('src/img/fair_clouds_4k.png'),
            transparent: true
        })
    );		
}

function createStars() {
    return new THREE.Mesh(
        new THREE.SphereGeometry(70, 720, 360), 
        new THREE.MeshBasicMaterial({
            map:  THREE.ImageUtils.loadTexture('src/img/galaxy_starfield.png'), 
            side: THREE.BackSide
        })
    );
}
let clouds = createClouds()
sphere.add(clouds)
scene.add(createStars())


// add 3d objects =================================

const gtlfloader = new GLTFLoader();
gtlfloader.load('src/3dObjects/scene.gltf',  (gltf) => {
    gltf.scene.scale.set(0.1,0.1,0.1);
    gltf.scene.position.set(7, 0, 0);
    gltf.scene.rotation.y = 0.5*Math.PI;
    innerSphere.add(gltf.scene);
    //renderer.render(scene,camera)
})


gtlfloader.load('src/tieFighter/scene.gltf',  (gltf) => {
    gltf.scene.scale.set(0.015,0.015,0.015);
    gltf.scene.position.set(6, -0.3, 0);
    gltf.scene.rotation.z = 0.5*Math.PI;
    gltf.scene.rotation.x = 0.5*Math.PI;
    gltf.scene.rotation.y = 1.5*Math.PI;
    innerSphere.add(gltf.scene);
    //renderer.render(scene,camera)
    
})

gtlfloader.load('src/tieFighter/scene.gltf',  (gltf) => {
    gltf.scene.scale.set(0.015,0.015,0.015);
    gltf.scene.position.set(5.6, -0.27, 0.1);
    gltf.scene.rotation.z = 0.5*Math.PI;
    gltf.scene.rotation.x = 0.5*Math.PI;
    gltf.scene.rotation.y = 1.5*Math.PI;

    innerSphere.add(gltf.scene);
    //renderer.render(scene,camera)
    
})

gtlfloader.load('src/iss/scene.gltf',  (gltf) => {
    gltf.scene.scale.set(0.01,0.01,0.01);
    gltf.scene.position.set(3.6, -0.27, 0.1);
    gltf.scene.rotation.z = 0.5*Math.PI;
    // gltf.scene.rotation.x = 0.5*Math.PI;
    // gltf.scene.rotation.y = 1.5*Math.PI;

    sphere.add(gltf.scene);
    //renderer.render(scene,camera)
    
})





// ================================================

camera.position.z = 2

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

// GUI ==============================================

const gui = new GUI()
gui.add(material, 'displacementScale', 0, 1, 0.01)

const stats = Stats()
document.body.appendChild(stats.dom)

// Animate and render ==========================================

function animate() {
    requestAnimationFrame(animate)

    controls.update()
    helper.update()
    // lightPivot.rotation.y += 0.009

    sphere.rotation.y += 0.001
    cube.rotation.y += 0.004
    cube.rotation.z += 0.001
    
    

    render()
    

    stats.update()
}

function render() {
    renderer.render(scene, camera)
}

animate()

//npm run dev1
