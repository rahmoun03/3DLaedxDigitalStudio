import { useThree, useLoader } from "@react-three/fiber";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import * as THREE from "three";
import { useEffect } from "react";

export default function CubeHDRI({ file = "/hdri/studio.hdr" }) {
	const { scene, gl } = useThree();
	const hdrTexture = useLoader(RGBELoader, file);

	useEffect(() => {
		hdrTexture.mapping = THREE.EquirectangularReflectionMapping;

		// Convert HDR to cube environment
		const pmremGenerator = new THREE.PMREMGenerator(gl);
		pmremGenerator.compileEquirectangularShader();
		const envMap = pmremGenerator.fromEquirectangular(hdrTexture).texture;

		scene.background = envMap;
		scene.environment = envMap;

		hdrTexture.dispose();
		pmremGenerator.dispose();
	}, [hdrTexture, gl, scene]);

	return null;
}
