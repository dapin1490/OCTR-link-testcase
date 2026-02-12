const inputPres = document.querySelectorAll('pre[id^="sample-input-"]');
const outputPres = document.querySelectorAll('pre[id^="sample-output-"]');

// 입력: { 1: "텍스트", 2: "텍스트", ... }
const inputs = {};
inputPres.forEach((pre) => {
    const n = parseInt(pre.id.replace('sample-input-', ''), 10);
    if (!isNaN(n)) inputs[n] = pre.textContent;
});

// 출력: { 1: "텍스트", 2: "텍스트", ... }
const outputs = {};
outputPres.forEach((pre) => {
    const n = parseInt(pre.id.replace('sample-output-', ''), 10);
    if (!isNaN(n)) outputs[n] = pre.textContent;
});

// 같은 N끼리 쌍으로 매칭 (출력 없으면 빈 문자열)
const testCases = [];
for (let n = 1; n <= 6; n++) {
    if (inputs[n] !== undefined) {
        testCases.push({
            input: inputs[n],
            expectedOutput: outputs[n] !== undefined ? outputs[n] : ''
        });
    }
}

// testCases 만든 뒤, 0개일 때는 안내 메시지 표시
if (testCases.length === 0) {
    alert('예제 테스트 케이스가 없습니다.');
    return;
}