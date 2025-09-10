import { CubeCamera, MeshRefractionMaterial } from '@react-three/drei';



export default function GlassOuter({ useCubeCam = true, hdr = null, active = false }) {
    return useCubeCam ? (
        <CubeCamera resolution={256} frames={Infinity}>
            {(texture) => (
            <mesh position={active ? [0.0, 1.3, 0.0] : [0, 50, 0]} visible={active}>
                <sphereGeometry args={[1.05, 128, 128]} />
                <MeshRefractionMaterial
                envMap={texture}
                ior={1.52}
                bounces={2}
                fresnel={0.6}
                aberrationStrength={0.02}
                color="white"
                fastChroma={true}
                />
            </mesh>
            )}
        </CubeCamera>
    ) : (
        <mesh position={active ? [0.0, 1.3, 0.0] : [0, 50, 0]} visible={active}>
            <sphereGeometry args={[1.05, 128, 128]} />
            <MeshRefractionMaterial
                envMap={hdr}
                ior={1.52}
                bounces={2}
                fresnel={0.6}
                aberrationStrength={0.02}
                color="white"
                fastChroma={true}
            />
        </mesh>
    )
}