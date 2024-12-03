import {Sphere} from "./BytecodePattern/Sphere";
import {KeyboardInputHandler} from "./CommandPattern/KeyboardInputHandler";
import {GameWorld} from "./Core/GameWorld";


const gameWorld = new GameWorld();
const sphere = new Sphere();
gameWorld.addEntity(sphere);

const inputHandler = new KeyboardInputHandler();

setTimeout(() => {
    console.log("Executing bytecode...");
    const bytecode = `
        CHANGE_DIRECTION_ENEMIES;
    `;
    gameWorld.executeGlobalBytecode(bytecode);
}, 5000);

//Sequencing Pattern --> Game Loop //https://gameprogrammingpatterns.com/game-loop.html
function gameLoop() {
    requestAnimationFrame(gameLoop); 
    
    // 1. Обробка введення
    const velocity = inputHandler.getVelocity(); 

    // 2. Оновлення стану гри
    sphere.setVelocity(velocity);

    if (inputHandler.isStopKeyPressed()) {
        sphere.stop(); 
    } else {
        sphere.startMoving(); 
    }

    // 3. Оновлення ігрового світу
    gameWorld.update();

    // 4. Оновлення фізики та логіки світу
    gameWorld.followPlayer(sphere);

    // 5. Перевірка колізій
    gameWorld.checkCollisions(sphere); 
}

gameLoop(); 
