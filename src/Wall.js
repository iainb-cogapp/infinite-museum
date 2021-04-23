import React, { useEffect, useState } from "react";
import { useLoader } from "react-three-fiber";
import { useBox } from "use-cannon";
import { ImageLoader, TextureLoader, RepeatWrapping } from "three";
import white from "./plasticw.jpg";

export const Wall = ({
  orientation = "latitudinal",
  position = [0, 0.5, -5],
  object = null,
}) => {
  const [imageHeight, setImageHeight] = useState();
  const [imageWidth, setImageWidth] = useState();
  const [imageInfoUrl, setImageInfoUrl] = useState();

  useEffect(() => {
    if (object._images._iiif_image_base_url) {
      fetch(object._images._iiif_image_base_url + "info.json")
        .then((res) => res.json())
        .then((result) => {
          const biggestDimension = Math.max(result.width, result.height);
          const scaleFactor = 3 / biggestDimension;

          setImageWidth(result.width * scaleFactor);
          setImageHeight(result.height * scaleFactor);
        });
    }

    if (object._images._iiif_presentation_url) {
      fetch(object._images._iiif_presentation_url)
        .then((res) => res.json())
        .then((result) => {
          setImageInfoUrl(result.related['@id']);
        });
    }
  }, [object]);

  const dimensions = [1, 5, 5];
  const imagePosition = position;

  let rotation = [0, 0, 0];
  switch (orientation) {
    case "east":
      rotation = [0, -Math.PI, 0];
      imagePosition[0] -= 0.01;
      break;
    case "south":
      rotation = [0, Math.PI * 1.5, 0];
      imagePosition[2] += 0.01;
      break;
    case "west":
      rotation = [0, Math.PI * 2, 0];
      imagePosition[0] += 0.01;
      break;
    default:
      rotation = [0, -Math.PI * 1.5, 0];
      imagePosition[2] -= 0.01;
  }

  const [ref] = useBox(() => ({
    type: "Static",
    args: dimensions,
    position,
    rotation,
  }));

  const imageTexture = new TextureLoader().load(
    `${object._images._iiif_image_base_url}/full/!512,/0/default.jpg`
  );

  const wallTexture = new TextureLoader().load(white);
  wallTexture.wrapS = RepeatWrapping;
  wallTexture.wrapT = RepeatWrapping;
  wallTexture.repeat.set(960, 960);

  return (
    <>
      <mesh ref={ref} receiveShadow>
        <meshStandardMaterial map={wallTexture} attach="material" />
        <boxBufferGeometry attach="geometry" args={dimensions} />
      </mesh>
      {imageWidth && imageHeight && (
        <mesh
          args={dimensions}
          position={imagePosition}
          rotation={rotation}
          onClick={(e) => {
            e.stopPropagation();

            if (imageInfoUrl) {
              window.open(imageInfoUrl, '_blank');
            }
          }}
        >
          <meshBasicMaterial attach="material" map={imageTexture} key={1} />
          <boxBufferGeometry
            attach="geometry"
            args={[1, imageHeight, imageWidth]}
          />
        </mesh>
      )}
    </>
  );
};
