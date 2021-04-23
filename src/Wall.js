import React from "react";
import { useBox } from "use-cannon";
import { TextureLoader, RepeatWrapping } from "three";
import white from "./plasticw.jpg";

export const Wall = ({ 
  orientation = 'latitudinal', 
  position = [0, 0.5, -5] 
}) => {
  const dimensions = orientation === 'latitudinal' ? [5, 5, 1] : [1, 5, 5];
  const [ref] = useBox(() => ({ type: "Static",  args: dimensions, position: position }));
  const texture = new TextureLoader().load(white);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(960, 960);

  return (
    <mesh ref={ref} receiveShadow>
      <meshStandardMaterial map={texture} attach="material" />
      <boxBufferGeometry attach="geometry" args={dimensions} />
    </mesh>
  );
};
