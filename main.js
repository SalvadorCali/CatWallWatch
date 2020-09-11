//inizializzo variabili globali utilizzate in seguito
var program = new Array();
var worldMatrices = new Array();
var gl;
var shaderDir; 
var baseDir;

var textureColor = valCol("0f0f0f");
var reqId;

//inizializzo delle variabili per la gestione degli shader attraverso menu
var typeNumber = 0;
var ambientNumber = 0;
var ambientNumberH = 0;
var ambientNumberT = 0;
var diffuseNumber = 0;
var diffuseNumberH = 4;
var diffuseNumberT = 5;
var specularNumber = 0;
var nmBoolean = 0.0;

//dichiaro e inizializzo le variabili per gestire i modelli e le textures
var catModel;
var eye1Model;
var eye2Model;
var hand1Model;
var hand2Model;
var tailModel;
var hand3Model;

var modelStr = 'model/body/cat_body.obj';
var eye1Str = 'model/pieces/eye.obj'
var eye2Str = 'model/pieces/eye.obj'
var hand1Str = 'model/pieces/clockhand1.obj';
var hand2Str = 'model/pieces/clockhand2.obj';
var hand3Str = 'model/pieces/clockhand1.obj';
var tailStr = 'model/pieces/tail.obj';

var currentTextureGlobal = 'model/textures/black.png';
var modelTexture = 'model/textures/black.png';
var blue = 'model/textures/blue.png';
var green = 'model/textures/green.png';
var red = 'model/textures/red.png';
var violet = 'model/textures/violet.png';
var normalMap = 'model/textures/normal_map.png';

//variabili per gestire il movimento del gatto
var Rx = 0.0;
var Ry = 0.0;
var Rz = 0.0;
var S  = 1.0;
var z = 0.0;
var y = 0.0;
var delta = 0.1;
var deltaC = 1.0;
var cx = 0.0;
var cy = 0.0;
var cz = 0.0;
var elevation = 0.0;
var angle = 0.0;
var keys = [];
var rvx = 0.0;
var rvy = 0.0;
var rvz = 0.0;
var rotX = 0.0;
var rotY = 0.0;
var rotZ = 0.0;
var yAxis = 0.0;
var zAxis = 0.0;
var lookRadius = 10.0;

var directionalLightColorD = [1.0,1.0,1.0];
var specularColorD = [1.0,1.0,1.0,1.0];
var ambientColorD = [0.4,0.4,0.4];
var hemisphericUpColorD = [0.8,0.8,0.8];
var hemisphericDownColorD = [0.1,0.1,0.1];

//######### utility functions #########

//funzioni per gestire i vari movimenti
function keyFunctionDown(e){
    if(!keys[e.keyCode]) {
        keys[e.keyCode] = true;
        switch(e.keyCode){
            case 37: //left arrow
                Rx=Rx-deltaC;
                break;
            case 39: //right arrow
                Rx=Rx+deltaC;
                break;
            case 38: //up arrow
                Rz=Rz-deltaC;
                break;
            case 40: //down arrow
                Rz=Rz+deltaC;
                break;
            case 90: //z
                Ry=Ry+deltaC;
                break;
            case 88: //x
                Ry=Ry-deltaC;
                break;
            case 65: //a
                rvy=rvy-delta*0.01;
                break;
            case 68: //d
                rvy=rvy+delta*0.01;
                break;
            case 87: //w
                rvx=rvx+delta;
                break;
            case 83: //s
                rvx=rvx-delta;
                break;
            case 74: //j
                z=z-delta*0.1;
                break;
            case 76: //l
                z=z+delta*0.1;
                break;
            case 73: //i
                y=y-delta*0.01;
                break;
            case 75: //k
                y=y+delta*0.01;
                break;
        }
    }
}

function keyFunctionUp(e){
    if(keys[e.keyCode]) {
        keys[e.keyCode] = false;
        switch(e.keyCode){
            case 37: //left arrow
                Rx=Rx+deltaC;
                break;
            case 39: //right arrow
                Rx=Rx-deltaC;
                break;
            case 38: //up arrow
                Rz=Rz+deltaC;
                break;
            case 40: //down arrow
                Rz=Rz-deltaC;
                break;
            case 90: //z
                Ry=Ry-deltaC;
                break;
            case 88: //x
                Ry=Ry+deltaC;
                break;
            case 65: //a
                rvy=rvy+delta*0.01;
                break;
            case 68: //d
                rvy=rvy-delta*0.01;
                break;
            case 87: //w
                rvx=rvx-delta;
                break;
            case 83: //s
                rvx=rvx+delta;
                break;
            case 74: //j
                z=z+delta*0.1;
                break;
            case 76: //l
                z=z-delta*0.1;
                break;
            case 73: //i
                y=y+delta*0.01;
                break;
            case 75: //k
                y=y-delta*0.01;
                break;
        }
    }
}

