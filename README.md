## OCTR-link-testcase

백준(acmicpc.net) 문제 페이지에서 예제 테스트 케이스를 추출해,  \
[online-cote-runner](https://dapin1490.github.io/online-cote-runner/)로 바로 보내주는 Chrome 확장 프로그램입니다.

---

### 핵심 아이디어

- **Zero-Cost / Zero-Setup**
  - 서버나 DB 없이, 오직 브라우저 확장과 클라이언트 코드만으로 동작
  - API Key 미사용 (Piston API는 [online-cote-runner](https://dapin1490.github.io/online-cote-runner/) 내부에서만 사용)
- **테스트케이스 전용 연동**
  - 백준의 예제 입력/출력을 파싱해 `testCases` 배열만을 만들고,
  - 이를 `lz-string`으로 압축해 `#data=...` 형태의 URL hash로 전달
  - [online-cote-runner](https://dapin1490.github.io/online-cote-runner/)는 이 데이터를 받아 테스트 케이스 탭 상태를 복원

---

### 동작 개요

1. 사용자가 백준 문제 페이지(`https://www.acmicpc.net/problem/*`)를 연다.
2. 확장의 content script가 상단 메뉴(`.problem-menu`)에 **"OCTR로 풀기"** 버튼을 추가한다.
3. 버튼 클릭 시,
   - `pre[id^="sample-input-"]`, `pre[id^="sample-output-"]`에서 예제 입·출력을 수집하고,
   - `sample-input-{N}` ↔ `sample-output-{N}` 쌍 기준으로 최대 6개 테스트케이스를 구성한다.
   - `{ testCases: [ { input, expectedOutput }, ... ] }` JSON을 `JSON.stringify()` 후,
     `LZString.compressToEncodedURIComponent()`로 압축한다.
   - `https://dapin1490.github.io/online-cote-runner/#data={압축데이터}` URL을 만들고,
     `window.open(url, '_blank')`로 새 탭에서 연다.
4. [online-cote-runner](https://dapin1490.github.io/online-cote-runner/)는 `#data=` hash를 읽어 테스트 케이스만 복원한다.

자세한 스펙은 [docs/PRD.md](docs/PRD.md), [docs/TECHNICAL_SPEC.md](docs/TECHNICAL_SPEC.md)를 참고하세요.

---

### 개발자용 안내

- **기술 스택**
  - Chrome Extension Manifest V3
  - Vanilla JavaScript (content script)
  - `lz-string` (URL-safe 압축)
  - 참고 레포지토리: [online-cote-runner](https://dapin1490.github.io/online-cote-runner/)
- **작업 순서**
  - `docs/TODO.md`에 실제 개발 플로우와 체크리스트를 정리해 두었습니다.
  - Manifest 설정 → content script 작성 → DOM 파싱 → JSON/압축 → 버튼 UI → 테스트 순으로 진행하면 됩니다.