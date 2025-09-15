// Mermaid 다이어그램 초기화
(function() {
  let mermaidInitialized = false;
  let renderTimeout = null;
  
  function initMermaid() {
    if (mermaidInitialized) return;
    
    // Mermaid 라이브러리가 로드되었는지 확인
    if (typeof mermaid === 'undefined') {
      console.log('Mermaid 라이브러리 로딩 대기 중...');
      setTimeout(initMermaid, 300);
      return;
    }
    
    console.log('Mermaid 라이브러리 로드 완료');
    
    // Mermaid 초기화 설정
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: 'Arial, sans-serif',
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true
      },
      sequence: {
        useMaxWidth: true
      },
      gantt: {
        useMaxWidth: true
      },
      class: {
        useMaxWidth: true
      },
      state: {
        useMaxWidth: true
      },
      er: {
        useMaxWidth: true
      },
      mindmap: {
        useMaxWidth: true
      },
      gitgraph: {
        useMaxWidth: true
      }
    });
    
    mermaidInitialized = true;
    renderMermaidDiagrams();
  }
  
  function renderMermaidDiagrams() {
    // 기존 타이머가 있으면 취소
    if (renderTimeout) {
      clearTimeout(renderTimeout);
    }
    
    // 약간의 지연을 두고 렌더링 (DOM이 완전히 준비될 때까지)
    renderTimeout = setTimeout(function() {
      // 모든 .mermaid 클래스를 가진 요소를 렌더링
      const mermaidElements = document.querySelectorAll('.mermaid:not([data-processed])');
      console.log('발견된 Mermaid 요소 수:', mermaidElements.length);
      
      mermaidElements.forEach(function(element, index) {
        // 이미 렌더링된 요소는 건너뛰기
        if (element.innerHTML.includes('<svg') || element.innerHTML.includes('Mermaid')) {
          element.setAttribute('data-processed', 'true');
          return;
        }
        
        if (element.textContent.trim()) {
          const graphDefinition = element.textContent.trim();
          console.log('다이어그램 렌더링 시도:', element.id, graphDefinition.substring(0, 50) + '...');
          
          // 처리 중 표시
          element.setAttribute('data-processed', 'processing');
          
          try {
            // 다이어그램 렌더링
            mermaid.render(element.id + '-svg', graphDefinition).then(function(result) {
              element.innerHTML = result.svg;
              element.setAttribute('data-processed', 'true');
              console.log('다이어그램 렌더링 성공:', element.id);
            }).catch(function(error) {
              console.error('Mermaid 렌더링 오류 (ID: ' + element.id + '):', error);
              element.innerHTML = '<div style="color: red; padding: 10px; border: 1px solid red; border-radius: 4px; background: #ffe6e6;">' +
                '<strong>Mermaid 다이어그램 렌더링 오류</strong><br>' +
                '오류: ' + error.message + '<br>' +
                '다이어그램 ID: ' + element.id + '<br>' +
                '<details><summary>원본 코드 보기</summary><pre>' + 
                graphDefinition.replace(/</g, '&lt;').replace(/>/g, '&gt;') + 
                '</pre></details>' +
                '</div>';
              element.setAttribute('data-processed', 'error');
            });
          } catch (error) {
            console.error('Mermaid 초기화 오류 (ID: ' + element.id + '):', error);
            element.innerHTML = '<div style="color: red; padding: 10px; border: 1px solid red; border-radius: 4px; background: #ffe6e6;">' +
              '<strong>Mermaid 초기화 오류</strong><br>' +
              '오류: ' + error.message + '<br>' +
              '다이어그램 ID: ' + element.id + '<br>' +
              '<details><summary>원본 코드 보기</summary><pre>' + 
              graphDefinition.replace(/</g, '&lt;').replace(/>/g, '&gt;') + 
              '</pre></details>' +
              '</div>';
            element.setAttribute('data-processed', 'error');
          }
        }
      });
    }, 500);
  }
  
  // DOM이 로드되면 초기화 시작
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMermaid);
  } else {
    initMermaid();
  }
  
  // 페이지 로드 완료 후에도 한 번 더 시도
  window.addEventListener('load', function() {
    if (!mermaidInitialized) {
      initMermaid();
    } else {
      renderMermaidDiagrams();
    }
  });
  
  // 스크롤 이벤트에서도 렌더링 시도 (지연 로딩된 요소들)
  window.addEventListener('scroll', function() {
    if (mermaidInitialized) {
      renderMermaidDiagrams();
    }
  });
})();