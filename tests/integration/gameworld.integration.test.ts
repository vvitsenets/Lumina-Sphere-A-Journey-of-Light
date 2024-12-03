import {Enemy} from "../../src/BytecodePattern/Enemy";
import {Sphere} from "../../src/BytecodePattern/Sphere";
import {GameWorld} from "../../src/Core/GameWorld";


describe('GameWorld', () => {
  let gameWorld: GameWorld;
  let sphere: Sphere;

  beforeEach(() => {
    gameWorld = new GameWorld();
    sphere = new Sphere();
    gameWorld.addEntity(sphere);
  });

  it('should detect collision with enemies and spawn new enemies', () => {
    const initialEnemyCount = gameWorld.enemies.length;
    const enemy = new Enemy(0, 0);
    gameWorld.addEntity(enemy);

    gameWorld.checkCollisions(sphere);

    expect(gameWorld.enemies.length).toBeGreaterThan(initialEnemyCount);
    expect(gameWorld.collisionCount).toBeGreaterThan(0);
  });
});
