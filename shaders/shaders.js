function lightType(){
    var noneT = 'vec3 lDir = vec3(0.0, 0.0, 0.0); color = lightColor;';
    var direct = 'vec3 lDir = normalize(mat3(lightDirMatrix) * lightDirection); color = lightColor;';
    var point = 'vec3 pointPos = pointPosition; vec3 pointPosCamera = (vMatrix * vec4(pointPos, 1.0)).xyz; vec3 pointDir = normalize(pointPosCamera - pos); vec3 lDir = mat3(lightDirMatrix) * pointDir; color = lightColor * pow((targetDist / length(pointPosCamera - pos)), decay);';
    var spot = 'vec3 spotPos = pointPosition; vec3 spotPosCamera = (vMatrix * vec4(spotPos, 1.0)).xyz; vec3 spotDir = normalize(spotPosCamera - pos); vec3 lDir = mat3(lightDirMatrix) * spotDir;color = lightColor * pow((targetDist / length(spotPosCamera - pos)), decay) * clamp((-dot(lDir, spotPosCamera) - cos(radians(30.0/2.0))) / (cos(radians(80.0*30.0/2.0)) - cos(radians(30.0/2.0))), 0.0, 1.0);';
    return [noneT, direct, point, spot];
}

function ambientType(){
    var noneA = 'vec3 ambient = vec3(0.0, 0.0, 0.0);';
    var ambient = 'vec3 ambientReflection = texelColor.rgb; vec3 ambientEmission = ambientColor; vec3 ambient = ambientReflection * ambientEmission;';
    var hemispheric = 'vec3 ambientReflection = texelColor.rgb; vec3 ambientUp = hemisphericUpColor; vec3 ambientDown = hemisphericDownColor; vec3 hemisphericEmission = (((dot(nNormal, lDir) + 1.0) / 2.0) * ambientUp + ((1.0 - dot(nNormal, lDir)) / 2.0) * ambientDown); vec3 ambient = ambientReflection * hemisphericEmission;';
    var ambientH = 'vec3 ambientReflection = colorH.rgb; vec3 ambientEmission = ambientColor; vec3 ambient = ambientReflection * ambientEmission;';
    var hemisphericH = 'vec3 ambientReflection = colorH.rgb; vec3 ambientUp = hemisphericUpColor; vec3 ambientDown = hemisphericDownColor; vec3 hemisphericEmission = (((dot(nNormal, lDir) + 1.0) / 2.0) * ambientUp + ((1.0 - dot(nNormal, lDir)) / 2.0) * ambientDown); vec3 ambient = ambientReflection * hemisphericEmission;';
    var ambientT = 'vec3 ambientReflection = colorT.rgb; vec3 ambientEmission = ambientColor; vec3 ambient = ambientReflection * ambientEmission;';
    var hemisphericT = 'vec3 ambientReflection = colorT.rgb; vec3 ambientUp = hemisphericUpColor; vec3 ambientDown = hemisphericDownColor; vec3 hemisphericEmission = (((dot(nNormal, lDir) + 1.0) / 2.0) * ambientUp + ((1.0 - dot(nNormal, lDir)) / 2.0) * ambientDown); vec3 ambient = ambientReflection * hemisphericEmission;';
    return [noneA, ambient, hemispheric, ambientH, hemisphericH, ambientT, hemisphericT];
}

function diffuseType(){
    var noneD = 'vec3 diffuse = texelColor.rgb;';
    var diffuse = 'vec3 diffuse = texelColor.rgb * clamp(dot(lDir,nNormal), 0.0, 1.0);';
    var toon = 'vec3 diffuse = texelColor.rgb * max(sign(max(dot(lDir,nNormal), 0.0) - 0.75),0.5);';
    //al crescere di sigma, Oren-Nayar diventa più scuro
    var orenNayar = 'float sigma = 0.5; vec3 L = texelColor.xyz * clamp(dot(lDir,nNormal),0.0,1.0); float A = 1.0 - (0.5 * (pow(sigma, 2.0)/(pow(sigma, 2.0) + 0.33))); float B = (0.45 * (pow(sigma, 2.0)/(pow(sigma, 2.0) + 0.09))); vec3 vi = normalize(lDir - (dot(lDir, nNormal)*nNormal)); vec3 vr = normalize(eyedirVec - (dot(eyedirVec, nNormal)*nNormal)); float G = max(0.0, dot(vi, vr)); float thetaI = acos(dot(lDir, nNormal)); float thetaR = acos(dot(eyedirVec, nNormal)); float alpha = max(thetaI, thetaR); float beta = min(thetaI, thetaR); vec3 diffuse = (L * (A + B * G * sin(alpha) * tan(beta)));';
    var noneDH = 'vec3 diffuse = colorH.rgb;';
    var noneDT = 'vec3 diffuse = colorT.rgb;';
    var diffuseH = 'vec3 diffuse = colorH.rgb * clamp(dot(lDir,nNormal), 0.0, 1.0);';
    var diffuseT = 'vec3 diffuse = colorT.rgb * clamp(dot(lDir,nNormal), 0.0, 1.0);';
    var toonH = 'vec3 diffuse = colorH.rgb * max(sign(max(dot(lDir,nNormal), 0.0) - 0.75),0.5);';
    var toonT = 'vec3 diffuse = colorT.rgb * max(sign(max(dot(lDir,nNormal), 0.0) - 0.75),0.5);';
    var orenNayarH = 'float sigma = 0.5; vec3 L = colorH.rgb * clamp(dot(lDir,nNormal),0.0,1.0); float A = 1.0 - (0.5 * (pow(sigma, 2.0)/(pow(sigma, 2.0) + 0.33))); float B = (0.45 * (pow(sigma, 2.0)/(pow(sigma, 2.0) + 0.09))); vec3 vi = normalize(lDir - (dot(lDir, nNormal)*nNormal)); vec3 vr = normalize(eyedirVec - (dot(eyedirVec, nNormal)*nNormal)); float G = max(0.0, dot(vi, vr)); float thetaI = acos(dot(lDir, nNormal)); float thetaR = acos(dot(eyedirVec, nNormal)); float alpha = max(thetaI, thetaR); float beta = min(thetaI, thetaR); vec3 diffuse = (L * (A + B * G * sin(alpha) * tan(beta)));';
    var orenNayarT = 'float sigma = 0.5; vec3 L = colorT.rgb * clamp(dot(lDir,nNormal),0.0,1.0); float A = 1.0 - (0.5 * (pow(sigma, 2.0)/(pow(sigma, 2.0) + 0.33))); float B = (0.45 * (pow(sigma, 2.0)/(pow(sigma, 2.0) + 0.09))); vec3 vi = normalize(lDir - (dot(lDir, nNormal)*nNormal)); vec3 vr = normalize(eyedirVec - (dot(eyedirVec, nNormal)*nNormal)); float G = max(0.0, dot(vi, vr)); float thetaI = acos(dot(lDir, nNormal)); float thetaR = acos(dot(eyedirVec, nNormal)); float alpha = max(thetaI, thetaR); float beta = min(thetaI, thetaR); vec3 diffuse = (L * (A + B * G * sin(alpha) * tan(beta)));';
    return [noneD, diffuse, toon, orenNayar, noneDH, noneDT, diffuseH, diffuseT, toonH, toonT, orenNayarH, orenNayarT];
}

