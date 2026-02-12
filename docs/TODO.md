# 개발 TODO (BOJ → Online-Cote-Runner Connector)

실제 개발 순서대로 정리한 체크리스트. 각 단계 완료 후 [x] 표시.

---

## 1. 프로젝트 구조 및 의존성

- [x] **1.1** 확장 프로그램 루트 디렉터리 구조 정하기  
  - 예: `manifest.json`, `content.js`, `lib/`(또는 `vendor/`), 필요 시 `icons/`
- [x] **1.2** `lz-string.min.js` 다운로드 후 프로젝트에 포함  
  - [npm/lz-string](https://www.npmjs.com/package/lz-string) 또는 [공식 저장소](https://github.com/pieroxy/lz-string)에서 `libs/lz-string.min.js` 복사  
  - 경로 예: `lib/lz-string.min.js` (manifest에서 content script보다 먼저 로드되도록 설정할 예정)

---

## 2. Manifest (Manifest V3)

- [x] **2.1** `manifest.json` 생성, `manifest_version: 3` 명시
- [x] **2.2** `name`, `version`, `description` 등 메타데이터 작성
- [x] **2.3** `content_scripts` 설정  
  - `matches`: `["https://www.acmicpc.net/problem/*"]`  
  - `js`: lz-string 먼저, 그다음 content 스크립트 (예: `["lib/lz-string.min.js", "content.js"]`)  
  - `run_at`: `"document_idle"` (DOM 준비 후 실행 권장)
- [x] **2.4** `host_permissions` (필요 시): `["https://www.acmicpc.net/*"]`  
  - content script가 해당 페이지 DOM에 접근하는 데 필요
- [x] **2.5** 아이콘(선택): `icons/` 에 16x16, 48x48 등 지정 시 확장 아이콘 표시

---

## 3. 백준 DOM 파싱 로직 (content.js)

- [x] **3.1** `pre[id^="sample-input-"]` 로 모든 입력용 `pre` 노드 수집
- [x] **3.2** `pre[id^="sample-output-"]` 로 모든 출력용 `pre` 노드 수집
- [x] **3.3** id에서 숫자 suffix `N` 추출 (예: `sample-input-1` → `1`)  
  - 입력·출력 각각 `{ N: textContent }` 형태 또는 `[ { id: N, text: ... } ]` 형태로 정규화
- [x] **3.4** 같은 `N`을 가진 입력·출력끼리 쌍으로 매칭  
  - 한쪽에만 있는 `N`은 무시하거나, 출력이 없으면 빈 문자열 등으로 처리 (스펙: “같은 suffix 쌍”)
- [x] **3.5** 쌍을 **최대 6개**로 제한 (앞에서부터 1~6만 사용)
- [x] **3.6** 텍스트 추출 시 `pre`의 `.textContent` 사용 (공백/줄바꿈 유지, `<span class="space-highlight">` 등은 textContent에서 공백으로 나옴)
- [x] **3.7** 테스트 케이스가 0개인 경우를 판별하는 로직 추가 (이때는 URL 생성/오픈하지 않고, 4단계에서 안내 메시지로 분기)

---

## 4. JSON 구성 및 압축

- [x] **4.1** 파싱 결과를 다음 형태의 객체로 구성  
  `{ "testCases": [ { "input": "...", "expectedOutput": "..." }, ... ] }`
- [x] **4.2** `JSON.stringify()` 로 직렬화
- [x] **4.3** `LZString.compressToEncodedURIComponent(jsonString)` 호출  
  - lz-string을 스크립트로 불러왔으므로 전역 `LZString` 사용
- [x] **4.4** 최종 URL 생성:  
  `https://dapin1490.github.io/online-cote-runner/#data=${압축된문자열}`
- [x] **4.5** 테스트 케이스 0개일 때: URL을 만들지 않고, 사용자에게 안내 메시지 표시 (예: `alert('예제 테스트 케이스가 없습니다.')` 또는 동일 의미 문구)

---

## 5. 버튼 UI 및 이벤트

- [x] **5.1** `.problem-menu` 요소를 `querySelector` 등으로 선택
- [x] **5.2** `document.createElement('li')` 로 `li` 생성, 그 안에 `<a href="#" id="octr-link-button">OCTR로 풀기</a>` 삽입  
  - 기존 메뉴가 `li > a` 구조이므로 동일하게 맞춤
- [x] **5.3** `.problem-menu`의 **마지막 자식**으로 해당 `li`를 `appendChild` 로 추가
- [x] **5.4** `#octr-link-button`(또는 동일 id/선택자)에 클릭 리스너 등록  
  - `event.preventDefault()` 로 기본 링크 동작 방지  
  - 위 3~4단계 로직 호출: 파싱 → JSON → 압축 → URL 생성  
  - 테스트 케이스 0개면 안내 메시지 후 `return`  
  - 그 외: `window.open(생성된_URL, '_blank')` 호출
- [x] **5.5** (선택) 기존 메뉴와 비슷한 스타일을 위해 `a`에 클래스 추가하거나, 기존 메뉴 `a`와 동일한 클래스 적용

---

## 6. 통합 및 예외 처리

- [x] **6.1** 페이지 로드 시(또는 content script 실행 시) 한 번만 버튼을 주입하도록 처리 (중복 주입 방지)
- [x] **6.2** `.problem-menu`이 없을 경우: 버튼 주입 건너뛰기 또는 콘솔 경고 (문제 페이지가 아닌 경우 대비)
- [x] **6.3** 입·출력 개수 불일치: 같은 suffix `N`끼리만 매칭하고, 최대 6개 제한 적용 (불일치 시 나머지는 무시해도 됨, 스펙상 best-effort)

---

## 7. 테스트 및 OCR 호환 검증

- [ ] **7.1** Chrome에서 “압축 해제된 확장 프로그램 로드”로 해당 폴더 로드 후, 백준 문제 페이지(예: 1000번, 31747번)에서 버튼 노출 확인
- [ ] **7.2** “OCTR로 풀기” 클릭 시 새 탭에서 `online-cote-runner`가 열리고, URL에 `#data=...` 포함되는지 확인
- [ ] **7.3** 열린 OCR 페이지에서 테스트 케이스 탭이 파싱한 입력/출력과 일치하는지 확인 (testCases-only 복원이 OCR 쪽에 반영되어 있어야 함)
- [ ] **7.4** 테스트 케이스가 0개인 문제(또는 해당 케이스를 임의로 비우고 테스트)에서 안내 메시지가 뜨고, 새 탭이 열리지 않는지 확인
- [ ] **7.5** (선택) 예제가 3개 이상인 문제에서 최대 6개만 전달되는지, 6개 초과 시 잘리는지 확인

---

## 8. 마무리

- [ ] **8.1** `docs/INSTRUCTION_FOR_CURSOR.md` 및 `docs/TECHNICAL_SPEC.md` 와 구현이 일치하는지 최종 확인
- [ ] **8.2** README 등 사용법/빌드 방법 간단히 정리 (선택)
