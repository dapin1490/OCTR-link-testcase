# Project: BOJ to Online-Cote-Runner Connector

## 1. 개요
- 백준(acmicpc.net) 문제 페이지에서 테스트 케이스를 추출하여 `online-cote-runner` 웹사이트로 전달하는 Chrome 확장 프로그램 개발.

## 2. 핵심 원칙 (Zero-Cost)
- 서버나 DB 없이 클라이언트 사이드 로직으로만 동작함.
- 외부 API 키를 사용하지 않음.

## 3. 주요 기능
- **데이터 추출**: 백준 문제 페이지의 입력값과 출력값을 자동으로 수집.
- **데이터 압축**: 추출된 데이터를 `lz-string` 라이브러리를 사용해 압축.
- **자동 연동**: 압축된 데이터를 URL 파라미터(`#data=...`)에 포함하여 새 탭으로 웹사이트 실행.
- **UI 삽입**: 백준 문제 메뉴 영역에 'OCTR로 풀기' 버튼 추가.

## 4. 기술 스택
- Chrome Extension Manifest V3
- Vanilla JavaScript
- lz-string (Base64 URL-safe compression)