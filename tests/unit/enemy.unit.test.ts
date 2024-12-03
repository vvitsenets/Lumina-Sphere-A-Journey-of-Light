import * as THREE from 'three';
import {Enemy} from '../../src/BytecodePattern/Enemy';


describe('Enemy', () => {
  let enemy: Enemy;

  beforeEach(() => {
    enemy = new Enemy(0, 0);
  });

  it('should initialize with correct position and velocity', () => {
    expect(enemy.position.x).toBe(0);
    expect(enemy.position.y).toBe(1);
    expect(enemy.position.z).toBe(0);
    expect(enemy.velocity.x).not.toBe(0);
    expect(enemy.velocity.z).not.toBe(0);
  });

  it('should update position and color on each frame', () => {
    const initialPosition = enemy.position.clone();
    enemy.update();
    expect(enemy.position).not.toEqual(initialPosition); 

    const material = enemy.mesh.material as THREE.ShaderMaterial;
    expect(material.uniforms.color.value).toBeInstanceOf(THREE.Color);
  });

  it('should change direction on calling changeDirection', () => {
    const initialVelocity = enemy.velocity.clone();
    enemy.changeDirection();
    expect(enemy.velocity).not.toEqual(initialVelocity);
  });
});
