/*global angular, $, paper*/
(function () {
    'use strict';

    /* Services */
    var services = angular.module('mainModule.services', []);

    services.factory('homepageNavigation', function () {
        var Navigation = function (canvas) {
            var self = this,
                _project = paper.project,
                _config = {},
                _internal = {},
                _images = [],
                _compoundPathGroups = [],
                _blocks = [],
                _colorPattern = ['#10112d', '#c6c7c9'];

            _internal.init = function (canvas) {
                var hexagonOuterRadius = 90,
                    hexagonInnerRadius = (Math.sqrt(3) * hexagonOuterRadius) / 2,
                    margin = 10,
                    variance = 5,
                    delta = {
                        x: hexagonInnerRadius,
                        y: hexagonOuterRadius + hexagonOuterRadius / 2 + margin
                    },
                    defaultPosition,
                    blockCoordinates = [];
                paper.setup(canvas);

                defaultPosition = new paper.Point(paper.view.center.x, hexagonOuterRadius + 30);

                blockCoordinates.push(new paper.Point(defaultPosition.x - delta.x - variance, defaultPosition.y + delta.y));
                blockCoordinates.push(new paper.Point(blockCoordinates[0].x + delta.x * 2 + variance * 2, blockCoordinates[0].y));
                blockCoordinates.push(new paper.Point(blockCoordinates[0].x - delta.x - variance, blockCoordinates[0].y + delta.y));
                blockCoordinates.push(new paper.Point(blockCoordinates[1].x - delta.x - variance, blockCoordinates[1].y + delta.y));
                blockCoordinates.push(new paper.Point(blockCoordinates[3].x + delta.x * 2 + variance * 2, blockCoordinates[3].y));
                blockCoordinates.push(new paper.Point(blockCoordinates[3].x - delta.x - variance, blockCoordinates[3].y + delta.y));
                blockCoordinates.push(new paper.Point(blockCoordinates[3].x, blockCoordinates[5].y + delta.y));
                blockCoordinates.push(new paper.Point(blockCoordinates[4].x, blockCoordinates[5].y + delta.y));

                _internal.setImages();
                _internal.addBlock(0, defaultPosition, hexagonOuterRadius);
                _internal.addBlock(1, blockCoordinates[0], hexagonOuterRadius);
                _internal.addBlock(1, blockCoordinates[1], hexagonOuterRadius);
                _internal.addBlock(1, blockCoordinates[2], hexagonOuterRadius);
                _internal.addBlock(1, blockCoordinates[3], hexagonOuterRadius);
                _internal.addBlock(1, blockCoordinates[4], hexagonOuterRadius);
                _internal.addBlock(1, blockCoordinates[5], hexagonOuterRadius);
                _internal.addBlock(1, blockCoordinates[6], hexagonOuterRadius);
                _internal.addBlock(1, blockCoordinates[7], hexagonOuterRadius);

                paper.view.onFrame = function () {
                    _images[0].rotate(1);
                    _images[1].rotate(1);
                };

            };

            _internal.setImages = function () {
                _images.push(_internal.setImage('images/raster/homepage/11.jpg'));
                _internal.attachCompoundPath(_images[0]);

                _images.push(_internal.setImage('images/raster/homepage/7.jpg'));
                _internal.attachCompoundPath(_images[1]);
            };

            _internal.setImage = function (src) {
                var raster = new paper.Raster({
                    source: src,
                    position: paper.view.center
                });

                return raster;
            };

            _internal.attachCompoundPath = function (raster) {
                var compoundPath,
                    group;

                compoundPath = new paper.CompoundPath({
                    children: []
                });

                group = new paper.Group([compoundPath, raster]);
                //group.clipMask = true;
                group.clipped = true;

                _compoundPathGroups.push(group);
            };

            _internal.cropImageByPath = function (imgID, path) {
                var group = _compoundPathGroups[imgID],
                    compoundPath = group.children[0];

                compoundPath.children.push(path);
            };

            _internal.Polygon = function (points, color) {
                var path = new paper.Path(),
                    i; // Points from left to right

                for (i = 0; i !== points.length; i++) {
                    path.add(points[i]);
                }

                path.fillColor =  color || null;
                path.closed = true;

                return path;
            };

            _internal.Hexagon = function (position, radius, color) {
                var center = position,
                    sides = 6,
                    hexagon = new paper.Path.RegularPolygon(center, sides, radius);
                hexagon.fillColor =  color || null;

                return hexagon;
            };

            _internal.addBlock = function (blockID, position, radius) {
                switch (blockID) {
                case 0:
                    (function () {
                        var hexagon,
                            polygon,
                            polygon2,
                            triangle;

                        hexagon = _internal.Hexagon(position, radius);
                        polygon = _internal.Polygon([hexagon.segments[4].point, hexagon.segments[5].point, hexagon.segments[0].point, hexagon.bounds.center]);
                        _internal.cropImageByPath(0, polygon);

                        triangle = _internal.Polygon([
                            hexagon.segments[0].point,
                            hexagon.segments[1].point,
                            hexagon.bounds.center
                        ], _colorPattern[0]);

                        triangle = _internal.Polygon([
                            hexagon.segments[2].point,
                            hexagon.segments[3].point,
                            hexagon.bounds.center
                        ], _colorPattern[1]);

                        polygon2 = _internal.Polygon([
                            hexagon.segments[1].point,
                            hexagon.segments[2].point,
                            hexagon.bounds.center,
                            hexagon.segments[3],
                            hexagon.segments[4],
                            hexagon.bounds.center]);

                        _internal.cropImageByPath(1, polygon2);
                    })();
                    break;
                case 1:
                    (function () {
                        var hexagon,
                            polygon,
                            polygon2,
                            triangle;

                        hexagon = _internal.Hexagon(position, radius);
                        polygon = _internal.Polygon([hexagon.segments[4].point, hexagon.segments[5].point, hexagon.segments[0].point, hexagon.bounds.center]);
                        _internal.cropImageByPath(0, polygon);

                        triangle = _internal.Polygon([
                            hexagon.segments[0].point,
                            hexagon.segments[1].point,
                            hexagon.bounds.center
                        ], _colorPattern[0]);

                        triangle = _internal.Polygon([
                            hexagon.segments[2].point,
                            hexagon.segments[3].point,
                            hexagon.bounds.center
                        ], _colorPattern[1]);

                        polygon2 = _internal.Polygon([
                            hexagon.segments[1].point,
                            hexagon.segments[2].point,
                            hexagon.bounds.center,
                            hexagon.segments[3],
                            hexagon.segments[4],
                            hexagon.bounds.center]);

                        _internal.cropImageByPath(1, polygon2);
                    })();
                    break;
                }
            };

            _internal.init(canvas);
        };

        return Navigation;
    });
})();
