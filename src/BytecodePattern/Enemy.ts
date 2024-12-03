
import * as THREE from 'three';
import { BytecodeInterpreter } from './BytecodeInterpreter';
import {IComponent} from '../Components/IComponent';

export class Enemy implements IComponent {
    mesh: THREE.Mesh;
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    light: THREE.PointLight;
    time: number;
    bytecodeInterpreter: BytecodeInterpreter;
    public isCollided: boolean;

    constructor(x: number, z: number) {
        this.position = new THREE.Vector3(x, 1, z);
        this.velocity = new THREE.Vector3((Math.random() - 0.5) * 0.05, 0, (Math.random() - 0.5) * 0.05);
        this.time = 0;
        this.bytecodeInterpreter = new BytecodeInterpreter();
        this.isCollided = false;

        const geometry = new THREE.SphereGeometry(0.5, 32, 32);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                color: { value: new THREE.Color(1, 1, 1) }, 
                opacity: { value: 0.5 }, 
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
                    float alpha = smoothstep(0.4, 0.6, length(vUv - 0.5)); // Плавне згладжування країв
                    gl_FragColor = vec4(color, opacity * alpha);
                }
            `,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending, 
        });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(this.position.x, this.position.y, this.position.z);

    
        this.light = new THREE.PointLight(0xFFFFFF, 0.8, 10);
        this.light.position.set(this.position.x, this.position.y, this.position.z);
    }

    update() {
        this.position.add(this.velocity);
        this.position.y = 1 + Math.sin(Date.now() * 0.002) * 0.2;
        this.mesh.position.copy(this.position);
        this.light.position.copy(this.position);

        if (this.position.z < -20 || this.position.z > 20) {
            this.velocity.z = -this.velocity.z;
        }
        if (this.position.x < -20 || this.position.x > 20) {
            this.velocity.x = -this.velocity.x;
        }

        this.time += 0.01; 

        const pulse = Math.sin(this.time) * 0.5 + 0.5; 
        const red = pulse; 
        const green = (1 - pulse) * 0.8; 
        const blue = (1 - pulse) * 0.5; 

        const color = new THREE.Color(red, green, blue);

        const material = this.mesh.material as THREE.ShaderMaterial;

        material.uniforms.color.value = color;
        this.light.color.set(color);

        this.light.intensity = Math.max(0.3, Math.sin(this.time) * 2);
    }

    executeBytecode(bytecode: string) {
        this.bytecodeInterpreter.executeBytecode(bytecode, { enemies: [this] });
    }

    changeDirection() {
        this.velocity.x = (Math.random() - 2) * 0.05;
        this.velocity.z = (Math.random() - 2) * 0.05;
    }
}
