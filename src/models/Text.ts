﻿namespace MakerJs.models {

    export class Text implements IModel {

        public models: IModelMap = {};

        constructor(font: opentype.Font, text: string, fontSize: number, combine = false, centerCharacterOrigin = false, bezierAccuracy?: number, opentypeOptions?: opentype.RenderOptions) {

            var charIndex = 0;
            var prevDeleted: IModel;
            var prevChar: IModel;

            var cb = (glyph: opentype.Glyph, x: number, y: number, _fontSize: number, options: opentype.RenderOptions) => {
                var charModel: IModel = {};
                var firstPoint: IPoint;
                var currPoint: IPoint;
                var pathCount = 0;

                function addPath(p: IPath) {
                    if (!charModel.paths) {
                        charModel.paths = {};
                    }
                    charModel.paths['p_' + ++pathCount] = p;
                }

                function addModel(m: IModel) {
                    if (!charModel.models) {
                        charModel.models = {};
                    }
                    charModel.models['p_' + ++pathCount] = m;
                }

                var p = glyph.getPath(0, 0, _fontSize);
                p.commands.map((command, i) => {

                    var points: IPoint[] = [[command.x, command.y], [command.x1, command.y1], [command.x2, command.y2]].map(
                        function (p) {
                            if (p[0] !== void 0) {
                                return point.mirror(p, false, true);
                            }
                        }
                    );

                    switch (command.type) {

                        case 'M':
                            firstPoint = points[0];
                            break;

                        case 'Z':
                            points[0] = firstPoint;
                        //fall through to line

                        case 'L':
                            if (!measure.isPointEqual(currPoint, points[0])) {
                                addPath(new paths.Line(currPoint, points[0]));
                            }
                            break;

                        case 'C':
                            addModel(new models.BezierCurve(currPoint, points[1], points[2], points[0], bezierAccuracy));
                            break;

                        case 'Q':
                            addModel(new models.BezierCurve(currPoint, points[1], points[0], bezierAccuracy));
                            break;

                    }

                    currPoint = points[0];

                });

                charModel.origin = [x, 0];

                if (centerCharacterOrigin && (charModel.paths || charModel.models)) {
                    var m = measure.modelExtents(charModel);
                    if (m) {
                        var w = m.high[0] - m.low[0];
                        model.originate(charModel, [m.low[0] + w / 2, 0]);
                    }
                }

                if (combine && charIndex > 0) {
                    var combineOptions: ICombineOptions = {};

                    var prev: IModel;

                    if (prevDeleted) {

                        //form a temporary complete geometry of the previous character using the previously deleted segments
                        prev = {
                            models: {
                                deleted: prevDeleted,
                                char: prevChar
                            }
                        }
                    } else {
                        prev = prevChar;
                    }

                    model.combine(prev, charModel, false, true, false, true, combineOptions);

                    //save the deleted segments from this character for the next iteration
                    prevDeleted = combineOptions.out_deleted[1];
                }

                this.models[charIndex] = charModel;
                charIndex++;

                prevChar = charModel;
            };

            font.forEachGlyph(text, 0, 0, fontSize, opentypeOptions, cb);

        }

    }

    (<IKit>Text).metaParameters = [
        { title: "font", type: "font", value: '*' },
        { title: "text", type: "text", value: 'Hello' },
        { title: "font size", type: "range", min: 10, max: 200, value: 72 },
        { title: "combine", type: "bool", value: false },
        { title: "center character origin", type: "bool", value: false }
    ];

}
