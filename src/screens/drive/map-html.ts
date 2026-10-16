import { KAKAO_MAP_JS_KEY } from '@/constants'

// WebView 안에서 실행되는 카카오맵 페이지.
// RN → 지도: window.addPoint / setPath / recenter / showSummary 호출 (injectJavaScript)
// 지도 → RN: { type: 'ready' } / { type: 'error', message } 메시지
export const buildMapHtml = (accent: string) => `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
<style>
  html, body, #map { margin: 0; padding: 0; width: 100%; height: 100%; background: #1c1c1c; }
  .me { width: 14px; height: 14px; border-radius: 50%; background: ${accent};
        border: 3px solid #ffffff; box-shadow: 0 0 10px ${accent}; }
  .pin { padding: 4px 8px; border-radius: 10px; color: #ffffff; font: bold 12px sans-serif;
         border: 2px solid #ffffff; white-space: nowrap; }
  .start { background: #2fbf71; }
  .end { background: #ed3a3a; }
</style>
<script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_JS_KEY}&autoload=false"></script>
</head>
<body>
<div id="map"></div>
<script>
(function () {
  function post(msg) {
    if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(JSON.stringify(msg));
  }
  // 지도 엔진 스크립트 등 리소스 로드 실패를 바로 알린다 (시간 초과를 기다리지 않도록)
  window.addEventListener('error', function (e) {
    var src = e.target && e.target.src;
    if (src) post({ type: 'error', message: '지도 리소스를 불러오지 못했습니다.', detail: src });
  }, true);
  if (!window.kakao || !kakao.maps) {
    post({ type: 'error', message: '카카오맵을 불러오지 못했습니다.' });
    return;
  }
  kakao.maps.load(function () {
    var map = new kakao.maps.Map(document.getElementById('map'), {
      center: new kakao.maps.LatLng(37.5665, 126.978),
      level: 4,
    });
    var path = [];
    var line = new kakao.maps.Polyline({
      map: map, path: [], strokeWeight: 6, strokeColor: '${accent}', strokeOpacity: 0.9,
    });
    var me = null;
    var follow = true;

    // 사용자가 지도를 움직이면 자동 따라가기를 멈춘다
    kakao.maps.event.addListener(map, 'dragstart', function () { follow = false; });

    function latLng(p) { return new kakao.maps.LatLng(p[0], p[1]); }
    function setMe(p) {
      if (!me) me = new kakao.maps.CustomOverlay({ map: map, position: p, content: '<div class="me"></div>' });
      else me.setPosition(p);
      if (follow) map.panTo(p);
    }

    window.addPoint = function (lat, lng) {
      var p = new kakao.maps.LatLng(lat, lng);
      path.push(p);
      line.setPath(path);
      setMe(p);
    };
    window.setPath = function (points) {
      path = points.map(latLng);
      line.setPath(path);
      if (path.length) setMe(path[path.length - 1]);
    };
    window.setCurrent = function (lat, lng) {
      setMe(new kakao.maps.LatLng(lat, lng));
    };
    window.recenter = function () {
      if (me) { follow = true; map.panTo(me.getPosition()); return; }
      follow = true;
      if (path.length) map.panTo(path[path.length - 1]);
    };
    window.showSummary = function (points) {
      path = points.map(latLng);
      line.setPath(path);
      if (me) { me.setMap(null); me = null; }
      if (!path.length) return;
      new kakao.maps.CustomOverlay({ map: map, position: path[0], yAnchor: 1.4,
        content: '<div class="pin start">출발</div>' });
      new kakao.maps.CustomOverlay({ map: map, position: path[path.length - 1], yAnchor: 1.4,
        content: '<div class="pin end">도착</div>' });
      var bounds = new kakao.maps.LatLngBounds();
      path.forEach(function (p) { bounds.extend(p); });
      map.setBounds(bounds, 60, 40, 60, 40);
    };

    post({ type: 'ready' });
  });
})();
</script>
</body>
</html>`
