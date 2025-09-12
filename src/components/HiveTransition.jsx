import * as THREE from 'three';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';

import {useProgressStore} from '../zustand/useProgressStore';

import BeeGroup from './BeeAnimation';
import Cloud from './Cloud';

export default function HiveTransition() {

    const groupRef = useRef();
    const move = useRef(false);
    const clock = new THREE.Clock();
    const { progressRightRef } = useProgressStore.getState()

	useFrame(() => {
		const elapsed = clock.getElapsedTime();
		if(progressRightRef.current > 90 && !move.current) {
			move.current = true;
		}
		if (groupRef.current && move.current) {
			groupRef.current.position.x -= elapsed * 0.008;
		}
	})

	
    return (
        <group ref={groupRef} position={[0, 0, 0]}>
            <BeeGroup />
            <Cloud/>
        </group>
    );
}