import * as THREE from 'https://unpkg.com/three@0.123.0/build/three.module.js'

var bigPoint = function (v) {
  const geo1 = new THREE.SphereGeometry(5, 15, 15, 0.0, 6.3, 0.0, 3.1);
  //const material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
  const materialYellow = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  const sphere = new THREE.Mesh(geo1, materialYellow);
  sphere.position.x = v.x
  sphere.position.y = v.y
  sphere.position.z = v.z

  return sphere

};

var vect = function (p) {
  return new THREE.Vector3(p[0], p[1], p[2])

};

export { bigPoint, vect };
