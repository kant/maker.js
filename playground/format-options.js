var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var MakerJsPlayground;
(function (MakerJsPlayground) {
    var FormatOptions;
    (function (FormatOptions) {
        var BaseOptions = (function () {
            function BaseOptions(format, formatTitle, div, model) {
                this.format = format;
                this.formatTitle = formatTitle;
                this.div = div;
                this.model = model;
            }
            BaseOptions.prototype.$ = function (selector) {
                return this.div.querySelector(selector);
            };
            BaseOptions.prototype.$number = function (selector) {
                var select = this.$(selector);
                if (makerjs.isNumber(select.valueAsNumber)) {
                    return select.valueAsNumber;
                }
                return parseInt(select.value);
            };
            BaseOptions.prototype.$selectValue = function (selector) {
                var select = this.$(selector);
                return select.value;
            };
            BaseOptions.prototype.addAccuracy = function (selector, options) {
                var accuracy = +this.$selectValue(selector);
                if (accuracy >= 0) {
                    options.accuracy = accuracy;
                }
            };
            BaseOptions.prototype.getOptionObject = function () {
                throw 'not implemented';
            };
            BaseOptions.prototype.validate = function () {
                return true;
            };
            return BaseOptions;
        }());
        var DxfOptions = (function (_super) {
            __extends(DxfOptions, _super);
            function DxfOptions(format, formatTitle, div, model) {
                return _super.call(this, format, formatTitle, div, model) || this;
                // TODO:
                // inspect model to see if it contains units
                // show unit picker if it does not
            }
            DxfOptions.prototype.getOptionObject = function () {
                var options = {};
                this.addAccuracy('#dxf-accuracy', options);
                return options;
            };
            return DxfOptions;
        }(BaseOptions));
        var SvgOptions = (function (_super) {
            __extends(SvgOptions, _super);
            function SvgOptions() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            SvgOptions.prototype.getOptionObject = function () {
                var options = {};
                this.addAccuracy('#svg-accuracy', options);
                return options;
            };
            return SvgOptions;
        }(BaseOptions));
        var JsonOptions = (function (_super) {
            __extends(JsonOptions, _super);
            function JsonOptions() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            JsonOptions.prototype.getOptionObject = function () {
                var options = {
                    indentation: +this.$selectValue('#json-indent')
                };
                this.addAccuracy('#json-accuracy', options);
                return options;
            };
            return JsonOptions;
        }(BaseOptions));
        var JscadScriptOptions = (function (_super) {
            __extends(JscadScriptOptions, _super);
            function JscadScriptOptions() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            JscadScriptOptions.prototype.getOptionObject = function () {
                var extrude = this.$number('#openjscad-extrusion');
                if (extrude <= 0) {
                    //show the UI
                    return null;
                }
                else {
                    //hide the ui
                }
                var options = {
                    extrude: extrude,
                    functionName: this.$selectValue('#openjscad-name'),
                    indent: this.$number('#openjscad-indent'),
                    maxArcFacet: +this.$selectValue('#openjscad-facetsize')
                };
                this.addAccuracy('#openjscad-accuracy', options);
                return options;
            };
            return JscadScriptOptions;
        }(BaseOptions));
        var StlOptions = (function (_super) {
            __extends(StlOptions, _super);
            function StlOptions(format, formatTitle, div, model) {
                return _super.call(this, format, formatTitle, div, model) || this;
                //modelToExport.exporterOptions['toJscadCSG'])
                // TODO:
                // inspect model to see if it contains exporterOptions.layerOptions
                // then disable extrude
            }
            StlOptions.prototype.getOptionObject = function () {
                var options = {
                    maxArcFacet: +this.$selectValue('#stl-facetsize'),
                    extrude: this.$number('#stl-extrude')
                };
                return options;
            };
            return StlOptions;
        }(BaseOptions));
        var PdfOptions = (function (_super) {
            __extends(PdfOptions, _super);
            function PdfOptions() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            PdfOptions.prototype.getOptionObject = function () {
                var options = {
                    origin: [
                        +this.$selectValue('#pdf-leftmargin') * 72,
                        +this.$selectValue('#pdf-topmargin') * 72
                    ]
                };
                return options;
            };
            return PdfOptions;
        }(BaseOptions));
        var classes = {};
        classes[MakerJsPlaygroundExport.ExportFormat.Dxf] = DxfOptions;
        classes[MakerJsPlaygroundExport.ExportFormat.Json] = JsonOptions;
        classes[MakerJsPlaygroundExport.ExportFormat.OpenJsCad] = JscadScriptOptions;
        classes[MakerJsPlaygroundExport.ExportFormat.Pdf] = PdfOptions;
        classes[MakerJsPlaygroundExport.ExportFormat.Stl] = StlOptions;
        classes[MakerJsPlaygroundExport.ExportFormat.Svg] = SvgOptions;
        function activateOption(format, formatTitle, model) {
            var formatId = MakerJsPlaygroundExport.ExportFormat[format];
            //deselect all
            var all = document.querySelectorAll(".download-option");
            for (var i = 0; i < all.length; i++)
                all[i].classList.remove('selected');
            //select current
            var div = document.querySelector(".download-option[data-format=\"" + formatId + "\"]");
            div.classList.add('selected');
            var formatClass = classes[format];
            FormatOptions.current = new formatClass(format, formatTitle, div, model);
        }
        FormatOptions.activateOption = activateOption;
    })(FormatOptions = MakerJsPlayground.FormatOptions || (MakerJsPlayground.FormatOptions = {}));
})(MakerJsPlayground || (MakerJsPlayground = {}));
//# sourceMappingURL=format-options.js.map