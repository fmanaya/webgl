import * as THREE from 'https://unpkg.com/three@0.123.0/build/three.module.js'
import { OrbitControls } from './OrbitControls.js'
import { MTLLoader } from './MTLLoader.js'
import { OBJLoader } from './OBJLoader.js'
import { bigPoint, vect } from './tallerEq-A-helpers.js'

const scene = new THREE.Scene()
const canvas = document.getElementById('gl-canvas')
const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas })
const textureLoader = new THREE.TextureLoader()
const shadowTexture = textureLoader.load('./img/roundshadow.png')
const shadowMaterial = new THREE.MeshBasicMaterial({
  map: shadowTexture,
  side: THREE.DoubleSide,
  alphaTest: 0.5,
  transparent: true
})


renderer.shadowMap.cullFace = THREE.CullFaceFrontBack


function drawPathSegment(points) {
  // DibujarRuta
  const geometry = new THREE.BufferGeometry().setFromPoints( points );
  const material = new THREE.LineBasicMaterial( { color : 0xffffff } );
  const curveObject = new THREE.Line( geometry, material );
  scene.add( curveObject)
  
  const pGeometry = new THREE.Geometry();
  pGeometry.vertices = points 
  const pMaterial = new THREE.PointsMaterial({
      sizeAttenuation: false,
      size: 5
  })
  const pPoints = new THREE.Points(pGeometry, pMaterial)
  scene.add (pPoints)    
}

// la nubes
const cloud = new THREE.Object3D()
const shadowGeo = new THREE.PlaneGeometry(10, 10);
const shadow1 = new THREE.Mesh(shadowGeo, shadowMaterial)
const shadow2 = new THREE.Mesh(shadowGeo, shadowMaterial)
const shadow3 = new THREE.Mesh(shadowGeo, shadowMaterial)
const shadow4 = new THREE.Mesh(shadowGeo, shadowMaterial)
const shadow5 = new THREE.Mesh(shadowGeo, shadowMaterial)
//shadow.position.y = 0.001
shadow1.rotation.x = -Math.PI / 2
shadow2.rotation.x = -Math.PI / 2
shadow2.position.y = 5
shadow3.rotation.x = -Math.PI / 2
shadow3.position.y = -5

shadow4.rotation.y = -Math.PI / 2
shadow4.scale.y = 2
shadow5.rotation.z = -Math.PI / 2
shadow4.scale.y = 2

cloud.scale.x = 5
cloud.scale.y = 5
cloud.scale.z = 5
//shadow.position.y = 0.001
//shadow.scale.set(40, 40, 40)
cloud.add(shadow1)
cloud.add(shadow2)
cloud.add(shadow3)
cloud.add(shadow4)
cloud.add(shadow5)
scene.add(cloud)


const cloudP1 = new THREE.CubicBezierCurve3(
  vect([157.6, 50, 157.6]),
  vect([157.7, 50, 157.6]),
  vect([39.4, 50, 118.2]),
  vect([39.4, 50, 118.2])
);
const cloudP2 = new THREE.CubicBezierCurve3(
  vect([39.4, 50, 118.2]),
  vect([39.4, 50, 118.2]),
  vect([-78.7, 50, 78.8]),
  vect([-78.8, 50, 78.8])
);

const curveCloudP = new THREE.CurvePath()
curveCloudP.add(cloudP1)
curveCloudP.add(cloudP2)




//el cubo
// const geometry = new THREE.BoxGeometry();
// for (let i = 0; i < geometry.faces.length; i += 2) {
//   const color = Math.random() * 0xffffff
//   geometry.faces[i].color.setHex(color)
//   geometry.faces[i + 1].color.setHex(color)
// }

// const material = new THREE.MeshBasicMaterial({ vertexColors: true });
// const cube = new THREE.Mesh(geometry, material);

// cube.scale.x = 10
// cube.scale.y = 10
// cube.scale.z = 10

const plane = new THREE.Object3D()
scene.add(plane);
plane.position.x = -157;
plane.position.z = -157;
plane.position.y = 25;

// plane.add(cube)


// Carga del objeto avion
const mtlLoader = new MTLLoader();
const objPath = 'models/Plane/Plane'
mtlLoader.load(
    objPath + '.mtl',
    function (material) {
        const loader = new OBJLoader();
        loader.setMaterials(material)
        loader.load(
            objPath + '.obj',
            function ( object ) {
                object.scale.x = 0.05
                object.scale.y = 0.05
                object.scale.z = 0.05
                object.rotation.y = Math.PI
                object.position.z = -0.5
                plane.add( object )
               
            },
            // called when loading is in progresses
            function ( xhr ) {
                console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            },
            // called when loading has errors
            function ( error ) {
                console.log( 'An error happened' );
            }
        );
    },
	// called when loading is in progresses
	function ( xhr ) {
		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
	},
	// called when loading has errors
	function ( error ) {
		console.log( 'An error happened' );
	}
)






