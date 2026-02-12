function handleOctrClick() {
    /*
    * 백준 DOM 파싱 로직
    * 입력: { 1: "텍스트", 2: "텍스트", ... }
    * 출력: { 1: "텍스트", 2: "텍스트", ... }
    * 같은 N끼리 쌍으로 매칭 (출력 없으면 빈 문자열)
    * 최대 6개 제한
    * 테스트 케이스가 0개인 경우: URL을 열지 않고, 사용자에게 안내 메시지를 표시한다.
    */
    // 1) 입력/출력 pre 수집
    const inputPres = document.querySelectorAll('pre[id^="sample-input-"]');
    const outputPres = document.querySelectorAll('pre[id^="sample-output-"]');

    // 2) inputs / outputs 채우기
    const inputs = {};
    inputPres.forEach((pre) => {
        const n = parseInt(pre.id.replace('sample-input-', ''), 10);
        if (!isNaN(n)) inputs[n] = pre.textContent;
    });

    const outputs = {};
    outputPres.forEach((pre) => {
        const n = parseInt(pre.id.replace('sample-output-', ''), 10);
        if (!isNaN(n)) outputs[n] = pre.textContent;
    });

    // 3) testCases 만들기 (최대 6개)
    const testCases = [];
    for (let n = 1; n <= 6; n++) {
        if (inputs[n] !== undefined) {
            testCases.push({
            input: inputs[n],
            expectedOutput: outputs[n] !== undefined ? outputs[n] : ''
            });
        }
    }

    // 4) 0개면 안내 후 종료 (여기서만 return!)
    if (testCases.length === 0) {
        alert('예제 테스트 케이스가 없습니다.');
        return;
    }

    /*
    * JSON 구성 및 압축
    * 파싱 결과를 다음 형태의 객체로 구성
    * { "testCases": [ { "input": "...", "expectedOutput": "..." }, ... ] }
    * JSON.stringify()로 직렬화
    * LZString.compressToEncodedURIComponent(jsonString)로 압축
    * https://dapin1490.github.io/online-cote-runner/#data=${압축된문자열} 형태의 URL 생성
    */

    // 5) JSON → 압축 → URL
    const payload = { testCases };
    const jsonString = JSON.stringify(payload);
    const compressed = LZString.compressToEncodedURIComponent(jsonString);
    const url = `https://dapin1490.github.io/online-cote-runner/#data=${compressed}`;

    // 6) 새 탭 열기
    window.open(url, '_blank');
}

function initOctrButton() {
    /*
    * 버튼 UI 및 이벤트
    * .problem-menu 요소를 querySelector로 선택
    * 메뉴가 없으면 더 이상 진행하지 않음
    * li 요소 생성
    * a 요소 생성
    * a 요소에 href="#", id="octr-link-button", textContent="OCTR로 풀기" 추가
    * li 요소에 a 요소 추가
    * problem-menu 요소에 li 요소 추가
    */
    const problemMenu = document.querySelector('.problem-menu');
    if (!problemMenu) {
        console.warn('problem-menu 요소를 찾지 못했습니다.');
        return;                 // ← 함수 안이라 OK
    }
    if (document.querySelector('#octr-link-button')) {
        return;                 // ← 이것도 OK
    }

    const li = document.createElement('li');

    const link = document.createElement('a');
    link.href = '#';
    link.id = 'octr-link-button';
    link.textContent = 'OCTR로 풀기';

    li.appendChild(link);
    problemMenu.appendChild(li);

    link.addEventListener('click', (event) => {
        event.preventDefault();
        handleOctrClick();      // 위에서 만든 함수 호출
    });

    link.classList.add('btn-default');
}

// 전역에서는 함수 호출만
initOctrButton();