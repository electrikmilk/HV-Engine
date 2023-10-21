import {draw} from './screen.js';

export function animate(frames, secondsPerFrame = 1, times = 0) {
    let tick = 0;
    let frame = 0;
    let iter = 0;
    draw(() => {
        if (times !== 0) {
            if (times === iter) {
                return;
            }
        }

        if (tick % (secondsPerFrame * 80) === 0) {
            if (frames.length === frame) {
                frame = 0;
                iter++;
                return;
            }

            frames[frame]();
            frame++;
        }

        tick++;
    });
}
