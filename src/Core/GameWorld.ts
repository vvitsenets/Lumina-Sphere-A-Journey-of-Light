
import * as THREE from 'three';
import {Enemy} from '../BytecodePattern/Enemy';
import {IComponent} from '../Components/IComponent';
import {BytecodeInterpreter} from '../BytecodePattern/BytecodeInterpreter';
import {SpatialGrid} from '../SpatialPattern/SpatialGrid';
import {Sphere} from '../BytecodePattern/Sphere';
import axios from 'axios';


export class GameWorld {
    public enemies: Enemy[];
    public collisionCount: number;

    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private entities: IComponent[];
    private record: number;
    private bytecodeInterpreter: BytecodeInterpreter;
    private spatialGrid: SpatialGrid;


    constructor() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x536493);
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.domElement.style.position = 'absolute';
        this.renderer.domElement.style.top = '0';
        this.renderer.domElement.style.left = '0';
        document.body.appendChild(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 20, 0); // Y=10 Z=15
        this.camera.lookAt(0, 0, 0);
        this.camera.rotation.x = -Math.PI / 2;

        const ambientLight = new THREE.AmbientLight(0x404040);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 7.5).normalize();
        this.scene.add(directionalLight);
       
        const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x536493 });
        const floorGeometry = new THREE.PlaneGeometry(100, 100);
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        this.scene.add(floor);

        this.entities = [];
        this.enemies = [];
        this.collisionCount = 0;
        this.record = 0;
        this.bytecodeInterpreter = new BytecodeInterpreter();
        this.spatialGrid = new SpatialGrid(10);

        this.scene.fog = new THREE.Fog(0x182828, 20, 50);

        this.loadRecordFromServer();

        this.spawnInitialEnemies();
    }

    async loadRecordFromServer() {
        try {
            const response = await axios.get('http://localhost:3000/get-record');
            if (response.data) {
                this.record = response.data.score;
                console.log(`Current record: ${this.record}`);
            }
        } catch (error) {
            console.error('Error loading record:', error);
        }
    }

    async saveScoreToServer(score: number, playerName: string) {
        try {
            console.log('Sending data to server:', { score, playerName });
            const response = await axios.post('http://localhost:3000/save-score', { score, playerName });
            console.log('Score saved:', response.data);
        } catch (error) {
            console.error('Error saving score:', error);
        }
    }
    

    executeGlobalBytecode(bytecode: string) {
        this.bytecodeInterpreter.executeBytecode(bytecode, {
            sphere: this.entities.find(e => e instanceof Sphere) as Sphere,
            enemies: this.enemies,
        });        
    }

    addEntity(entity: IComponent) {
        this.entities.push(entity);
        if (entity instanceof Sphere) {
            this.scene.add(entity.mesh);
            this.spatialGrid.addEntity(entity);
        } else if (entity instanceof Enemy) {
            this.enemies.push(entity);
            this.scene.add(entity.mesh);
            this.scene.add(entity.light);
            this.spatialGrid.addEntity(entity);
        }
    }

    removeEntity(entity: IComponent) {
        this.spatialGrid.removeEntity(entity);
        if (entity instanceof Enemy) {
            const index = this.enemies.indexOf(entity);
            if (index > -1) {
                this.enemies.splice(index, 1);
            }
        }
        this.scene.remove(entity.mesh);
        if (entity instanceof Enemy) {
            this.scene.remove((entity as Enemy).light);
        }
    }

    update() {
        this.entities.forEach(entity => entity.update());
        this.enemies.forEach(enemy => enemy.update());
        this.renderer.render(this.scene, this.camera);
    }

    followPlayer(player: Sphere) {
        this.camera.position.set(player.mesh.position.x, 20, player.mesh.position.z);
        this.camera.lookAt(player.mesh.position);
    }

    checkCollisions(sphere: Sphere) {
        this.enemies.forEach((enemy, index) => {
            const dist = sphere.mesh.position.distanceTo(enemy.mesh.position);
            if (dist < 3) {
                enemy.changeDirection();
                this.scene.remove(enemy.mesh); 
                this.scene.remove(enemy.light); 
                this.enemies.splice(index, 1);
                this.collisionCount++;
        
                if (this.collisionCount > this.record) {
                    this.record = this.collisionCount;
                    console.log(this.record);
                    this.saveScoreToServer(this.record, "player");
                }
    
                sphere.changeColorOnCollision();
    
                const newEnemy = new Enemy(
                    Math.random() * 40 - 20,
                    Math.random() * 40 - 20
                );
                this.addEntity(newEnemy);
            }
        });
    }

    spawnInitialEnemies() {
        for (let i = 0; i < 5; i++) {
            const enemy = new Enemy(Math.random() * 40 - 20, Math.random() * 40 - 20);
            this.addEntity(enemy);
        }
    }

    // displayRecord() {
    //     const recordText = `Record: ${this.record}`;
    //     let recordElement = document.getElementById('record');
    //     if (!recordElement) {
    //         recordElement = document.createElement('div');
    //         recordElement.id = 'record';
    //         recordElement.style.position = 'absolute';
    //         recordElement.style.top = '10px';
    //         recordElement.style.left = '10px';
    //         recordElement.style.fontSize = '20px';
    //         recordElement.style.color = 'white';
    //         document.body.appendChild(recordElement);
    //     }
    //     recordElement.innerText = recordText;
    // }
}