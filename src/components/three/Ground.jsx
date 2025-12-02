import { useRef } from "react";
import { MeshReflectorMaterial, useTexture } from '@react-three/drei';
import * as THREE from 'three'
import { Physics } from "@react-three/rapier";
import { RigidBody, useRapier } from "@react-three/rapier";

export default function Ground() {
	// const { progressRightRef, progressLeftRef } = useProgressStore();
	const groupRef = useRef();

	// const [AO, roughness, normal, baseColor, height] = useTexture([
	// 	'/textures/Stone/Wall_Stone_025_ambientOcclusion.png',
	// 	'/textures/Stone/Wall_Stone_025_roughness.png',
	// 	'/textures/Stone/Wall_Stone_025_normal.png',
	// 	'/textures/Stone/Wall_Stone_025_basecolor.png',
	// 	'/textures/Stone/Wall_Stone_025_height.png',
	// ])

	const [AO, roughness, normal, baseColor, height] = useTexture([
		'/textures/Stone2/Stone_Path_008_ambientOcclusion.jpg',
		'/textures/Stone2/Stone_Path_008_roughness.jpg',
		'/textures/Stone2/Stone_Path_008_normal.jpg',
		'/textures/Stone2/Stone_Path_008_basecolor.jpg',
		'/textures/Stone2/Stone_Path_008_height.png',
	])

	// const [AO, roughness, normal, baseColor, height] = useTexture([
	// 	'/textures/Floor/Stylized_Stone_Floor_006_ambientOcclusion.png',
	// 	'/textures/Floor/Stylized_Stone_Floor_006_roughness.png',
	// 	'/textures/Floor/Stylized_Stone_Floor_006_normal.png',
	// 	'/textures/Floor/Stylized_Stone_Floor_006_basecolor.png',
	// 	'/textures/Floor/Stylized_Stone_Floor_006_height.png',
	// ])


	normal.repeat.set(8, 8);
	roughness.repeat.set(8, 8);
	AO.repeat.set(8, 8);
	height.repeat.set(8, 8);
	baseColor.repeat.set(8, 8);


	height.wrapS = height.wrapT = baseColor.wrapS = baseColor.wrapT = AO.wrapS = AO.wrapT = normal.wrapS = normal.wrapT = roughness.wrapS = roughness.wrapT = THREE.RepeatWrapping;


	return (
        <RigidBody>
            <group ref={groupRef} position={[0, -3.1, -10]}>
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
                    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
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
        </RigidBody>
	);
}