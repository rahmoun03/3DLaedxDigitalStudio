import React, { useRef, useEffect, Suspense, use } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { MeshReflectorMaterial, useTexture, useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three'
import { SkeletonUtils } from "three-stdlib";



import LiquidSphere from '@/components/three/LiquidSphere'





function BeeGroup({bees}) {
    const { scene, animations } = useGLTF("/models/bee/source/Bee.glb");
    
    return (
        <>
        {bees.map((bee, index) => (
            <Bee
                key={bee.id}
                id={bee.id}
                scene={scene}
                animations={animations}
                animation={bee.animation}
                position={bee.position}
                scale={bee.scale}
                rotation={bee.rotation}
            />
        ))}
        </>
    );
}

function Bee({ scene, animations, animation, id, ...props }) {
    const group = useRef();
    const clone = SkeletonUtils.clone(scene);
    const { actions } = useAnimations(animations, group);
    const { camera } = useThree();
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 2), -2);
    const intersectionPoint = new THREE.Vector3();

    // ✅ Load color texture
    const colorMap = useTexture("/models/bee/textures/gltf_embedded_0.png") // <-- put your texture path here
    colorMap.encoding = THREE.sRGBEncoding


    useEffect(() => {
        
        if (actions && animations.length > 0) {
            const anim = actions[animations[animation].name]
    
            if (anim?.isRunning()) {
                console.log("The anim animation is currently playing")
            }
    
            if (!anim?.isScheduled()) {
                console.log("The anim animation has not been queued to play")
            }
    
            if (anim?.paused) {
                console.log("The anim animation is paused")
            }
            actions[animations[animation].name]?.play();
        }
    }, [actions, animations]);


    // ✅ Apply the color texture to all meshes
    useEffect(() => {
        clone.traverse((child) => {
            if (child.isMesh) {
                child.material.map = colorMap
                child.material.needsUpdate = true
            }
        })
    }, [clone, colorMap])
    

    useEffect(() => {

        const handleMouseMove = (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            if(mouse.x >= 0.70) mouse.x = 0.70;
            if(mouse.x <= -0.70) mouse.x = -0.70;
            if(mouse.y <= -0.70) mouse.y = -0.70;
            if(mouse.y >= 0.70) mouse.y = 0.70;
            
            // console.log(' Mouse cood : ', mouse.x, mouse.y);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    useFrame(() => {
        if (id === 1) {
            raycaster.setFromCamera(mouse, camera);
            raycaster.ray.intersectPlane(plane, intersectionPoint);

            if (group.current) {
                group.current.position.lerp(intersectionPoint, 0.05);
            }
        }
    });



    return (
        <>
            <primitive ref={group} object={clone} {...props} />
            <mesh
                // rotation={[-Math.PI / 2, 0, 0]}
                position={[0, 5.8, 0.8]}
                // onPointerMove={handleMouseMove}
                visible={false}
            >
                <planeGeometry 
                    args={[10, 10]}
                />
                <meshStandardMaterial />
            </mesh>
        </>
    );
}



function Sphere() {

    const [AO, roughness, normal, baseColor, height, SSS] = useTexture([
        '/textures/Honeycomb/Honeycomb_001_ambientOcclusion.jpg',
        '/textures/Honeycomb/Honeycomb_001_roughness.jpg',
        '/textures/Honeycomb/Honeycomb_001_normal.jpg',
        '/textures/Honeycomb/Honeycomb_001_basecolor.jpg',
        '/textures/Honeycomb/Honeycomb_001_height.png',
        '/textures/Honeycomb/Honeycomb_001_SSS.jpg',
    ])

    normal.repeat.set(1, 1);
    roughness.repeat.set(1, 1);
    AO.repeat.set(1, 1);
    height.repeat.set(1, 1);
    baseColor.repeat.set(1, 1);


    height.wrapS = height.wrapT = baseColor.wrapS = baseColor.wrapT = AO.wrapS = AO.wrapT = normal.wrapS = normal.wrapT = roughness.wrapS = roughness.wrapT = THREE.RepeatWrapping;


    return (
        <mesh rotation={[0.4, 0.2, 0]} position={[0, 1.3, 0]} >
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhysicalMaterial
                    map={baseColor}
                    normalMap={normal}
                    roughnessMap={roughness}
                    aoMap={AO}
                    displacementMap={height}
                    displacementScale={0.15}
                    thicknessMap={SSS}
        />
        </mesh>
    );
}

function Ground() {


    const [AO, roughness, normal, baseColor, height, SSS] = useTexture([
        '/textures/Honeycomb/Honeycomb_001_ambientOcclusion.jpg',
        '/textures/Honeycomb/Honeycomb_001_roughness.jpg',
        '/textures/Honeycomb/Honeycomb_001_normal.jpg',
        '/textures/Honeycomb/Honeycomb_001_basecolor.jpg',
        '/textures/Honeycomb/Honeycomb_001_height.png',
        '/textures/Honeycomb/Honeycomb_001_SSS.jpg',
    ])

    // const [AO, roughness, normal, baseColor, height, SSS] = useTexture([
    // 	'/textures/honeycomb2/Honeycomb_002_ambientOcclusion.jpg',
    // 	'/textures/honeycomb2/Honeycomb_002_roughness.jpg',
    // 	'/textures/honeycomb2/Honeycomb_002_normal.jpg',
    // 	'/textures/honeycomb2/Honeycomb_002_basecolor.jpg',
    // 	'/textures/honeycomb2/Honeycomb_002_height.png',
    // 	'/textures/honeycomb2/Honeycomb_002_SSS.jpg',
    // ])

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
            {/* <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                <planeGeometry args={[30, 30, 720, 720]} />
                <meshPhysicalMaterial
                    map={baseColor}
                    normalMap={normal}
                    roughnessMap={roughness}
                    aoMap={AO}
                    displacementMap={height}
                    displacementScale={0.15}
                    thicknessMap={SSS}
                />
            </mesh> */}
        </group>
    );
}

function HiveXperience() {

    const { camera } = useThree();
    const groupRef = useRef();
    const hiveSphere = useRef();
    const mouse = useRef({ x: 0, y: 0 });
    const bees = [
        // { id: 0, animation : 0, position : [0, 0, 0], scale: [1.3, 1.3, 1.3], rotation: [0, 0, 0]},
        { id: 1, animation : 1, position : [0, 0.3, 3], scale: [0.02, 0.02, 0.02], rotation: [0, 0, 0]},
        { id: 2, animation : 2, position : [-1.3, 0.1, 0.4], scale: [0.06, 0.06, 0.06], rotation: [0, Math.PI / 4, 0]},
    ]

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
        <group ref={groupRef} >
            <Sphere />
            {/* <LiquidSphere
                ref={hiveSphere}
                position={[0, 1.3, 0]}
                name="hiveBall"
                color1="#ED8C00"
                color2="#ffb100"
                color3="#ffff00"
                color4="#00fffb"
            /> */}
            <BeeGroup bees={bees} />
            <Ground />
        </group>
    );
}


export default HiveXperience;