//funzione per convertire colore dal formato #000000 al formato (0.0, 0.0, 0.0)
function valCol(col) {
    R = parseInt(col.substring(0,2) ,16) / 255;
    G = parseInt(col.substring(2,4) ,16) / 255;
    B = parseInt(col.substring(4,6) ,16) / 255;
    return [R,G,B,1.0];
}

//funzione per gestire il resize dello schermo
function doResize() {
    var canvas = document.getElementById("c");
    if((window.innerWidth > 40) && (window.innerHeight > 300)) {
        canvas.width  = window.innerWidth-430;
        canvas.height = window.innerHeight-32;
        gl.viewport(0.0, 0.0, canvas.width, canvas.height);
    }
}

//######### true program #########

function main() {
    var currentTexture = currentTextureGlobal;
    
    //inizializzo i vari valori che verranno gestiti anche dagli sliders
    var dirLightAlpha = -utils.degToRad(-120); 
    var dirLightBeta  = -utils.degToRad(90);
    var directionalLight = [Math.cos(dirLightAlpha) * Math.cos(dirLightBeta),
                            Math.sin(dirLightAlpha),
                            Math.cos(dirLightAlpha) * Math.sin(dirLightBeta)
                           ];
    var directionalLightColor = directionalLightColorD;
    var specularColor = specularColorD;
    var ambientColor = ambientColorD;
    var hemisphericUpColor = hemisphericUpColorD;
    var hemisphericDownColor = hemisphericDownColorD;
    var point = [0.0, 0.0, -50.0];
    var decay = 0.0;
    var targetDist = 100.0;
    var specShine = 20.0;
    
    //inizializzo le variabili per le lancette
    var secondsHand = 0.0;
    var minutesHand = 0.0;
    var hoursHand = 0.0;

    //viene definita la coordinata in basso a sx con i primi due parametri e successivamente la loro estensione
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.85, 1.0, 0.85, 1.0); 
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //attiva la gestione della profondità
    gl.enable(gl.DEPTH_TEST);

    //###################################################################################
    //here we extract the position of the vertices, the normals, the indices, and the uv coordinates
    var catVertices = new Array();
    var catNormals = new Array();
    var catIndices = new Array();
    var catTexCoords = new Array();

    catVertices[0] = catModel.vertices;
    catVertices[1] = eye1Model.vertices;
    catVertices[2] = eye2Model.vertices;
    catVertices[3] = hand1Model.vertices;
    catVertices[4] = hand2Model.vertices;
    catVertices[5] = hand3Model.vertices;
    catVertices[6] = tailModel.vertices;
    catVertices[7] = flatVertices;

    catNormals[0] = catModel.vertexNormals;
    catNormals[1] = eye1Model.vertexNormals;
    catNormals[2] = eye2Model.vertexNormals;
    catNormals[3] = hand1Model.vertexNormals;
    catNormals[4] = hand2Model.vertexNormals;
    catNormals[5] = hand3Model.vertexNormals;
    catNormals[6] = tailModel.vertexNormals;
    catNormals[7] = flatNormals;

    catIndices[0] = catModel.indices;
    catIndices[1] = eye1Model.indices;
    catIndices[2] = eye2Model.indices;
    catIndices[3] = hand1Model.indices;
    catIndices[4] = hand2Model.indices;
    catIndices[5] = hand3Model.indices;
    catIndices[6] = tailModel.indices;
    catIndices[7] = flatIndices;

    catTexCoords[0] = catModel.textures;
    catTexCoords[1] = eye1Model.textures;
    catTexCoords[2] = eye2Model.textures;
    //###################################################################################

    //initialize arrays to handles uniforms or attributes for the program
    var positionAttributeLocation = new Array();
    var uvAttributeLocation = new Array();
    var matrixLocation = new Array();
    var textLocation = new Array();
    var normalMapLocation = new Array();

    var normalAttributeLocation = new Array();
    var lightDirectionHandle = new Array();
    var pointPositionHandle = new Array();
    var decayHandle = new Array();
    var targetDistHandle = new Array();
    var specShineHandle = new Array();
    var lightColorHandle = new Array();
    var specularColorHandle = new Array();
    var ambientColorHandle = new Array();
    var hemisphericUpColorHandle = new Array();
    var hemisphericDownColorHandle = new Array();
    var normalMatrixPositionHandle = new Array();
    var lightDirMatrixPositionHandle = new Array();
    var tailColorLocation = new Array();
    var viewWorldMatrixLocation = new Array();
    var viewMatrixLocation = new Array();
    var normalMapBoolean = new Array();

    //only for the body and the eyes
    for(i=0; i<3; i++){
        positionAttributeLocation[i] = gl.getAttribLocation(program[0], "a_position");  
        matrixLocation[i] = gl.getUniformLocation(program[0], "matrix");
        normalAttributeLocation[i] = gl.getAttribLocation(program[0], "inNormal"); 
        lightDirectionHandle[i] = gl.getUniformLocation(program[0], 'lightDirection');
        pointPositionHandle[i] = gl.getUniformLocation(program[0], 'pointPosition');
        decayHandle[i] = gl.getUniformLocation(program[0], 'decay');
        targetDistHandle[i] = gl.getUniformLocation(program[0], 'targetDist');
        specShineHandle[i] = gl.getUniformLocation(program[0], 'specShine');
        lightColorHandle[i] = gl.getUniformLocation(program[0], 'lightColor');
        specularColorHandle[i] = gl.getUniformLocation(program[0], 'specularColor');
        ambientColorHandle[i] = gl.getUniformLocation(program[0], 'ambientColor');
        hemisphericUpColorHandle[i] = gl.getUniformLocation(program[0], 'hemisphericUpColor');
        hemisphericDownColorHandle[i] = gl.getUniformLocation(program[0], 'hemisphericDownColor');
        normalMatrixPositionHandle[i] = gl.getUniformLocation(program[0], 'nMatrix');
        lightDirMatrixPositionHandle[i] = gl.getUniformLocation(program[0], 'lightDirMatrix');
        viewWorldMatrixLocation[i] = gl.getUniformLocation(program[0], "vwMatrix");
        viewMatrixLocation[i] = gl.getUniformLocation(program[0], "vMatrix");
        uvAttributeLocation[i] = gl.getAttribLocation(program[0], "a_uv"); 
        textLocation[i] = gl.getUniformLocation(program[0], "u_texture");
        normalMapLocation[i] = gl.getUniformLocation(program[0], "u_normalMap");
        normalMapBoolean[i] = gl.getUniformLocation(program[0], "nm_boolean");

    }
    //only for the hands
    for(i=3; i<6; i++){
        positionAttributeLocation[i] = gl.getAttribLocation(program[1], "a_position");  
        matrixLocation[i] = gl.getUniformLocation(program[1], "matrix");
        normalAttributeLocation[i] = gl.getAttribLocation(program[1], "inNormal");
        lightDirectionHandle[i] = gl.getUniformLocation(program[1], 'lightDirection');
        pointPositionHandle[i] = gl.getUniformLocation(program[1], 'pointPosition');
        decayHandle[i] = gl.getUniformLocation(program[1], 'decay');
        targetDistHandle[i] = gl.getUniformLocation(program[1], 'targetDist');
        specShineHandle[i] = gl.getUniformLocation(program[1], 'specShine');
        lightColorHandle[i] = gl.getUniformLocation(program[1], 'lightColor');
        specularColorHandle[i] = gl.getUniformLocation(program[1], 'specularColor');
        ambientColorHandle[i] = gl.getUniformLocation(program[1], 'ambientColor');
        hemisphericUpColorHandle[i] = gl.getUniformLocation(program[1], 'hemisphericUpColor');
        hemisphericDownColorHandle[i] = gl.getUniformLocation(program[1], 'hemisphericDownColor');
        normalMatrixPositionHandle[i] = gl.getUniformLocation(program[1], 'nMatrix');
        lightDirMatrixPositionHandle[i] = gl.getUniformLocation(program[1], 'lightDirMatrix');
        viewWorldMatrixLocation[i] = gl.getUniformLocation(program[1], "vwMatrix");
        viewMatrixLocation[i] = gl.getUniformLocation(program[1], "vMatrix");
        tailColorLocation[i] = gl.getUniformLocation(program[1], 'tailColor'); 

    }
    //only for the tail and the flat
    for(i=6; i<8; i++){
        positionAttributeLocation[i] = gl.getAttribLocation(program[2], "a_position");  
        matrixLocation[i] = gl.getUniformLocation(program[2], "matrix");
        normalAttributeLocation[i] = gl.getAttribLocation(program[2], "inNormal");
        lightDirectionHandle[i] = gl.getUniformLocation(program[2], 'lightDirection');
        pointPositionHandle[i] = gl.getUniformLocation(program[2], 'pointPosition');
        decayHandle[i] = gl.getUniformLocation(program[2], 'decay');
        targetDistHandle[i] = gl.getUniformLocation(program[2], 'targetDist');
        specShineHandle[i] = gl.getUniformLocation(program[2], 'specShine');
        lightColorHandle[i] = gl.getUniformLocation(program[2], 'lightColor');
        specularColorHandle[i] = gl.getUniformLocation(program[2], 'specularColor');
        ambientColorHandle[i] = gl.getUniformLocation(program[2], 'ambientColor');
        hemisphericUpColorHandle[i] = gl.getUniformLocation(program[2], 'hemisphericUpColor');
        hemisphericDownColorHandle[i] = gl.getUniformLocation(program[2], 'hemisphericDownColor');
        normalMatrixPositionHandle[i] = gl.getUniformLocation(program[2], 'nMatrix');
        lightDirMatrixPositionHandle[i] = gl.getUniformLocation(program[2], 'lightDirMatrix');
        viewWorldMatrixLocation[i] = gl.getUniformLocation(program[2], "vwMatrix");
        viewMatrixLocation[i] = gl.getUniformLocation(program[2], "vMatrix");
        tailColorLocation[i] = gl.getUniformLocation(program[2], 'tailColor'); 

    }

    //initialize the perspective matrix
    var perspectiveMatrix = utils.MakePerspective(0.8, gl.canvas.width/gl.canvas.height, 0.1, 100.0);
    //creates the vaos array
    var vaos = new Array();

    //for all the objects creates buffers for positions, normals, uv coordinates and indices
    for(i=0; i<8; i++){
        vaos[i] = gl.createVertexArray();
        gl.bindVertexArray(vaos[i]);

        //creates the VBO
        var positionBuffer = gl.createBuffer();
        //the VBO is set as the active one
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        //STATIC_DRAW: in order to specify the contents once by the application
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(catVertices[i]), gl.STATIC_DRAW);
        //enables the communication, otherwise it cannot be used
        gl.enableVertexAttribArray(positionAttributeLocation[i]);
        //3 is the number of components per vertex, false for the normalization, 0 for the stride (offset between following elements), 0 for the offset for the first element
        gl.vertexAttribPointer(positionAttributeLocation[i], 3, gl.FLOAT, false, 0, 0);
        //attributes change for each vertex and are passed only to the vertex shader

        var normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(catNormals[i]), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(normalAttributeLocation[i]);
        gl.vertexAttribPointer(normalAttributeLocation[i], 3, gl.FLOAT, false, 0, 0);

        if(i <= 2){
            var uvBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(catTexCoords[i]), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(uvAttributeLocation[i]);
            gl.vertexAttribPointer(uvAttributeLocation[i], 2, gl.FLOAT, false, 0, 0);
        }

        var indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(catIndices[i]), gl.STATIC_DRAW); 
    }

    //initializes the 2 textures: 0 for the body and the eyes, 1 for the normal map
    var textures = new Array();
    var images = new Array();

    var texture = gl.createTexture();
    textures[0] = texture;
    //set the texture as the active one
    gl.bindTexture(gl.TEXTURE_2D, textures[0]);
    images[0] = new Image();
    images[0].src = baseDir+currentTexture;
    images[0].onload= function() {
        //TEXTURE_2D because the texture is 2D, and it isn't cube map or 3D
        gl.bindTexture(gl.TEXTURE_2D, textures[0]);
        //it rotates the texture over the Y axes
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        //type of texture, texture level, input type, output type, type of data, source
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, images[0]);
        //define how textures are interpolated whenever their size need to be increased or decreased
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        //enables generation of mip-maps, copies of the texture smaller than it
        gl.generateMipmap(gl.TEXTURE_2D);
    };

    var texture2 = gl.createTexture();
    textures[1] = texture2;
    gl.bindTexture(gl.TEXTURE_2D, textures[1]);
    images[1] = new Image();
    images[1].src = baseDir+normalMap;
    images[1].onload= function() {
        gl.bindTexture(gl.TEXTURE_2D, textures[1]);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, images[1]);
        //texel > pixel
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        //pixel > texel
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        //33% extra-space
        gl.generateMipmap(gl.TEXTURE_2D);
    };

    //calls the drawScene() function
    drawScene();

    function animate(){
        //extracts the date to handle the current time
        var now = new Date();
        var hours = now.getHours();
        var minutes = now.getMinutes();
        var seconds = now.getSeconds();
        var millis = now.getMilliseconds();

        //*60/360=6, *12/360=30
        secondsHand = seconds * 6.0;
        minutesHand = minutes * 6.0;
        hoursHand = hours * 30.0;

        //updates the worldMatrices every seconds
        rotX = rotX + Rx;
        rotY = rotY + Ry;
        rotZ = rotZ + Rz;
        yAxis = yAxis + y;
        zAxis = zAxis + z;

        worldMatrices[0] = utils.MakeWorld(0.0, yAxis, zAxis, rotX, rotY, rotZ, 1.0);

        if(seconds % 2 == 0){
            worldMatrices[1] = utils.MakeWorld(-0.008317, 0.047, 0.018071, 4.0,0.0,0.0,1.0);
            worldMatrices[1] = utils.multiplyMatrices(worldMatrices[0], worldMatrices[1]);
            worldMatrices[2] = utils.MakeWorld(0.008317, 0.047, 0.018071, 4.0,0.0,0.0,1.0);
            worldMatrices[2] = utils.multiplyMatrices(worldMatrices[0], worldMatrices[2]);
            worldMatrices[6] = utils.MakeWorld(-0.005182, -0.014557, 0.002112, 0.0, 0.0, 30.0, 1.0);
            worldMatrices[6] = utils.multiplyMatrices(worldMatrices[0], worldMatrices[6]);
        }else{
            worldMatrices[1] = utils.MakeWorld(-0.008317, 0.047, 0.018071, -7.0,0.0,0.0,1.0);
            worldMatrices[1] = utils.multiplyMatrices(worldMatrices[0], worldMatrices[1]);
            worldMatrices[2] = utils.MakeWorld(0.008317, 0.047, 0.018071, -7.0,0.0,0.0,1.0);
            worldMatrices[2] = utils.multiplyMatrices(worldMatrices[0], worldMatrices[2]);
            worldMatrices[6] = utils.MakeWorld(-0.005182, -0.014557, 0.002112, 0.0, 0.0, -30.0, 1.0);
            worldMatrices[6] = utils.multiplyMatrices(worldMatrices[0], worldMatrices[6]);
        }
        worldMatrices[3] = utils.MakeWorld(0.0, 0.0 + yAxis, 0.0 + zAxis, 0.0 + rotX, 0.0 + rotY, minutesHand + rotZ, 1.0);
        worldMatrices[4] = utils.MakeWorld(0.0, 0.0 + yAxis, 0.0 + zAxis, 0.0 + rotX, 0.0 + rotY, hoursHand + rotZ, 1.0);
        worldMatrices[5] = utils.MakeWorld(0.0, 0.0 + yAxis, 0.0 + zAxis, 0.0 + rotX, 0.0 + rotY, secondsHand + rotZ, 1.0);
        worldMatrices[7] = utils.MakeWorld(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0);
        worldMatrices[7] = utils.multiplyMatrices(worldMatrices[0], worldMatrices[7]);              
    }

    function drawScene() {
        //sets the sliders, to send data to the shaders
        var canvas = document.getElementById("c");
        var slider = document.getElementById("fovSlider");
        perspectiveMatrix = utils.MakePerspective(slider.value, gl.canvas.width/gl.canvas.height, 0.1, 100.0);

        var sliderAlpha = document.getElementById("lightAlpha");
        var sliderBeta = document.getElementById("lightBeta");

        dirLightAlpha = -utils.degToRad(sliderAlpha.value);
        dirLightBeta  = -utils.degToRad(sliderBeta.value);

        directionalLight = [Math.cos(dirLightAlpha) * Math.cos(dirLightBeta),
                            Math.sin(dirLightAlpha),
                            Math.cos(dirLightAlpha) * Math.sin(dirLightBeta)
                           ];

        var sliderX = document.getElementById("pointX");
        var sliderY = document.getElementById("pointY");
        var sliderZ = document.getElementById("pointZ");
        point = [sliderX.value, sliderY.value, sliderZ.value];

        var sliderDecay = document.getElementById("decay");
        decay = sliderDecay.value;
        
        var sliderDist = document.getElementById("targetDist");
        targetDist = sliderDist.value;
        var sliderSpec = document.getElementById("specShine");
        specShine = sliderSpec.value;

        //calls the animate() function
        animate();

        angle = angle + rvy;
        elevation = elevation + rvx;

        cz = lookRadius * Math.cos(utils.degToRad(-angle)) * Math.cos(utils.degToRad(-elevation));
        cx = lookRadius * Math.sin(utils.degToRad(-angle)) * Math.cos(utils.degToRad(-elevation));
        cy = lookRadius * Math.sin(utils.degToRad(-elevation));
        viewMatrix = utils.MakeView(cx, cy, cz, elevation, -angle);

        gl.clearColor(0.85, 0.85, 0.85, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        //inversa trasposta della 3x3 view
        var lightDirMatrix = utils.invertMatrix(utils.transposeMatrix(viewMatrix));

        //for all the objects, sends data to the shaders
        for(i=0;i<8;i++){
            //body and eyes use the program 0
            if(i<3){
                gl.useProgram(program[0]);
            }
            //tail and flat use the program 2
            else if(i>5){
                gl.useProgram(program[2]);
            }
            //hands use program 1
            else{
                gl.useProgram(program[1]); 
            }

            var viewWorldMatrix = utils.multiplyMatrices(viewMatrix, worldMatrices[i]);
            var projectionMatrix = utils.multiplyMatrices(perspectiveMatrix, viewWorldMatrix);
            
            //sets the normal matrix for the camera space --> inversa trasposta della viewWorld
            var normalMatrix = utils.invertMatrix(utils.transposeMatrix(viewWorldMatrix));

            //uniforms are constant during execution
            gl.uniformMatrix4fv(matrixLocation[i], gl.FALSE, utils.transposeMatrix(projectionMatrix));
            gl.uniformMatrix4fv(viewWorldMatrixLocation[i], gl.FALSE, utils.transposeMatrix(viewWorldMatrix));
            gl.uniformMatrix4fv(viewMatrixLocation[i], gl.FALSE, utils.transposeMatrix(viewMatrix));
            gl.uniformMatrix4fv(normalMatrixPositionHandle[i], gl.FALSE, utils.transposeMatrix(normalMatrix));
            gl.uniformMatrix4fv(lightDirMatrixPositionHandle[i], gl.FALSE, utils.transposeMatrix(lightDirMatrix));

            gl.uniform3fv(lightColorHandle[i],  directionalLightColor);
            gl.uniform4fv(specularColorHandle[i],  specularColor);
            gl.uniform3fv(ambientColorHandle[i],  ambientColor);
            gl.uniform3fv(hemisphericUpColorHandle[i],  hemisphericUpColor);
            gl.uniform3fv(hemisphericDownColorHandle[i],  hemisphericDownColor);
            gl.uniform3fv(lightDirectionHandle[i],  directionalLight);
            gl.uniform3fv(pointPositionHandle[i],  point);
            gl.uniform1f(decayHandle[i], decay);
            gl.uniform1f(targetDistHandle[i], targetDist);
            gl.uniform1f(specShineHandle[i], specShine);

            if(i>2){
                gl.uniform4fv(tailColorLocation[i], textureColor);
            }

            if(i <= 2){
                gl.uniform1f(normalMapBoolean[i], nmBoolean);
                
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, textures[0]);
                gl.uniform1i(textLocation[i], 0);

                gl.activeTexture(gl.TEXTURE0 + 1);
                gl.bindTexture(gl.TEXTURE_2D, textures[1]);
                gl.uniform1i(normalMapLocation[i], 1);
            }

            gl.bindVertexArray(vaos[i]);
            gl.drawElements(gl.TRIANGLES, catIndices[i].length, gl.UNSIGNED_SHORT, 0 );
        }

        //saves the reqId in order to stop the drawScene() function when requested by the gui
        reqId = window.requestAnimationFrame(drawScene);
    }

}

