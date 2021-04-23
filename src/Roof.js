import React from "react";
import { TextureLoader, RepeatWrapping } from "three";
import white from "./plasticw.jpg";

export const Roof = (props) => {
  const texture = new TextureLoader().load(white);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(960, 960);

  return (
    <mesh rotation={[Math.PI / 2, 0, Math.PI]} position={[0, 5, 0]}>
      <planeBufferGeometry attach="geometry" args={[1009, 1000]} />
      <meshStandardMaterial map={texture} attach="material" />
    </mesh>
  );
};
