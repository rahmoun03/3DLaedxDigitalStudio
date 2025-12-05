uniform float uTime;
uniform vec3 uColor;
uniform sampler2D uTexture;
uniform bool uUseTexture;

uniform float uIntensity;
uniform float uStripeSpeed;
uniform float uStripeDensity;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;

void main() {
	vec3 normal = normalize(vNormal);
	if (!gl_FrontFacing) normal *= -1.0;

	// Stripe animation
	float stripe = mod((vPosition.y - uTime * uStripeSpeed) * uStripeDensity, 1.0);
	stripe = pow(stripe, 3.0);

	// Fresnel
	vec3 viewDirection = normalize(vPosition - cameraPosition);
	float fresnel = dot(viewDirection, normal) + 1.0;
	fresnel = pow(fresnel, 0.8);

	float falloff = smoothstep(0.9, 0.0, fresnel);

	float holographic = (fresnel * stripe + fresnel * 1.25) * falloff;
	holographic *= uIntensity;

	vec3 base = uColor;

	// Optional texture (alpha-style)
	if (!!uUseTexture) {
		float texMask = texture2D(uTexture, vUv).r;
		holographic *= texMask;
	}

	gl_FragColor = vec4(base, holographic);

	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}







// void main(){

//     vec3 normal = normalize(vNormal);
//     if(!gl_FrontFacing)
//         normal *= -1.0; 

//     // STRIPeS
//     float stripe = mod((vPosition.y - uTime * 0.2) * 20.0, 1.0);
//     stripe = pow(stripe, 3.0);


//     vec3 viewDirection = normalize(vPosition - cameraPosition);
	
//     // fresnel
//     float fresnel = dot(viewDirection, normal) + 1.0;
//     fresnel = pow(fresnel, 0.8);

//     // falloff
//     float falloff = smoothstep(0.9, 0.0, fresnel);

//     // holographic 
//     float holographic = fresnel * stripe;
//     holographic += fresnel * 1.25;
//     holographic *= falloff;

//     // gl_FragColor = vec4(vec3(1.0), stripe);
//     gl_FragColor = vec4(uColor, holographic);

//     #include <tonemapping_fragment>
//     #include <colorspace_fragment>
// }