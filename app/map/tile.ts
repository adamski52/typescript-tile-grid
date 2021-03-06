import {CONFIG} from "../config/config";
import {ITileStyle} from "../interfaces/tile-style";
import {ITileNeighbors} from "../interfaces/tile-neighbors";

export class Tile {
    private _shape:createjs.Shape;
    private _container:createjs.Container;
    private _grid:Array<Array<Tile>>;

    // i dont have an answer to this quite yet.  pixels being rectangular or something?
    // every 50px of tile size creates 7 pixels of y-offset.
    private _offset:number;

    private _style:ITileStyle;

    public row:number;
    public col:number;

    constructor(private _x:number, private _y:number, private CONFIG:CONFIG) {
        this.row = this._y;
        this.col = this._x;
        this._offset = this.CONFIG.STYLES.TILES.PADDING_OFFSET;
        this._style = {
            fill: this.CONFIG.STYLES.TILES.FILL.COLOR,
            strokeColor: this.CONFIG.STYLES.TILES.STROKE.COLOR,
            strokeSize: this.CONFIG.STYLES.TILES.STROKE.SIZE
        };

        this._container = new createjs.Container();
        this._shape = new createjs.Shape();

        this._container.on("mouseover", (e) => {
            this.onMouseOver(e);
        });

        this._container.on("mouseout", (e) => {
            this.onMouseOut(e);
        })
    }

    private onMouseOut(e:Object):void {
        this._style.fill = this._style.fill === this.CONFIG.STYLES.TILES.FILL.ACTIVE ? this.CONFIG.STYLES.TILES.FILL.HINT : this.CONFIG.STYLES.TILES.FILL.COLOR;
    }

    private onMouseOver(e:Object):void {
        if(this._style.fill === this.CONFIG.STYLES.TILES.FILL.HINT) {
            this.activate();
        }
    }

    public setGrid(grid:Array<Array<Tile>>):void {
        this._grid = grid;
    }

    public render():void {
        this._container.removeAllChildren();

        this._shape.graphics.clear();
        this._shape.graphics.setStrokeStyle(this._style.strokeSize);
        this._shape.graphics.beginStroke(this._style.strokeColor);
        this._shape.graphics.beginFill(this._style.fill);
        this._shape.graphics.drawPolyStar(0, 0, this.CONFIG.STYLES.TILES.SIZE, 6, 0, 0);

        this._container.addChild(this._shape);

        this.setPosition(this._x, this._y);
    }

    public activate():void {
        this._style.fill = this.CONFIG.STYLES.TILES.FILL.ACTIVE;
    }

    public isActive():boolean {
        return this._style.fill === this.CONFIG.STYLES.TILES.FILL.ACTIVE;
    }

    public hint():void {
        this._style.fill = this.CONFIG.STYLES.TILES.FILL.HINT;
    }

    public isHint():boolean {
        return this._style.fill === this.CONFIG.STYLES.TILES.FILL.HINT;
    }

    public reset():void {
        this._style.fill = this.CONFIG.STYLES.TILES.FILL.COLOR;
    }

    public setPosition(x:number, y:number):void {
        this._x = x;
        this._y = y;

        if(this._y % 2 === 0) {
            this._container.x = (this._x * this.CONFIG.STYLES.TILES.SIZE * 3) + this.CONFIG.STYLES.TILES.SIZE;
        }
        else {
            this._container.x = (this._x * this.CONFIG.STYLES.TILES.SIZE * 3) + (this.CONFIG.STYLES.TILES.SIZE * 1.5) + this.CONFIG.STYLES.TILES.SIZE;
        }

        this._container.x += this.CONFIG.STYLES.TILES.LEFT_OFFSET;
        this._container.y = (this._y * (this.CONFIG.STYLES.TILES.SIZE - this._offset)) + this.CONFIG.STYLES.TILES.SIZE - this._offset + this.CONFIG.STYLES.TILES.STROKE.SIZE + this.CONFIG.STYLES.TILES.TOP_OFFSET;
    }

    public getElement():createjs.Container {
        return this._container;
    }

    private getNorthNeighbor():Tile | undefined {
        var row:number = this.row - 2,
            col:number = this.col;


        if(row < 0) {
            return;
        }

        return this._grid[row][col];
    }

    private getSouthNeighbor():Tile | undefined {
        var row:number = this.row + 2,
            col:number = this.col;

        if(row >= this._grid.length) {
            return;
        }

        return this._grid[row][col];
    }

    private getNorthwestNeighbor():Tile | undefined {
        var row:number = this.row - 1,
            col:number = this.row % 2 === 0 ? this.col - 1 : this.col;

        if(col < 0 || row < 0) {
            return;
        }

        return this._grid[row][col];
    }

    private getNortheastNeighbor():Tile | undefined {
        var row:number = this.row - 1,
            col:number = this.row % 2 === 0 ? this.col : this.col + 1;

        if(row < 0 || col >= this._grid[row].length) {
            return;
        }

        return this._grid[row][col];
    }

    private getSouthwestNeighbor():Tile | undefined {
        var row:number = this.row + 1,
            col:number = this.row % 2 === 0 ? this.col - 1: this.col;

        if(row >= this._grid.length || col < 0) {
            return;
        }

        return this._grid[row][col];
    }

    private getSoutheastNeighbor():Tile | undefined {
        var row:number = this.row + 1,
            col:number = this.row % 2 === 0 ? this.col : this.col + 1;

        if(row >= this._grid.length || col >= this._grid[row].length) {
            return;
        }

        return this._grid[row][col];
    }

    public getNeighbors():ITileNeighbors {

        return {
            n: this.getNorthNeighbor(),
            ne: this.getNortheastNeighbor(),
            se: this.getSoutheastNeighbor(),
            s: this.getSouthNeighbor(),
            sw: this.getSouthwestNeighbor(),
            nw: this.getNorthwestNeighbor()
        };
    }
}