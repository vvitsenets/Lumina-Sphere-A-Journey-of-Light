import * as THREE from 'three';

export class MockMesh {
  position: THREE.Vector3 = new THREE.Vector3();
  constructor() {}
}

export class MockPointLight {
  color: THREE.Color = new THREE.Color();
  intensity: number = 1;
  constructor() {}
}

export class MockVector3 {
  x: number = 0;
  y: number = 0;
  z: number = 0;

  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  add(vec: MockVector3): this {
    this.x += vec.x;
    this.y += vec.y;
    this.z += vec.z;
    return this;
  }

  set(x: number, y: number, z: number): this {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }
}
