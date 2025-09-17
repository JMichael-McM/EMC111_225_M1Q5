// 1. Scene setup
const aspect = window.innerWidth / window.innerHeight;
const frustumSize = 10;
const camera = new THREE.OrthographicCamera(frustumSize * aspect / -2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / -2, 0.1, 1000);
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// 2. Lighting
const ambientLight = new THREE.AmbientLight(0x404040, 2);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5).normalize();
scene.add(directionalLight);
// 3. Geometries and Materials
const geometries = {};
const materials = {};
const objects = {};
// Jupiter (SphereGeometry)
geometries.jupiter = new THREE.SphereGeometry(2, 32, 32);
materials.jupiter = new THREE.MeshStandardMaterial({
    color: 0xdeb887, // Yellowish-brown color
    roughness: 0.8,
    metalness: 0.1
});
objects.jupiter = new THREE.Mesh(geometries.jupiter, materials.jupiter);
scene.add(objects.jupiter);
// Moons with different geometries and colors
const moonColors = [0xaaaaaa, 0xff0000, 0x0000ff, 0x00ff00];
const orbitDistances = [4.5, 5, 5.5, 6.5];
const orbitSpeeds = [0.001, 0.002, 0.0015, 0.003];
objects.moons = [];
// Moon 1: BoxGeometry (Multi-color)
const boxMoonGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
const boxMoonMaterial = new THREE.MeshNormalMaterial();
const boxMoon = new THREE.Mesh(boxMoonGeometry, boxMoonMaterial);
boxMoon.position.x = orbitDistances[0];
objects.moons.push(boxMoon);
scene.add(boxMoon);
// Moon 2: ConeGeometry (Red)
const coneMoonGeometry = new THREE.ConeGeometry(0.2, 0.4, 32);
const coneMoonMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
const coneMoon = new THREE.Mesh(coneMoonGeometry, coneMoonMaterial);
coneMoon.position.x = orbitDistances[1];
objects.moons.push(coneMoon);
scene.add(coneMoon);
// Moon 3: CylinderGeometry (Blue)
const cylinderMoonGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.4, 32);
const cylinderMoonMaterial = new THREE.MeshLambertMaterial({ color: 0x0000ff });
const cylinderMoon = new THREE.Mesh(cylinderMoonGeometry, cylinderMoonMaterial);
cylinderMoon.position.x = orbitDistances[2];
objects.moons.push(cylinderMoon);
scene.add(cylinderMoon);
// Moon 4: SphereGeometry (Green)
const sphereMoonGeometry = new THREE.SphereGeometry(0.13, 16, 16);
const sphereMoonMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
const sphereMoon = new THREE.Mesh(sphereMoonGeometry, sphereMoonMaterial);
sphereMoon.position.x = orbitDistances[3];
objects.moons.push(sphereMoon);
scene.add(sphereMoon);
// Jupiter's Ring (TorusGeometry) to make it less flat
geometries.ring = new THREE.TorusGeometry(2.6, 0.5, 16, 100);
materials.ring = new THREE.MeshStandardMaterial({
    color: 0xc0c0c0, // Yellow-gray color
    roughness: 0.9,
    metalness: 0.2,
    side: THREE.DoubleSide
});
objects.ring = new THREE.Mesh(geometries.ring, materials.ring);
objects.ring.rotation.x = -Math.PI / 2;
scene.add(objects.ring);
// 4. Position the camera - top-side view
camera.position.set(10, 5, 0);
camera.lookAt(new THREE.Vector3(0, 0, 0));
// 5. Animation loop
const animate = () => {
    requestAnimationFrame(animate);
    // Jupiter's rotation
    objects.jupiter.rotation.y += 0.001;
    // Moons' orbital and spinning animation
    objects.moons.forEach((moon, index) => {
        const time = Date.now() * orbitSpeeds[index];
        const radius = orbitDistances[index];
        moon.position.x = Math.cos(time) * radius;
        moon.position.z = Math.sin(time) * radius;
        // Spinning animation
        if (index === 0) {
            moon.rotation.x += 0.02;
            moon.rotation.y += 0.01;
        }
        if (index === 1) {
            moon.rotation.x += 0.015;
            moon.rotation.y += 0.015;
        }
        if (index === 2) {
            moon.rotation.x += 0.01;
        }
        if (index === 3) {
            moon.rotation.y += 0.01;
        }
    });
    // Ring's spinning animation
    objects.ring.rotation.z += 0.005;
    renderer.render(scene, camera);
};
animate();
// 6. Handle window resizing
window.addEventListener('resize', () => {
    const aspect = window.innerWidth / window.innerHeight;
    camera.left = frustumSize * aspect / -2;
    camera.right = frustumSize * aspect / 2;
    camera.top = frustumSize / 2;
    camera.bottom = frustumSize / -2;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});