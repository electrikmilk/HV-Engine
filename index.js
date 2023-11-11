import {ctx, init} from './engine/init.js';
import {dialogueStyle} from './engine/dialogue.js';
import {Sprite} from './engine/sprite.js';
import {animate} from './engine/animation.js';
import {customCursor} from './engine/mouse.js';

dialogueStyle.border = () => {
    ctx.strokeStyle = 'darkgrey';
    ctx.lineWidth = 2;
};

dialogueStyle.background = () => {
    ctx.fillStyle = 'lightgrey';
};

window.onload = () => {
    init({}, game);
};

function game() {
    set('key', 25);
    console.log(get('key'));

    const player = new Sprite({
        name: 'player',
        background: 'brown',
        border: {
            color: 'brown',
            width: 5,
        },
        shadow: {},
        x: 280,
        y: 200,
        width: 100,
        height: 100,
        solid: true,
    });

    new Sprite({
        background: 'brown',
        // gradient: {
        //     colors: ['orange', 'brown'],
        // },
        border: {
            color: 'brown',
            width: 5,
        },
        shape: 'circle',
        radius: 70,
        x: 500,
        y: 300,
        solid: true,
    });

    player.click(() => {
        player.setBackground('blue');
    });

    player.clickEnd(() => {
        player.setBackground('green');
    });

    player.hover(() => {
        player.setBackground('yellow');
    });

    player.hoverEnd(() => {
        player.setBackground('red');
    });

    const textbox = new Textbox({
        x: 15,
        y: 15,
        placeholder: 'Placeholder',
    });

    // new Menu({
    //     buttons: [
    //         {
    //             text: 'Test 1',
    //             onClick: () => {
    //
    //             }
    //         },
    //         {
    //             text: 'Test 2',
    //             onClick: () => {
    //
    //             }
    //         },
    //         {
    //             text: 'Test 3',
    //             onClick: () => {
    //
    //             }
    //         }
    //     ]
    // });

    const button = new Button({
        x: 180,
        y: 15,
    }).click(() => {
        button.setBackground('darkred');
    }).clickEnd(() => {
        button.setBackground('red');
    }).hover(() => {
        button.setBackground('red');
        button.setTextColor('white');
    }).hoverEnd(() => {
        button.setBackground('white');
        button.setTextColor('black');
    });

    const text = new Text({
        content: 'Use the arrow keys or WASD to move.',
        font: 'Helvetica',
        color: 'white',
        x: 15,
        y: 15,
        position: 'right top',
    });

    Key.down(['up'], () => {
        player.move('up', 10);
    });
    Key.down(['left'], () => {
        player.move('left', 10);
    });
    Key.down(['right'], () => {
        player.move('right', 10);
    });
    Key.down(['down'], () => {
        player.move('down', 10);
    });
    Key.pressed(['ctrl', 'a'], () => {
        console.log('you pressed "ctrl" and "a"');
    });
    Key.pressed(['ctrl', 'shift', 'a'], () => {
        console.log('you pressed "ctrl", "shift" and "a"');
    });

    Dialogue.new({
        color: 'darkgrey',
        text: '(It\'s just a wall.)',
        font: 'Georgia',
    });
}