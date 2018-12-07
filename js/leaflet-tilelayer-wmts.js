
	L.TileLayer.WMTS = L.TileLayer.extend({
		defaultWmtsParams: {
			service: "WMTS",
			request: "GetTile",
			version: "1.0.0",
			layer: "",
			style: "",
			tilematrixSet: "",
			format: "image/png"
		},
		initialize: function(a, b) {
			this._url = a;
			var c = L.extend({}, this.defaultWmtsParams)
					, d = b.tileSize || this.options.tileSize;
			b.detectRetina && L.Browser.retina ? c.width = c.height = 2 * d : c.width = c.height = d;
			for (var e in b)
				this.options.hasOwnProperty(e) || "matrixIds" == e || (c[e] = b[e]);
			this.wmtsParams = c,
					this.matrixIds = b.matrixIds || this.getDefaultMatrix(),
					L.setOptions(this, b)
		},
		onAdd: function(a) {
			L.TileLayer.prototype.onAdd.call(this, a)
		},
		getTileUrl: function(a, b) {
			var c = this._map
					, d = c.options.crs
					, e = this.options.tileSize
					, f = a.multiplyBy(e);
			f.x += 1,
					f.y -= 1;
			var g = f.add(new L.Point(e,e))
					, h = d.project(c.unproject(f, b))
					, i = d.project(c.unproject(g, b))
					, j = i.x - h.x;
			b = c.getZoom();
			var k = this.matrixIds[b].identifier
					, l = this.matrixIds[b].topLeftCorner.lng
					, m = this.matrixIds[b].topLeftCorner.lat
					, n = Math.floor((h.x - l) / j)
					, o = -Math.floor((h.y - m) / j)
					, p = L.Util.template(this._url, {
						s: this._getSubdomain(a)
					});
			return p + L.Util.getParamString(this.wmtsParams, p) + "&tilematrix=" + k + "&tilerow=" + o + "&tilecol=" + n
		},
		setParams: function(a, b) {
			return L.extend(this.wmtsParams, a),
			b || this.redraw(),
					this
		},
		getDefaultMatrix: function() {
			for (var a = new Array(22), b = 0; b < 22; b++)
				a[b] = {
					identifier: "" + b,
					topLeftCorner: new L.LatLng(20037508.3428,-20037508.3428)
				};
			return a
		}
	}),
			L.tileLayer.wmts = function(a, b) {
				return new L.TileLayer.WMTS(a,b)
			}