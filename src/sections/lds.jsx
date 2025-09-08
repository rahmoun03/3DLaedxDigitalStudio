import React, { useRef, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree, extend} from "@react-three/fiber";
import { MeshReflectorMaterial, MeshTransmissionMaterial, OrbitControls, useTexture, useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three'
import { GUI } from 'dat.gui';

import LiquidSphere from '../components/LiquidSphere';

// shaders
import ldsVertexShader from './shaders/lds/vertex.glsl';
import ldsFragmentShader from './shaders/lds/fragment.glsl';


// function Sphere() {
//     return (
//         <mesh rotation={[0.4, 0.2, 0]} position={[0, 1.3, 0]} >
//         <sphereGeometry args={[1, 64, 64]} />
//         <shaderMaterial 
//             color="#F7EFC5"
//         />
//         </mesh>
//     );
// }


function Sphere() {

    const geometryRef = useRef();
    const clock = new THREE.Clock();
    
    useEffect(() => {
        
        console.log(geometryRef.current);
        
    }, []);
    
    useEffect(() => {
        const gui = new GUI();
        gui.add(myMaterial.uniforms.uFrequency, 'value').min(0).max(100).step(0.1).name('Frequency');
        // gui.add(myMaterial.uniforms.uColor, 'value').min(0).max(100).step(0.1).name('Color');
        
    }, []);
    
    const myMaterial = new THREE.RawShaderMaterial({
        uniforms: {
            uFrequency: { value : 5.0 },
            uTime: { value : 0.0 },
            uColor: { value : new THREE.Color('orange') },
        },
        vertexShader: ldsVertexShader,
        fragmentShader: ldsFragmentShader,
        wireframe: false,
    })
    
    useFrame(() => {
        const elapsed = clock.getElapsedTime();
        myMaterial.uniforms.uTime.value = elapsed * 3;
    })

    return (
        <mesh position={[0, 1.3, 0]}  >
            <sphereGeometry args={[1, 64, 64]} ref={geometryRef}/>
            <primitive  object={myMaterial} attach='material' />
        </mesh>
    );
}


function Ground() {

    // const [AO, roughness, normal, baseColor, height] = useTexture([
    // 	'/Textures/Stone/Wall_Stone_025_ambientOcclusion.png',
    // 	'/Textures/Stone/Wall_Stone_025_roughness.png',
    // 	'/Textures/Stone/Wall_Stone_025_normal.png',
    // 	'/Textures/Stone/Wall_Stone_025_basecolor.png',
    // 	'/Textures/Stone/Wall_Stone_025_height.png',
    // ])

    const [AO, roughness, normal, baseColor, height] = useTexture([
    	'/Textures/Stone2/Stone_Path_008_ambientOcclusion.jpg',
    	'/Textures/Stone2/Stone_Path_008_roughness.jpg',
    	'/Textures/Stone2/Stone_Path_008_normal.jpg',
    	'/Textures/Stone2/Stone_Path_008_basecolor.jpg',
    	'/Textures/Stone2/Stone_Path_008_height.png',
    ])

    // const [AO, roughness, normal, baseColor, height] = useTexture([
    // 	'/Textures/Floor/Stylized_Stone_Floor_006_ambientOcclusion.png',
    // 	'/Textures/Floor/Stylized_Stone_Floor_006_roughness.png',
    // 	'/Textures/Floor/Stylized_Stone_Floor_006_normal.png',
    // 	'/Textures/Floor/Stylized_Stone_Floor_006_basecolor.png',
    // 	'/Textures/Floor/Stylized_Stone_Floor_006_height.png',
    // ])


    normal.repeat.set(8, 8);
    roughness.repeat.set(8, 8);
    AO.repeat.set(8, 8);
    height.repeat.set(8, 8);
    baseColor.repeat.set(8, 8);


    height.wrapS = height.wrapT = baseColor.wrapS = baseColor.wrapT = AO.wrapS = AO.wrapT = normal.wrapS = normal.wrapT = roughness.wrapS = roughness.wrapT = THREE.RepeatWrapping;

    return (
        <group>

            {/* mirror */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.07, 0]} receiveShadow>
                <planeGeometry args={[30, 30]} />

                <MeshReflectorMaterial
                    transparent
                    opacity={0.5}         // how see-through
                    roughness={0}         // perfectly smooth surface
                    blur={[0, 0]}         // no distortion blur
                    resolution={1024}     // reflection resolution
                    mixBlur={0}           // no mixed blur
                    mixStrength={0.5}       // reflection strength
                    mirror={1}          // reflection amount
                    depthWrite={false}    // better transparent blending
                    envMapIntensity={0}   // brightness from environment
                />
            </mesh>
            

            {/* textures */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                <planeGeometry args={[30, 30, 720, 720]} />
                <meshPhysicalMaterial
                    map={baseColor}
                    normalMap={normal}
                    roughnessMap={roughness}
                    // roughness={1}
                    aoMap={AO}
                    displacementMap={height}
                    displacementScale={0.15}
                />
            </mesh>
        </group>
    );
}

function LdsScene() {
    const { camera } = useThree();
    const groupRef = useRef();
    const mouse = useRef({ x: 0, y: 0 });



    useEffect(() => {
        const handleMouseMove = (e) => {
            mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    // Smooth rotation
    useFrame(() => {
        if (groupRef.current) {
            groupRef.current.rotation.y += (mouse.current.x * 0.2 - groupRef.current.rotation.y) * 0.02;
            groupRef.current.rotation.x += (mouse.current.y * 0.1 - groupRef.current.rotation.x) * 0.01;
        }
        camera.lookAt(0, 1.3, 0)
    });



    return (
        <group ref={groupRef}>
            <Sphere />
            {/* <LiquidSphere /> */}
            <Ground />
        </group>
    );
}


export default LdsScene;
