// Variable para guardar el canvas
var canvas;
// Variable para guardar el contexto WebGL
var gl;
// Cuando la página HTML termine de cargar, lanzar el método init
window.onload = init;

/**
 * Funcion para inicial el programa
 */
function init() {
    // ****************************************
    // ETAPA DE INICIALIZACION
    // ****************************************
    // PASO 1: Obtener el contexto WebGL desde el canvas
    canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn’t available"); }

    // PASO 2: Inicializar los shaders GLSL y crear un programa de GLSL
    var program = InitShaders(gl, "vertex-shader-2", "fragment-shader-2");

    // PASO 3: Ubicar donde los datos de los vertices deben ir (Unir los vértices con el vertex shader)
    var aPos = gl.getAttribLocation(program, "aPos");
    // Agregamos dos nuevos datos para calcular la nueva posición de los vértices usando las matrices de proyección y de modelo
    var uProjectionMatrix = gl.getUniformLocation(program, 'uProjectionMatrix')
    var uModelViewMatrix = gl.getUniformLocation(program, 'uModelViewMatrix')
    // Inicializamos los datos de la matríz de proyección
    const fieldOfView = 45 * Math.PI / 180;   // Radianes
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix,
        fieldOfView,
        aspect,
        zNear,
        zFar);
    // Inicializamos los datos de la matríz de modelo
    const modelViewMatrix = mat4.create();
    mat4.translate(modelViewMatrix,
        modelViewMatrix,
        [0.0, 0.0, -6.0]);

    // PASO 4: Crear los vertices de la geometría
    var vertices = {
        data: '', // Datos de los vertices
        bufferId: '' // Buffer para los datos
    };
    // Crear los vertices
    vertices.data = new Float32Array(
        [
            -0.90, -0.90, // Triángulo 1
            0.85, -0.90,
            -0.90, 0.85,
            0.90, -0.85, // Triangulo 2
            0.90, 0.90,
            -0.85, 0.90
        ]);
    // Crear el buffer
    vertices.bufferId = gl.createBuffer();
    // Enlazar el buffer con la GPPU
    gl.bindBuffer(gl.ARRAY_BUFFER, vertices.bufferId);
    // Agregar los datos de los vertices al buffer
    gl.bufferData(gl.ARRAY_BUFFER, vertices.data, gl.STATIC_DRAW);

    // ****************************************
    // ETAPA DE RENDERING
    // ****************************************  
    // PASO 1: Decirle a WebGL como transformar de espacio de CLIP a pixeles
    gl.viewport(0, 0, canvas.width, canvas.height);

    // PASO 2: Borrar el canvas
    // Aplicar un color de fondo
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Borrar el buffer de color
    gl.clear(gl.COLOR_BUFFER_BIT)

    // PASO 3: Decirle a WebGL que use nuestros programa
    gl.useProgram(program);

    // PASO 4: Decirle a WebGL cómo debe leer los vertices y las nuevas matrices
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    gl.uniformMatrix4fv(
        uProjectionMatrix,
        false,
        projectionMatrix);
    gl.uniformMatrix4fv(
        uModelViewMatrix,
        false,
        modelViewMatrix);

    // Activar los vertices
    gl.enableVertexAttribArray(aPos);

    // PASO 5: dibujar
    gl.drawArrays(gl.TRIANGLES, 0, 6)
}