function specularType(){
    var noneS = 'vec3 illumination = clamp(((diffuse)*color)+ambient, 0.0, 1.0);';
    var phong = 'float sLAcontr = pow(clamp(dot(eyedirVec, -reflect(lDir, nNormal)),0.0,1.0), specShine); vec4 specular = specularColor * sLAcontr; vec3 illumination = clamp(((specular.rgb + diffuse)*color)+ambient, 0.0, 1.0);';
    var blinn = 'float blinn = pow(clamp(dot(nNormal, normalize(lDir + eyedirVec)),0.0,1.0), specShine); vec4 specular = specularColor * blinn; vec3 illumination = clamp(((specular.rgb + diffuse)*color)+ambient, 0.0, 1.0);';
    var toonPhong = 'vec4 specular = max(sign(dot(eyedirVec, -reflect(lDir, nNormal)) - 0.95), 0.0) * specularColor * max(sign(max(0.0, dot(nNormal, lDir))), 0.0); vec3 illumination = clamp(((specular.rgb + diffuse)*color)+ambient, 0.0, 1.0);';
    var toonBlinn = 'vec4 specular = max(sign(dot(nNormal,  normalize(lDir + eyedirVec)) - 0.95), 0.0) * specularColor * max(sign(max(0.0, dot(nNormal, lDir))), 0.0); vec3 illumination = clamp(((specular.rgb + diffuse)*color)+ambient, 0.0, 1.0);';
    //G è il geometric term; F è il Fresnel term, light response in base all'angolo di incidenza con il viewer (F_0 = 0.9, ma potrebbe variare tra 0 e 1); D distribution term, roughness of the surface
    var cookTorrance = 'vec3 halfVec = normalize(lDir + eyedirVec); float LdotN = max(0.00001, max(0.0, dot(nNormal, lDir))); float VdotN = max(0.00001, max(dot(nNormal, eyedirVec), 0.0)); float HdotN = max(0.00001, max(dot(nNormal, halfVec), 0.0));float HdotV = max(0.00001, dot(halfVec, eyedirVec));float Gc = min(1.0, 2.0 * HdotN * min(VdotN, LdotN) / HdotV);float F = 0.9 + (1.0 - 0.9) * pow(1.0 - HdotV, 5.0);float HtoN2 = HdotN * HdotN;float M = (201.0 - specShine) / 200.0 * 0.5;float M2 = M * M;float D = exp(- (1.0-HtoN2) / (HtoN2 * M2)) / (3.14159 * M2 * HtoN2 * HtoN2);vec4 specular = specularColor * D * F * Gc / (4.0 * VdotN);vec3 illumination = clamp(((specular.rgb + diffuse)*color)+ambient, 0.0, 1.0);';
    return [noneS, phong, blinn, toonPhong, toonBlinn, cookTorrance];
}

function outCol(){
    return 'if(all(equal(lDir, vec3(0.0,0.0,0.0)))){ outColor = texelColor;}else{outColor = vec4(illumination.rgb, texelColor.a);}}';
}

function outColH(){
    return 'if(all(equal(lDir, vec3(0.0,0.0,0.0)))){ outColor = colorH;}else{outColor = vec4(illumination.rgb, colorH.a);}}';
}

function outColT(){
    return 'if(all(equal(lDir, vec3(0.0,0.0,0.0)))){ outColor = colorT;}else{outColor = vec4(illumination.rgb, colorT.a);}}';
}