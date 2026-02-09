# Technical Specification

## 1. 대상 사이트 구조 (백준)
- **URL 패턴**: `https://www.acmicpc.net/problem/*`
- **입력값**: `pre[id^="sample-input-"]` 내의 텍스트. (예: `pre.sampledata#sample-input-1`, `sample-input-2` ...)
- **출력값**: `pre[id^="sample-output-"]` 내의 텍스트. (예: `pre.sampledata#sample-output-1`, `sample-output-2` ...)
- **입·출력 매칭 규칙**: `sample-input-{N}`과 `sample-output-{N}`처럼 **같은 숫자 suffix `N`을 가진 쌍**을 하나의 테스트 케이스로 매칭.
- **버튼 삽입 위치**: `.problem-menu` 클래스(예: `ul.nav.nav-pills.no-print.problem-menu`) 요소의 마지막 자식으로 `<li>` 추가.

## 2. 송신 데이터 규격 (JSON)
확장 프로그램은 아래 구조를 만들고 JSON 문자열로 변환해야 함:
{
  "testCases": [        // 최대 6개 제한
    {
      "input": "추출된 입력값",
      "expectedOutput": "추출된 출력값"
    }
  ]
}

## 3. 데이터 전달 프로세스
1. 백준 DOM에서 예제 입·출력을 추출하고, `sample-input-{N}` / `sample-output-{N}` 쌍 기준으로 최대 6개의 테스트 케이스 배열을 구성한다.
   - 테스트 케이스가 0개인 경우: URL을 열지 않고 사용자에게 안내 메시지를 표시한다.
2. 위 JSON 객체를 `JSON.stringify()`로 변환한다.
3. 확장에 포함된 `lz-string.min.js`를 사용해 `LZString.compressToEncodedURIComponent()`로 문자열을 압축한다.
4. `https://dapin1490.github.io/online-cote-runner/#data={압축데이터}` 형태의 URL을 동적으로 생성한다.
5. 백준 문제 페이지의 `content script`에서, `.problem-menu`에 추가한 `<li><a id="octr-link-button">...</a></li>`의 클릭 핸들러에서
   - `event.preventDefault()`로 기본 링크 동작을 막고,
   - `window.open(생성된_URL, '_blank')`를 호출하여 새 탭으로 `online-cote-runner`를 연다.