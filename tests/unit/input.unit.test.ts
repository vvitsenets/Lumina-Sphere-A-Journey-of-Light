import {KeyboardInputHandler} from "../../src/CommandPattern/KeyboardInputHandler";


describe('KeyboardInputHandler', () => {
  let handler: KeyboardInputHandler;

  beforeEach(() => {
    handler = new KeyboardInputHandler();
  });

  it('should move forward on "w" key down', () => {
    const velocityBefore = handler.getVelocity().clone();
    handler.handleKeyDown({ key: 'w' } as KeyboardEvent);
    
    setTimeout(() => {
      expect(handler.getVelocity().x).toBeGreaterThan(velocityBefore.x); 
    }, 50);
  });  

  it('should stop on space key press', () => {
    handler.handleKeyDown({ key: ' ' } as KeyboardEvent);
    expect(handler.isStopKeyPressed()).toBe(true); 
  });  
});
