"use strict"

import Board from "/scripts/Board.js";
import Timer from "/scripts/timer/Timer.js";
import Loader from "./scripts/utils/Loader.js";
import Scene from "./scripts/Scene.js";
import Spritesheet from "./scripts/sprites/Spritesheet.js";

(() => {
    //Global constants
    const FPS     = 0x4B;
    const MAP_TRANSPARENCY = 0.6;
    const MAP_WALL_TRANSPARENCY = 0.8;

    //const CWIDTH  = 0x320;
    //const CHEIGHT = 0x320;
    const CHEIGHT = 160;
    const CWIDTH  = CHEIGHT;

    const SHOW_GRID    = false;

    const RAY_COLOR    = "green";
    const GRID_COLOR   = "grey";
    const WALL_COLOR   = `rgba(220, 20, 60, ${MAP_WALL_TRANSPARENCY})`;
    const SCREEN_COLOR = `rgba(0, 0, 0, ${MAP_TRANSPARENCY})`;

    //Game constants
    const loader = new Loader();

    //Spritesheets
    const texturaRoca  = new Spritesheet(loader, 'textura_roca', { tileSize: 256, padding: 0, maxCols: 1, maxRows: 1 });
    const wallTextures = new Spritesheet(loader, 'wall_textures', { tileSize: 0x20, padding: 8, maxRows: 8, maxCols: 8 });

    let sky;

    function loadImage(src)
    {
        const image = new Image();
        
        return new Promise((res, rej) => {
            image.onload = () => res(image);
            image.onerror = rej;

            image.src = src;
        });
    }

    window.onload = () => {
        const canvas = document.getElementById("canvas");
        const ctx    = canvas.getContext("2d");

        const timer  = new Timer(FPS);
        const board  = new Board(ctx, timer, loader, CWIDTH, CHEIGHT);
        const scene  = new Scene(ctx, board, 0, 0 , window.width, window.height);

        async function setup()
        {
            canvas.addEventListener("click", () => {
                if (!document.pointerLockElement) {
                    canvas.requestPointerLock({
                        unadjustedMovement: true,
                    });
                }
            });
            
            document.addEventListener("pointerlockchange", board.player.mouse.listenMouseMove, false);

            await loader.loadSources(
                [
                    loader.loadAsJSON("map", "json/map.json")
                ]
            );

            await texturaRoca.load("textures/textura_roca_256.jpg");
            await wallTextures.load("textures/SNES - Wolfenstein 3D - Wall Textures.png");

            sky = await loadImage("/resources/textures/skybox_f.jpg");

            board.showGrid    = SHOW_GRID;
            board.rayColor    = RAY_COLOR;
            board.gridColor   = GRID_COLOR;
            board.wallColor   = WALL_COLOR;
            board.screenColor = SCREEN_COLOR;
            
            board.setup();
            board.setupPlayer(1);
            board.setupRaycolor(RAY_COLOR);
            
            scene.setup();
            board.setupScene(scene);
            board.setupPlayerRays();

            timer.start(draw);

            ctx.imageSmoothingEnabled = false;
        }

        function draw()
        {
            board.clearBG();
            scene.clearBG();
            board.drawBG();
            //scene.drawBG();
            //scene.drawSimpleSky("#fff");
            //scene.drawSimpleFloor();
            
            //board.drawCameraAngle();
            //board.drawCurrentSector();
            scene.drawBG(sky);
            board.getNearestRaypoint();

            board.renderMap();
            board.renderPlayer();
            board.updatePlayer();

            //scene.renderTexture(wallTextures, 5, 6, 256, 256);
            //scene.renderTexture(wallTextures, 1, 1, 256, 256);
            board.drawFPS();
            board.player.drawSight(scene.width / 2, scene.height / 2, 18, 4);

            board.player.mouse.isMoving = false;
        }

        setup();
    }
})();