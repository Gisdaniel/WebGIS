dojo.require("esri.map");
dojo.require("esri.tasks.geometry");
dojo.require("esri.toolbars.draw");
dojo.require("esri.tasks.query");
djConfig = { isDebug:true };
var map,tb,geometryService,queryTask,query;
function init()
{
   startExtent = new esri.geometry.Extent(-183.780014745329,16.2975638854873,-61.4068547410964,74.0304580085983, new esri.SpatialReference({wkid:4269}));
   map = new esri.Map("map");
   //底图Tile图
   var imageryPrime = new esri.layers.ArcGISTiledMapServiceLayer("http://server.arcgisonline.com/ArcGIS/rest/services/NGS_Topo_US_2D/MapServer");
   map.addLayer(imageryPrime);
   
   var usa = new esri.layers.ArcGISDynamicMapServiceLayer("http://jh-53a435fbc0e8/ArcGIS/rest/services/USA/MapServer");
   //设置要显示的图层
   //usa.setVisibleLayers([0]);
   //设置图层透明度
   usa.setOpacity(0.8);
   map.addLayer(usa);
   //设置地图视图范围
   map.setExtent(startExtent);
   geometryService = new esri.tasks.GeometryService("http://jh-53a435fbc0e8/ArcGIS/rest/services/Geometry/GeometryServer");
   tb = new esri.toolbars.Draw(map);
   dojo.connect(tb, "onDrawEnd", doDraw);
}
//画图
function doDraw(geometry)
{
   //根据图形的类型定义显示样式
   switch (geometry.type)
   {
      case "point":
          var symbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_SQUARE, 10, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255,0,0]), 1), new dojo.Color([0,255,0,0.25]));
          break;
      case "polyline":
           var symbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASH, new dojo.Color([255,0,0]), 1);
           break;
      case "polygon":
           var symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0,0,0]), 1), new dojo.Color([255,0,0,0.25]));
           break;
   }
   //把绘制的图形添加到map.graphics进行显示
   var graphic = new esri.Graphic(geometry, symbol);
   map.graphics.add(graphic);
   
   //如果是面需要先进行simplify操作，否则直接进行buffer
   if(geometry.type === "polygon")
   {
      geometryService.simplify([graphic],doSimplify);
   }
   else
   {
      doBuffer([graphic]);
   }
}
//simplify结束调用buffer
function doSimplify(graphics)
{
   doBuffer(graphics);
}
function doBuffer(graphics)
{
   //buffer参数
   var params = new esri.tasks.BufferParameters();
   //buffer的范围值，从输入框中获取
   params.distances = [ dojo.byId("distance").value ];
   //空间参考
   params.bufferSpatialReference =new esri.SpatialReference({wkid: dojo.byId("wkid").value});
   //输出结果的空间参考
   params.outSpatialReference = map.spatialReference;
   params.features = graphics;
   //buffer的单位，从列表框获取
   params.unit = eval("esri.tasks.BufferParameters."+dojo.byId("unit").value);
   //buffer操作
   geometryService.buffer(params,showBuffer);
}
//显示buffer的结果
function showBuffer(features)
{
   var symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,new dojo.Color([255,0,0,0.65]), 2),new dojo.Color([255,0,0,0.35]));
   for (var j=0;j<features.length;j++)
   {
      var graphic = new esri.Graphic(features[j].geometry,symbol);
      map.graphics.add(graphic);
   }
   tb.deactivate();
   map.showZoomSlider();
   
}
dojo.addOnLoad(init);