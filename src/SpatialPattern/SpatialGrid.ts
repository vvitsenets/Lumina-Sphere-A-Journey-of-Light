import {IComponent} from "../Components/IComponent";


export class SpatialGrid {
    private gridSize: number;
    private grid: Map<string, IComponent[]>;

    constructor(gridSize: number) {
        this.gridSize = gridSize;
        this.grid = new Map();
    }

    private getGridKey(x: number, z: number): string {
        const gridX = Math.floor(x / this.gridSize);
        const gridZ = Math.floor(z / this.gridSize);
        return `${gridX},${gridZ}`;
    }

    addEntity(entity: IComponent) {
        const key = this.getGridKey(entity.mesh.position.x, entity.mesh.position.z);
        if (!this.grid.has(key)) {
            this.grid.set(key, []);
        }
        this.grid.get(key)?.push(entity);
    }

    removeEntity(entity: IComponent) {
        const key = this.getGridKey(entity.mesh.position.x, entity.mesh.position.z);
        if (this.grid.has(key)) {
            const entitiesInCell = this.grid.get(key)!;
            const index = entitiesInCell.indexOf(entity);
            if (index > -1) {
                entitiesInCell.splice(index, 1);
            }
            if (entitiesInCell.length === 0) {
                this.grid.delete(key);
            }
        }
    }

    getNearbyEntities(x: number, z: number): IComponent[] {
        const key = this.getGridKey(x, z);
        const nearbyEntities: IComponent[] = [];
        const directions = [
            [0, 0],
            [-1, 0], [1, 0],
            [0, -1], [0, 1], 
            [-1, -1], [1, 1],
            [-1, 1], [1, -1]
        ];

        directions.forEach(([dx, dz]) => {
            const neighborKey = `${parseInt(key.split(',')[0]) + dx},${parseInt(key.split(',')[1]) + dz}`;
            if (this.grid.has(neighborKey)) {
                nearbyEntities.push(...this.grid.get(neighborKey)!);
            }
        });

        return nearbyEntities;
    }
}
