/*
    DiepCustom - custom tank game server that shares diep.io's WebSocket protocol
    Copyright (C) 2022 ABCxFF (github.com/ABCxFF)

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program. If not, see <https://www.gnu.org/licenses/>
*/

import GameServer from "../../Game";
import ArenaEntity from "../../Native/Arena";
import ObjectEntity from "../../Entity/Object";
import MazeWall from "../../Entity/Misc/MazeWall";

import Pentagon from "../../Entity/Shape/Pentagon";

import { Color, ArenaFlags, PhysicsFlags } from "../../Const/Enums";
import { NameGroup } from "../../Native/FieldGroups";
import AbstractShape from "../../Entity/Shape/AbstractShape";
import { SandboxShapeManager } from "../Sandbox";
import Square from "../../Entity/Shape/Square";
import Triangle from "../../Entity/Shape/Triangle";
import NecromancerSquare from "../../Entity/Tank/Projectile/NecromancerSquare";

/**
 * Only spawns crashers
 */
class CustomShapeManager extends SandboxShapeManager {
    protected spawnShape(): AbstractShape {
        const {x, y} = this.arena.findSpawnLocation();

        const penta = new Square(this.game, Math.random() < 0.25,);

        penta.positionData.values.x = Math.sign(x) * (Math.abs(x) - 200);
        penta.positionData.values.y = Math.sign(y) * (Math.abs(y) - 200);
        penta.relationsData.values.owner = penta.relationsData.values.team = this.arena;

        return penta;
    }
}

/**
 * Ball Gamemode Arena
 */
export default class BallArena extends ArenaEntity {
    /** Controller of all shapes in the arena. */
	protected shapes: CustomShapeManager = new CustomShapeManager(this);

    public constructor(game: GameServer) {
        super(game);

        this.arenaData.values.flags |= ArenaFlags.canUseCheats;
        this.updateBounds(3500, 3500);

        const ball = new ObjectEntity(game);
        ball.nameData = new NameGroup(ball);
        ball.nameData.values.name = "im pacman"
        ball.physicsData.values.sides = 1;
        ball.styleData.values.color = Color.ScoreboardBar;
        ball.physicsData.values.size = 100;
        ball.physicsData.values.absorbtionFactor = 10;
        ball.physicsData.values.flags |= PhysicsFlags.isBase | PhysicsFlags.noOwnTeamCollision;
        ball.relationsData.values.team = ball;
        const wall = new MazeWall(this.game, 0, -700, 400, 1500);
        wall.physicsData.flags |= PhysicsFlags.canEscapeArena
        const wall2 = new MazeWall(this.game, 0, 700, 400, 1500);
        wall2.physicsData.flags |= PhysicsFlags.canEscapeArena
        const wall3 = new MazeWall(this.game, 1400, 200, 3000, 350);
        wall3.physicsData.flags |= PhysicsFlags.canEscapeArena
        const wall4 = new MazeWall(this.game, -900, 700, 1500, 350);
        wall4.physicsData.flags |= PhysicsFlags.canEscapeArena
    }
}