//Puntos de control
/*
bezier 1	punto inicial	-157.6	0	-157.6
  control 1	-131.3333333	16.66666667	-78.8
  control 2	-100	32	100
  segundo punto	-78.8	50	78.8
bezier 2	punto inicial	-78.8	50	78.8
  control 1	-57.6	68	57.6
  control 2	-30	30	-50
  segundo punto	0	25	-39.4
bezier 3 	punto inicial	0	25	-39.4
  control 1	30	20	-28,8
  control 2	60	20	-45
  segundo punto	98.5	25	-39.4
bezier 4	punto inicial	98.5	25	-39.4
  control 1	137	30	-33.8
  control 2	110	60	145
  segundo punto	118.2	50	118.2
bezier 4	punto inicial	98.5	25	-39.4
  control 1	87	20	-223.8
  control 2	145	10	145
  segundo punto	157.6	0	157.6
*/




// Array vertices trayecto previsto
const arrVi = [
  [-157.6, 0, -157.6],
  [-157.6, 10, -118.2],
  [-157.6, 90, 78.8],
  [-78.8, 100, 78.8],

  [-78.8, 100, 78.8],
  [0, 110, 78.8],
  [-59.1, 70, 19.7],
  [0, 60, -19.7],

  [0, 60, -19.7],
  [59.1, 50, -59.1],
  [59.1, 50, -59.1],
  [98.5, 70, -39.4],

  [98.5, 70, -39.4],
  [137.9, 90, -19.7],
  [118.2, 40, 98.5],
  [118.2, 30, 118.2],

  [118.2, 30, 118.2],
  [118.2, 20, 137.9],
  [118.2, 0, 157.6],
  [157.6, 0, 157.6]
]



let arrVects = arrVi.map((vt)=>{
  let v =  vect(vt)
  // scene.add(bigPoint(v))
  return v
})


// const v0 =  vect(arrVi[0])
// scene.add(bigPoint(v0))
// const v1 = vect(arrVi[1])
// scene.add(bigPoint(v1))



const curve1 = new THREE.CubicBezierCurve3(
  arrVects[0],
  arrVects[1],
  arrVects[2],
  arrVects[3]
);
const curve2 = new THREE.CubicBezierCurve3(
  arrVects[4],
  arrVects[5],
  arrVects[6],
  arrVects[7]
);
const curve3 = new THREE.CubicBezierCurve3(
  arrVects[8],
  arrVects[9],
  arrVects[10],
  arrVects[11]
);
const curve4 = new THREE.CubicBezierCurve3(
  arrVects[12],
  arrVects[13],
  arrVects[14],
  arrVects[15]
);
const curve5 = new THREE.CubicBezierCurve3(
  arrVects[16],
  arrVects[17],
  arrVects[18],
  arrVects[19]
);

const curveP = new THREE.CurvePath()

curveP.add(curve1)
curveP.add(curve2)
curveP.add(curve3)
curveP.add(curve4)
curveP.add(curve5)

const resolution = 50
const points = curveP.getPoints(resolution)
//drawPathSegment(points)

const pointsCloud = curveCloudP.getPoints(10)
//drawPathSegment(pointsCloud)

/*
0, 0, -39.4
98.5, 0, -39.4

118.2, 0, 118.2
157.6, 157.6,0 
*/
//const points = curveP.getPoints(50);
//scene.add( curveP)




renderer.setClearColor(new THREE.Color(0xAAAAAA), 1.0)

const controls = new OrbitControls(camera, renderer.domElement);

const imgLoader = new THREE.ImageLoader();
imgLoader.load('./img/terrain_heightmap.jpg', createHeightmap);

