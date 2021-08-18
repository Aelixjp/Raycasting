"use strict"

import Board      from "/scripts/Board.js";
import { Vector } from "/scripts/utils.js";

window.onload = ()=>{

    const canvas = document.getElementById("canvas");
    const ctx    = canvas.getContext("2d");

    const CWIDTH  = 0x320;
    const CHEIGHT = 0x258;

    let board;

    function setup(){
        board = new Board(ctx, CWIDTH, CHEIGHT);
        board.setup(new Vector(4, 4))
        .then(()=>{
            board.player.setupRays(1);
            draw();
        }).catch(e => console.error(e));
    }

    function draw(){
        board.drawBG();
        board.renderMap();
        board.player.draw();
        board.player.drawCameraAngle();
        board.player.proyect();
        board.player.move();

        requestAnimationFrame(draw);
    }

    setup();

}