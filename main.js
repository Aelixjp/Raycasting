"use strict"

import Board      from "/scripts/Board.js";
import { Vector } from "/scripts/utils.js";

window.onload = ()=>{

    const canvas = document.getElementById("canvas");
    const ctx    = canvas.getContext("2d");

    const CWIDTH  = 0x500;
    const CHEIGHT = 0x2d0;

    let board;

    function setup(){
        board = new Board(ctx, CWIDTH, CHEIGHT);
        board.setup(new Vector(2, 2));
    }

    function draw(){
        board.drawBG();
        board.player.draw();
        board.player.drawCameraAngle();
        board.player.proyect();
        board.player.move();

        requestAnimationFrame(draw);
    }

    setup();
    draw();

}