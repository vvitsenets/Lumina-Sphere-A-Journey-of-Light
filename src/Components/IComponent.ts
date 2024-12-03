export interface IComponent {
    mesh: any;
    update(): void;
    changeDirection?(): void; 
    light?: THREE.PointLight;
}