import * as THREE from 'three';
import { CommandInvoker } from './CommandInvoker';
import {MoveBackwardCommand, MoveForwardCommand, MoveLeftCommand, MoveRightCommand, ReleaseStopCommand, StopCommand} from './CommandPattern';

export class KeyboardInputHandler {
    private velocity: THREE.Vector3;
    private invoker: CommandInvoker;
    private stopKeyPressed: boolean = false;

    constructor() {
        this.velocity = new THREE.Vector3();
        this.invoker = new CommandInvoker();

        this.invoker.addCommand('w', new MoveForwardCommand(this.velocity));
        this.invoker.addCommand('s', new MoveBackwardCommand(this.velocity));
        this.invoker.addCommand('a', new MoveLeftCommand(this.velocity));
        this.invoker.addCommand('d', new MoveRightCommand(this.velocity));

        window.addEventListener('keydown', this.handleKeyDown.bind(this));
        window.addEventListener('keyup', this.handleKeyUp.bind(this));
    }

    public handleKeyDown(event: KeyboardEvent) {
        if (event.key === 'w' || event.key === 's' || event.key === 'a' || event.key === 'd') {
            this.invoker.executeCommand(event.key);
        }
        if (event.key === ' ') {
            this.invoker.executeCommand(' ');
            this.stopKeyPressed = true;
        }
    }

    public handleKeyUp(event: KeyboardEvent) {
        if (event.key === 'w' || event.key === 's' || event.key === 'a' || event.key === 'd') {
            this.velocity.set(0, 0, 0);
        }
        if (event.key === ' ') {
            this.invoker.executeCommand('releaseSpace');
        }
    }

    getVelocity() {
        return this.velocity;
    }

    isStopKeyPressed() {
        return this.stopKeyPressed;
    }
}