const maxHeight = 100
function createHeightmap(image) {
  // Extraer los colores dibujando la imagen en un canvas  
  const ctx = document.createElement('canvas').getContext('2d');
  const { width, height } = image;
  ctx.canvas.width = width;
  ctx.canvas.height = height;
  ctx.drawImage(image, 0, 0);
  // en data se encuentran los valores de color de los pixeles RGBA
  const { data } = ctx.getImageData(0, 0, width, height);

  // Crear una geometría
  const geometry = new THREE.Geometry();

  for (let z = 0; z < height - 1; ++z) {
    for (let x = 0; x < width - 1; ++x) {

      // calculo los indices de color dentro del arreglo
      // Como los colores son RGBA, los indices se multiplican por 4
      const indexj = ((z * width) + x) * 4
      const indexj_1 = indexj + (width * 4)
      // Como es una imagen gris, RGB son iguales
      // Calculo alturas por cada pixel
      //      2----3
      //      |\  /|
      //      | \/4|
      //      | /\ |
      //      |/  \|
      //      0----1

      const h0 = (data[indexj_1] / 255) * maxHeight;
      const h1 = (data[indexj_1 + 4] / 255) * maxHeight;
      const h2 = (data[indexj] / 255) * maxHeight;
      const h3 = (data[indexj + 4] / 255) * maxHeight;
      const h4 = ((h0 + h1 + h2 + h3) / 4);

      // Posiciones de las esquinas
      const x0 = x;
      const x1 = x + 1;
      const z0 = z;
      const z1 = z + 1;
      // Crear el índice del triangulo
      const ndx = geometry.vertices.length;
      // Crear los vertices de los triángulos
      geometry.vertices.push(
        new THREE.Vector3(x0, h0, z1), //v0
        new THREE.Vector3(x1, h1, z1), //v1
        new THREE.Vector3(x0, h2, z0), //v2
        new THREE.Vector3(x1, h3, z0), //v3
        new THREE.Vector3((x0 + x1) / 2, h4, (z0 + z1) / 2) //v4
      );

      // Crear los 4 triángulos usando los indices de los vértices
      geometry.faces.push(
        new THREE.Face3(ndx + 0, ndx + 1, ndx + 4), //f0
        new THREE.Face3(ndx + 1, ndx + 3, ndx + 4), //f1
        new THREE.Face3(ndx + 3, ndx + 2, ndx + 4), //f2
        new THREE.Face3(ndx + 2, ndx + 0, ndx + 4), //f3
      );

      // Crear las coordenadas de textura por cada cara
      const widthInPixels = width - 1
      const heightInPixels = height - 1
      const u0 = x / widthInPixels
      const u1 = (x + 1) / widthInPixels
      const v0 = 1 - (z / heightInPixels)
      const v1 = 1 - ((z + 1) / heightInPixels)
      const um = (u0 + u1) / 2
      const vm = (v0 + v1) / 2

      geometry.faceVertexUvs[0].push(
        [new THREE.Vector2(u0, v1), new THREE.Vector2(u1, v1), new THREE.Vector2(um, vm)], //f0
        [new THREE.Vector2(u1, v1), new THREE.Vector2(u1, v0), new THREE.Vector2(um, vm)], //f1
        [new THREE.Vector2(u1, v0), new THREE.Vector2(u0, v0), new THREE.Vector2(um, vm)], //f2
        [new THREE.Vector2(u0, v0), new THREE.Vector2(u0, v1), new THREE.Vector2(um, vm)], //f3
      );


      if (z === 40 && x == 40) { console.log(um, vm) }


    }
  }
  // Calcular normales para poder rsponder a la luz
  geometry.computeFaceNormals();
  geometry.computeVertexNormals();
  // Centrarla
  geometry.translate(width / -2, 0, height / -2);
  // Cargar la imagen para usar como textura
  const loader = new THREE.TextureLoader();
  const texture = loader.load('./img/terrain_texture.jpg');
  // Mapear la textura
  const material = new THREE.MeshPhongMaterial({ map: texture, flatShading: false });
  // Crear la malla
  const terrain = new THREE.Mesh(geometry, material);
  scene.add(terrain);
}

// Helpers
const axesHelper = new THREE.AxesHelper(50)
scene.add(axesHelper)
const gridHelper = new THREE.GridHelper(300, 300)
scene.add(gridHelper)

// Iluminación
const color = 0xFFFFFF;
const intensity = 1;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(0, 2, 4);
scene.add(light);

// Posición inicial de la camara
camera.position.x = 100
camera.position.y = 100
camera.position.z = 100
controls.update()



// let i = 0
// let before = 0
// const frameRate = 0.1
// const animate = function (now) {
//   const nowInSec = now * 0.001
//   requestAnimationFrame(animate);

//   const delta = nowInSec - before
//   if (delta >= frameRate) {
//     if (i >= points.length) {
//       i = 0
//     }
//     const p = points[i]
//     let newPos = new THREE.Vector3(p.x, p.y, p.z)
//     plane.position.x = newPos.x
//     plane.position.y = newPos.y
//     plane.position.z = newPos.z
//     before = nowInSec
//     i++
//   }

//   controls.update()
//   renderer.render(scene, camera);

// };

// Animación por interpolación

let duration = 15
let beforePosition, beforePositionCloud
let before = 0
const animate = function (now) {
    const nowInSecs = now / 1000
    requestAnimationFrame( animate );

    const delta = nowInSecs - before
    if (delta >= duration) {
        before = nowInSecs // Reset animation
    }

    const durationPassed = delta / duration // Normalizado
    const point = curveP.getPoint(durationPassed)
    if (point) {
        if (beforePosition) {
          plane.position.x = beforePosition.x
          plane.position.y = beforePosition.y
          plane.position.z = beforePosition.z
          plane.lookAt(point)
        }
        beforePosition = point
    }  

    const pointCloud = curveCloudP.getPoint(durationPassed)
    if (pointCloud) {
        if (beforePositionCloud) {
          cloud.position.x = beforePositionCloud.x
          cloud.position.y = beforePositionCloud.y
          cloud.position.z = beforePositionCloud.z
        }
        beforePositionCloud = pointCloud
    }  




    controls.update()
    renderer.render( scene, camera );
};

animate();