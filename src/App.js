import React, {useEffect, useState} from 'react';
import { Canvas } from 'react-three-fiber';
import { Sky } from 'drei';
import { Vector3 } from 'three';
import { Physics } from 'use-cannon';
import { Ground } from './Ground';
import { Roof } from './Roof';
import { Wall } from './Wall';
import { Camera } from './Camera';
import { Player } from './Player';
// import { Cube, useCubeStore } from './Cube';
import shuffleArray from './utils/shuffle-array';

function App() {
  // const cubes = useCubeStore(state => state.cubes)

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);

  const query = 'queen';

  // Note: the empty deps array [] means
  // this useEffect will run once
  // similar to componentDidMount()
  useEffect(() => {
    fetch(`https://api.vam.ac.uk/v2/objects/search?q="${query}"&images_exist=1`)
      .then(res => res.json())
      .then(
        (result) => {
          const roomObjects = result.records
            ? shuffleArray(result.records).slice(0, 4)
            : [];

          setIsLoaded(true);
          setItems(roomObjects);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [])

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <Canvas shadowMap sRGB gl={{ alpha: false }}>
      <Camera />
      <Sky sunPosition={new Vector3(100, 10, 100)}/>
      <ambientLight intensity={0.3}/>
      <pointLight
        castShadow
        intensity={0.8}
        position={[100, 100, 100]}
      />
      <Physics gravity={[0, -30, 0]}>
        <Roof />
        <Ground />
        <Wall position={[0, 2.5, -4]} orientation="south" object={items[0]} />
        <Wall position={[3, 2.5, -1]} orientation="east" object={items[1]} />
        <Wall position={[-3, 2.5, -1]} orientation="west" object={items[2]} />
        <Wall position={[0, 2.5, 2]} orientation="north" object={items[3]} />
        <Player />
        {/* <Cube position={[0, 0.5, -10]} />
        {
          cubes.map(cube => cube)
        } */}
      </Physics>
    </Canvas>
  )
}

export default App;