async function init(){
    var path = window.location.pathname;
    var page = path.split("/").pop();
    baseDir = window.location.href.replace(page, '');
    shaderDir = baseDir+"shaders/";

    var canvas = document.getElementById("c");
    var slider = document.getElementById("fovSlider");
    var sliderAlpha = document.getElementById("lightAlpha");
    var sliderBeta = document.getElementById("lightBeta");
    var sliderX = document.getElementById("pointX");
    var sliderY = document.getElementById("pointY");
    var sliderZ = document.getElementById("pointZ");
    var sliderDecay = document.getElementById("decay");
    var sliderDist = document.getElementById("targetDist");
    var sliderSpec = document.getElementById("specShine");
    window.addEventListener("keyup", keyFunctionUp, false);
    window.addEventListener("keydown", keyFunctionDown, false);
    gl = canvas.getContext("webgl2");
    if (!gl) {
        document.write("GL context not opened");
        return;
    }
    window.onresize = doResize;
    canvas.width  = window.innerWidth-430;
    canvas.height = window.innerHeight-32;

    await utils.loadFiles([shaderDir + 'vs_tex.glsl', shaderDir + 'fs_tex.glsl'], function (shaderText) {
        shaderText[2] = lightType()[typeNumber];
        shaderText[3] = ambientType()[ambientNumber];
        shaderText[4] = diffuseType()[diffuseNumber];
        shaderText[5] = specularType()[specularNumber];
        shaderText[6] = outCol();
        var vertexShader = utils.createShader(gl, gl.VERTEX_SHADER, shaderText[0]);
        var fragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, shaderText[1] + shaderText[2] + shaderText[3] + shaderText[4] + shaderText[5] + shaderText[6]);
        program[0] = utils.createProgram(gl, vertexShader, fragmentShader);

    });
    await utils.loadFiles([shaderDir + 'vs_notex.glsl', shaderDir + 'fs_notex.glsl'], function (shaderText) {
        shaderText[2] = lightType()[typeNumber];
        shaderText[3] = ambientType()[ambientNumberH];
        shaderText[4] = diffuseType()[diffuseNumberH];
        shaderText[5] = specularType()[specularNumber];
        shaderText[6] = outColH();
        var vertexShader = utils.createShader(gl, gl.VERTEX_SHADER, shaderText[0]);
        var fragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, shaderText[1] + shaderText[2] + shaderText[3] + shaderText[4] + shaderText[5] + shaderText[6]);
        program[1] = utils.createProgram(gl, vertexShader, fragmentShader);

    });
    await utils.loadFiles([shaderDir + 'vs_notex.glsl', shaderDir + 'fs_notex.glsl'], function (shaderText) {
        shaderText[2] = lightType()[typeNumber];
        shaderText[3] = ambientType()[ambientNumberT];
        shaderText[4] = diffuseType()[diffuseNumberT];
        shaderText[5] = specularType()[specularNumber];
        shaderText[6] = outColT();
        var vertexShader = utils.createShader(gl, gl.VERTEX_SHADER, shaderText[0]);
        var fragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, shaderText[1] + shaderText[2] + shaderText[3] + shaderText[4] + shaderText[5] + shaderText[6]);
        program[2] = utils.createProgram(gl, vertexShader, fragmentShader);

    });

    //###################################################################################
    //This loads the obj model in the pigModel variable
    var catObjStr = await utils.get_objstr(baseDir+ modelStr);
    catModel = new OBJ.Mesh(catObjStr);

    var eye1ObjStr = await utils.get_objstr(baseDir+ eye1Str);
    eye1Model = new OBJ.Mesh(eye1ObjStr);

    var eye2ObjStr = await utils.get_objstr(baseDir+ eye1Str);
    eye2Model = new OBJ.Mesh(eye2ObjStr);

    var hand1ObjStr = await utils.get_objstr(baseDir+ hand1Str);
    hand1Model = new OBJ.Mesh(hand1ObjStr);

    var hand2ObjStr = await utils.get_objstr(baseDir+ hand2Str);
    hand2Model = new OBJ.Mesh(hand2ObjStr);

    var hand3ObjStr = await utils.get_objstr(baseDir+ hand3Str);
    hand3Model = new OBJ.Mesh(hand3ObjStr);

    var tailObjStr = await utils.get_objstr(baseDir+ tailStr);
    tailModel = new OBJ.Mesh(tailObjStr);
    //###################################################################################

    main();
}

window.onload = init;