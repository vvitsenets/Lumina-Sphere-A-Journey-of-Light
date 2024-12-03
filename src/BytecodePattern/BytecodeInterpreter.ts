import * as THREE from 'three';
import {Enemy} from './Enemy';

export class BytecodeInterpreter {
    executeBytecode(bytecode: string, context: any) {
    
        const commands = bytecode.split(';').map(command => command.trim()).filter(command => command.length > 0);
        
        commands.forEach(command => {
            const parts = command.split(' ');
            const action = parts[0];
            switch (action) {
                case 'MOVE_SPHERE':
                    const dx = parseFloat(parts[1]);
                    const dy = parseFloat(parts[2]);
                    const dz = parseFloat(parts[3]);
                    if (context.sphere) {
                        context.sphere.setVelocity(new THREE.Vector3(dx, dy, dz));
                    }
                    break;
                case 'SPAWN_ENEMY':
                    const x = parseFloat(parts[1]);
                    const z = parseFloat(parts[2]);
                    const newEnemy = new Enemy(x, z);
                    context.enemies.push(newEnemy);
                    break;
                case 'CHANGE_DIRECTION_ENEMIES':
                    context.enemies.forEach((enemy: {changeDirection: () => any;}) => enemy.changeDirection());
                    break;
            }
        });
    }
}
