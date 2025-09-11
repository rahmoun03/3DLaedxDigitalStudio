import React, { useRef, useEffect, Suspense, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Clone , useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';


import { useProgressStore } from "../zustand/useProgressStore";

export default function BeeGroup() {
	const { scene, animations } = useGLTF("/3DModels/bee/source/Bee.glb");

	const direction = {
		left : [0, 3 * Math.PI / 2, 0],
		right: [0, Math.PI / 2, 0]
	}

	// const bees = [
	// 	{ id: '00', animation : 1, position : [0, 2.5, 3.0], scale: [0.02, 0.02, 0.02], rotation: direction.left},
	// 	{ id: '01', animation : 1, position : [0, 2.3, 4.0], scale: [0.02, 0.02, 0.02], rotation: direction.left},
	// 	{ id: '02', animation : 1, position : [0, 2.2, 3.3], scale: [0.02, 0.02, 0.02], rotation: direction.left},
	// 	{ id: '03', animation : 1, position : [0, 2.0, 3.1], scale: [0.02, 0.02, 0.02], rotation: direction.left},
	// 	{ id: '04', animation : 1, position : [0, 1.8, 4.2], scale: [0.02, 0.02, 0.02], rotation: direction.left},
	// 	{ id: '05', animation : 1, position : [0, 1.5, 2.6], scale: [0.02, 0.02, 0.02], rotation: direction.left},
	// 	{ id: '06', animation : 1, position : [0, 1.3, 2.3], scale: [0.02, 0.02, 0.02], rotation: direction.left},
	// 	{ id: '07', animation : 1, position : [0, 1.0, 4.2], scale: [0.02, 0.02, 0.02], rotation: direction.left},
	// 	{ id: '08', animation : 1, position : [0, 0.8, 3.1], scale: [0.02, 0.02, 0.02], rotation: direction.left},
	// 	{ id: '09', animation : 1, position : [0, 0.6, 2.4], scale: [0.02, 0.02, 0.02], rotation: direction.left},
	// 	{ id: '10', animation : 1, position : [0, 0.4, 4.2], scale: [0.02, 0.02, 0.02], rotation: direction.left},
	// 	{ id: '11', animation : 1, position : [0, 0.3, 3.2], scale: [0.02, 0.02, 0.02], rotation: direction.left},
	// ]

	const bees = [
		{ id: '00', animation: 1, position: [-0.5, 2.4, 2.2], scale: [0.02, 0.02, 0.02], rotation: direction.left },
		{ id: '01', animation: 1, position: [0.3, 2.0, 3.0],  scale: [0.02, 0.02, 0.02], rotation: direction.left },
		{ id: '02', animation: 1, position: [0.0, 1.8, 1.8],  scale: [0.02, 0.02, 0.02], rotation: direction.left },
		{ id: '03', animation: 1, position: [-0.7, 1.5, 2.6], scale: [0.02, 0.02, 0.02], rotation: direction.left },
		{ id: '04', animation: 1, position: [0.6, 1.2, 3.4],  scale: [0.02, 0.02, 0.02], rotation: direction.left },
		{ id: '05', animation: 1, position: [-0.3, 1.0, 1.5], scale: [0.02, 0.02, 0.02], rotation: direction.left },
		{ id: '06', animation: 1, position: [0.5, 0.9, 2.2],  scale: [0.02, 0.02, 0.02], rotation: direction.left },
		{ id: '07', animation: 1, position: [-0.2, 0.7, 3.1], scale: [0.02, 0.02, 0.02], rotation: direction.left },
		{ id: '08', animation: 1, position: [0.4, 0.6, 2.7],  scale: [0.02, 0.02, 0.02], rotation: direction.left },
		{ id: '09', animation: 1, position: [-0.5, 0.5, 1.9], scale: [0.02, 0.02, 0.02], rotation: direction.left },
		{ id: '10', animation: 1, position: [0.2, 0.3, 3.5],  scale: [0.02, 0.02, 0.02], rotation: direction.left },
		{ id: '11', animation: 1, position: [0.0, 0.2, 2.1],  scale: [0.02, 0.02, 0.02], rotation: direction.left },
	  ];
	  


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

	const { progressRightRef } = useProgressStore.getState()
	const move = useRef(false);
	const clock = new THREE.Clock();
	const group = useRef();
	const { actions } = useAnimations(animations, group);

	// const intersectionPoint = new THREE.Vector3(-4, props.position.y, props.position.z);	


	useEffect(() => {
		if (actions && animations.length > 0) {
			actions[animations[animation].name]?.play();
		}
	}, [actions, animations]);

	// useFrame(() => {
	// 	const be = group.current;
	// 	const elapsed = clock.getElapsedTime();
	// 	if (be) {
	// 		// be.position.x = Math.sin(elapsed) * 3;
	// 		// be.position.z += Math.cos(elapsed) * 0.1;
	// 		// be.rotation.y += 0.01;
	// 		// if(progressRight > 50) {
	// 		// be.position.lerp([(props.position.x - progressRight / 10.0), props.position.y, props.position.z], 0.05);
	// 		// }
	// 	}
	// });



	useEffect(() => {
		if(progressRightRef.current > 50 && !move.current) {
			move.current = true;

			console.log('move : ', move.current)
		}
	}, [progressRightRef.current])

	useFrame(() => {
		const elapsed = clock.getElapsedTime();
		if (group.current && move.current) {
		//   group.current.position.z += 0.01 // bees fly closer each frame
		  group.current.position.x -= elapsed * 0.002 // add a little wiggle
		}
	})
	  

	// useFrame(() => {
	//     if (group.current) {
	//         group.current.position.lerp(intersectionPoint, 0.05);
	//     }
	// });



	return (
		<>
			<Clone ref={group} object={scene} {...props} />
		</>
	);
}