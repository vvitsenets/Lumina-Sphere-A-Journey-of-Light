
// import {Sphere} from "../../src/BytecodePattern/Sphere";
// import {KeyboardInputHandler} from "../../src/CommandPattern/KeyboardInputHandler";


// describe('KeyboardInputHandler - Інтеграційний тест', () => {
//   let handler: KeyboardInputHandler;
//   let player: Sphere;

//   beforeEach(() => {
//     player = new Sphere();
//     handler = new KeyboardInputHandler(player); 
//   });

//   it('should move player forward when "w" key is pressed', () => {
//     const initialVelocity = player.getVelocity().clone();

//     handler.handleKeyDown({ key: 'w' } as KeyboardEvent);

//     expect(player.getVelocity().x).toBeGreaterThan(initialVelocity.x);
//   });

//   it('should stop player on space key press', () => {
//     handler.handleKeyDown({ key: ' ' } as KeyboardEvent);

//     expect(player.isStopped()).toBe(true);
//   });
// });
