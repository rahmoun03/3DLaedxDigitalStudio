uniform vec3 uColor;
uniform vec2 iResolution;
uniform float uTime;
uniform vec3 uColor1, uColor2, uColor3, uColor4;

varying vec4 vElevation;
varying vec2 vUv;


vec3 pallet(in float t)
{

    vec3 a = uColor1;
    vec3 b = uColor2;
    vec3 c = uColor3;
    vec3 d = uColor4;


    return a + b * cos(6.28318 * (c * t +d));
}

vec4 mainImage(in vec2 fragCoord){

    //normalize
    vec2 normalUv = fragCoord * 2.0 - 1.0;
    vec2 uv0 = normalUv;
    vec3 finalColor = vec3(0.0);

    for(float i = 0.0; i < 4.0; i++) {

        normalUv = fract(normalUv * 2.0) - 0.5;
        float d = length(normalUv) * exp(-length(uv0));
        vec3 col = pallet(length(uv0) + (i*.4) + (uTime *.8));
        d = sin(d * 8. - (uTime * 0.4))/8.;
        d = abs(d);
        d = smoothstep(0.0, 0.3, d);
        d =  0.02 / d;
        finalColor += col * d;
    }

    // return vec4(normalUv, 0.0, 1.0);
    return vec4(finalColor, 1.0);
}

void main() {

    vec3 normalizedColor = uColor.rgb * vElevation.rgb * 0.9;


    gl_FragColor = vec4(normalizedColor, 1.0);
    gl_FragColor = vec4(mainImage(vUv));

}
