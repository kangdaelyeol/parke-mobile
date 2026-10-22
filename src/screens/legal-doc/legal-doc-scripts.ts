// LegalDocScreen의 WebView에 주입하는 스크립트.
// 웹 문서 페이지에서 본문(article.privacy-doc)만 보이게 하고, 시행일을 앱에 알린다.

// 문서 로드 전: 본문 정리가 끝날 때까지 화면을 숨겨 사이트 헤더/푸터가 번쩍이지 않게 한다
export const HIDE_UNTIL_READY_JS = `
(function () {
  var style = document.createElement('style');
  style.id = '__parke_hide';
  style.textContent = 'html { visibility: hidden !important; background: #000 !important; }';
  (document.head || document.documentElement).appendChild(style);
})();
true;
`

// 로드 후: article.privacy-doc을 기다렸다가 본문만 남긴다.
// React가 관리하는 DOM이라 노드를 옮기거나 지우지 않고, article 위쪽 형제 요소만 숨긴다.
export const EXTRACT_DOC_JS = `
(function () {
  function post(msg) {
    if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(JSON.stringify(msg));
  }
  function reveal() {
    var hide = document.getElementById('__parke_hide');
    if (hide) hide.remove();
    document.documentElement.style.visibility = 'visible';
  }
  function addStyle() {
    if (document.getElementById('__parke_doc_style')) return;
    var style = document.createElement('style');
    style.id = '__parke_doc_style';
    style.textContent = [
      'html, body { background: #000 !important; margin: 0 !important; padding: 0 !important; }',
      'article.privacy-doc { margin: 0 !important; padding: 8px 18px 48px !important; max-width: none !important; }',
      'header.privacy-doc-header { margin-top: 0 !important; padding-top: 0 !important; }'
    ].join('\\n');
    document.head.appendChild(style);
  }
  // article의 조상마다 형제 요소를 숨긴다 (사이트 공통 헤더/푸터)
  function isolate(article) {
    var node = article;
    while (node && node.parentElement && node !== document.body) {
      var parent = node.parentElement;
      for (var i = 0; i < parent.children.length; i++) {
        var sibling = parent.children[i];
        if (sibling !== node && sibling.tagName !== 'SCRIPT' && sibling.tagName !== 'STYLE') {
          sibling.style.setProperty('display', 'none', 'important');
        }
      }
      parent.style.setProperty('margin', '0', 'important');
      parent.style.setProperty('padding', '0', 'important');
      node = parent;
    }
  }
  function apply(article) {
    if (article.getAttribute('data-parke') === '1') return;
    article.setAttribute('data-parke', '1');
    article.querySelectorAll('.privacy-doc-back, nav.privacy-doc-tabs').forEach(function (el) { el.remove(); });
    // 문서 제목은 앱 헤더에 있으므로 숨긴다 (시행일은 남긴다)
    article.querySelectorAll('header.privacy-doc-header h1, .privacy-doc-app').forEach(function (el) {
      el.style.setProperty('display', 'none', 'important');
    });
    addStyle();
    isolate(article);
    var date = article.querySelector('.privacy-doc-date');
    if (date) post({ type: 'effectiveDate', value: (date.textContent || '').trim() });
    post({ type: 'ready' });
    reveal();
  }

  var timer = setTimeout(function () {
    reveal();
    post({ type: 'notFound' });
  }, 5000);
  function check() {
    var article = document.querySelector('article.privacy-doc');
    if (!article) return;
    clearTimeout(timer);
    apply(article);
  }
  // 문서 안 링크로 다른 문서로 넘어가도(SPA 라우팅) 다시 정리되도록 계속 지켜본다
  new MutationObserver(check).observe(document.documentElement, { childList: true, subtree: true });
  check();
})();
true;
`
