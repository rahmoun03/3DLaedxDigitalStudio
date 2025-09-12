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

	const swarmSize = 80 // number of bees
	const bees = Array.from({ length: swarmSize }, (_, i) => {
		return {
			id: i.toString().padStart(2, "0"),
			animation: 1,
			position: [
				3.0 + Math.random() * 3,    // random X between 3 and 4
				0.5 + Math.random() * 2.5,    // random Y between 0.5 and 3
				2 + Math.random() * 3       // random Z between 2 and 4.5
			],
			scale: [0.02, 0.02, 0.02],
			rotation: direction.left,
		}
	})


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

	// const { progressRightRef } = useProgressStore.getState()
	// const move = useRef(false);
	// const clock = new THREE.Clock();
	const group = useRef();
	const { actions } = useAnimations(animations, group);

	useEffect(() => {
		if (actions && animations.length > 0) {
			actions[animations[animation].name]?.play();
		}
	}, [actions, animations]);

	// useFrame(() => {
	// 	const elapsed = clock.getElapsedTime();
	// 	if(progressRightRef.current > 50 && !move.current) {
	// 		move.current = true;
	// 		// console.log('move : ', move.current)
	// 	}
	// 	if (group.current && move.current) {
	// 		group.current.position.x -= elapsed * 0.01;
	// 	}
	// })
	  

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