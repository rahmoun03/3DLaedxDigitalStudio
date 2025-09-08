import React, { useRef, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshReflectorMaterial, MeshTransmissionMaterial, OrbitControls, useTexture, useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three'


function Sphere() {
    return (
        <mesh rotation={[0.4, 0.2, 0]} position={[0, 1.3, 0]} >
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial 
            metalness={0.8}
            roughness={5}
            color="hotpink"
            emissive="hotpink" 
            emissiveIntensity={3} 
        />
        </mesh>
    );
}

function Ground() {

    const [AO, roughness, normal, baseColor, height] = useTexture([
    	'/Textures/Floor/Stylized_Stone_Floor_006_ambientOcclusion.png',
    	'/Textures/Floor/Stylized_Stone_Floor_006_roughness.png',
    	'/Textures/Floor/Stylized_Stone_Floor_006_normal.png',
    	'/Textures/Floor/Stylized_Stone_Floor_006_basecolor.png',
    	'/Textures/Floor/Stylized_Stone_Floor_006_height.png',
    ])


    normal.repeat.set(8, 8);
    roughness.repeat.set(8, 8);
    AO.repeat.set(8, 8);
    height.repeat.set(8, 8);
    baseColor.repeat.set(8, 8);


    height.wrapS = height.wrapT = baseColor.wrapS = baseColor.wrapT = AO.wrapS = AO.wrapT = normal.wrapS = normal.wrapT = roughness.wrapS = roughness.wrapT = THREE.RepeatWrapping;

    return (
        <group>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]} receiveShadow>
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
                    roughness={1}
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
    const [mouse, setMouse] = useState({ x: 0, y: 0 });


    useEffect(() => {
        const handleMouseMove = (e) => {
            setMouse({
                x: (e.clientX / window.innerWidth) * 2 - 1, 
                y: -(e.clientY / window.innerHeight) * 2 + 1
            });
            // console.log("x : ",(e.clientX / window.innerWidth) * 2 - 1);
            // console.log("y : ",-(e.clientY / window.innerHeight) * 2 + 1);
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    // Smooth rotation
    useFrame(() => {
        if (groupRef.current) {
            groupRef.current.rotation.y += (mouse.x * 0.2 - groupRef.current.rotation.y) * 0.02;
            groupRef.current.rotation.x += (mouse.y * 0.1 - groupRef.current.rotation.x) * 0.01;
        }
        camera.lookAt(0, 1, 0)
    });

    return (
        <group ref={groupRef}>
            <Sphere />
            <Ground />
        </group>
    );
}


export default LdsScene;

// export default function App() {


//     return (
//         <Canvas
//             camera={{ position: [0, 1, 5] , fov: 50 }}
//             style={{ height: "100vh", background: "#000" }}
//             shadows
//         >
//             {/* Lights */}
//             {/* <ambientLight intensity={0.1} /> */}
//             <pointLight 
//                 position={[0, 1, 0]}
//                 intensity={3}
//                 color="#F7EFC5" 
//                 castShadow
//             />

//             {/* <OrbitControls/> */}
//             {/* Scene */}
//             <LdsScene />
//         </Canvas>
//     );
// }
