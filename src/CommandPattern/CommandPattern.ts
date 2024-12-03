import {ICommand} from "./ICommand";

export class MoveForwardCommand implements ICommand {
    private velocity: THREE.Vector3;

    constructor(velocity: THREE.Vector3) {
        this.velocity = velocity;
    }

    execute(): void {
        this.velocity.z = -0.1;
    }
}

export class MoveBackwardCommand implements ICommand {
    private velocity: THREE.Vector3;

    constructor(velocity: THREE.Vector3) {
        this.velocity = velocity;
    }

    execute(): void {
        this.velocity.z = 0.1;
    }
}

export class MoveLeftCommand implements ICommand {
    private velocity: THREE.Vector3;

    constructor(velocity: THREE.Vector3) {
        this.velocity = velocity;
    }

    execute(): void {
        this.velocity.x = -0.1;
    }
}

export class MoveRightCommand implements ICommand {
    private velocity: THREE.Vector3;

    constructor(velocity: THREE.Vector3) {
        this.velocity = velocity;
    }

    execute(): void {
        this.velocity.x = 0.1;
    }
}

export class StopCommand implements ICommand {
    private isStopping: boolean;

    constructor(isStopping: boolean) {
        this.isStopping = isStopping;
    }

    execute(): void {
        this.isStopping = true;
    }
}

export class ReleaseStopCommand implements ICommand {
    private isStopping: boolean;

    constructor(isStopping: boolean) {
        this.isStopping = isStopping;
    }

    execute(): void {
        this.isStopping = false;
    }
}
