
import * as THREE from 'three';
import {BytecodeInterpreter} from './BytecodeInterpreter';
import {IComponent} from '../Components/IComponent';

export class Sphere implements IComponent {
    mesh: THREE.Mesh;
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    maxSpeed: number;
    isStopped: boolean;
    material: THREE.ShaderMaterial;
    light: THREE.PointLight;
    collisionCount: number;
    bytecodeInterpreter: BytecodeInterpreter;

    constructor() {
        this.position = new THREE.Vector3();
        this.velocity = new THREE.Vector3();
        this.maxSpeed = 0.2;
        this.isStopped = false;
        this.collisionCount = 0;
        this.bytecodeInterpreter = new BytecodeInterpreter();

        this.material = new THREE.ShaderMaterial({
            uniforms: {
                color: { value: new THREE.Color(1, 1, 1) },
                opacity: { value: 0.3 },
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                varying vec2 vUv;
                uniform vec3 color;
                uniform float opacity;
                
                void main() {
                    gl_FragColor = vec4(color, opacity);
                }
            `,
            transparent: true,
            depthWrite: false,
        });

        const geometry = new THREE.SphereGeometry(1, 32, 32); 
        this.mesh = new THREE.Mesh(geometry, this.material);
        this.mesh.position.set(0, 1, 0);

        this.light = new THREE.PointLight(0xff3300, 1, 10);
        this.light.position.set(0, 1, 0);
        this.mesh.add(this.light);
    }

    update() {
        if (this.isStopped) {
            this.velocity.set(0, 0, 0);
        }

        this.position.add(this.velocity);
        this.mesh.position.copy(this.position);

        if (this.velocity.length() > this.maxSpeed) {
            this.velocity.normalize().multiplyScalar(this.maxSpeed);
        }

        this.velocity.multiplyScalar(0.95);

        this.position.x = Math.max(-20, Math.min(20, this.position.x));
        this.position.z = Math.max(-20, Math.min(20, this.position.z));
    }

    executeBytecode(bytecode: string) {
        this.bytecodeInterpreter.executeBytecode(bytecode, { sphere: this });
    }

    setVelocity(velocity: THREE.Vector3) {
        this.velocity.copy(velocity);
    }

    brake() {
        this.velocity.multiplyScalar(0.5); 
    }

    stop() {
        this.isStopped = true;
    }

    startMoving() {
        this.isStopped = false;
    }

    changeColorOnCollision() {
        const increment = 0.1; 

        const currentColor = this.material.uniforms.color.value;

        currentColor.r = Math.min(1, currentColor.r + increment);
        currentColor.g = Math.max(0, currentColor.g - increment * 0.8);
        currentColor.b = Math.max(0, currentColor.b - increment * 0.5); 

        this.light.color.set(currentColor);
        this.light.intensity = Math.min(5, this.light.intensity + 0.2);
        this.material.uniforms.opacity.value = Math.max(0.2, this.material.uniforms.opacity.value);
    }
}