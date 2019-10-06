---
title: JavaScript의 실행 컨텍스트 (Execution Context)
date: "2019-10-06"
description: "실행 컨텍스트(Execution Context)란 실행할 코드에 제공할 환경 정보들을 모아놓은 객체이다."
tags: ["JavaScript"]
---

[《코어 자바스크립트》](https://book.naver.com/bookdb/book_detail.nhn?bid=15433261)의 '실행 컨텍스트' 파트를 읽고 정리한 내용입니다.

## Execution Context (실행 컨텍스트)

실행할 코드에 제공할 환경 정보들을 모아놓은 객체이다. JavaScript 엔진은 컨텍스트를 구성하여 이를 call stack에 쌓아 올렸다가, 가장 위에 쌓여 있는 컨텍스트와 관련 있는 코드들을 실행하는 식으로 전체 코드의 환경과 순서를 보장한다.

## Properties

1. `VariableEnvironment`
    - `environmentRecord` + `outerEnvironmentReference` (둘 다 snapshot)
    - ⇒ 담기는 내용은 `LexicalEnvironment` 와 같지만 최초 실행 시의 스냅샷을 유지한다는 점이 다르다.
2. `LexicalEnvironment`
    - `environmentRecord` + `outerEnvironmentReference`
    
3. `ThisBinding`
    - this로 지정된 객체가 저장된다. 활성화 당시에 this가 지정되지 않은 경우 전역 객체가 저장된다.

## `environmentRecord`

> 현재 컨텍스트 내의 식별자 정보 (매개변수 식별자, 선언된 함수 자체, var로 선언된 변수 등)

`environmentRecord` 에는 **현재 컨텍스트 내의 식별자 정보**들이 저장된다. 컨텍스트 내부 전체를 훑어나가며 순서대로 수집하는데 이 과정은 코드의 실행 전이므로 *'엔진은 식별자들을 최상단으로 끌어올린 다음 실핸한다.'*라고도 해석할 수 있다.**(Hoisting🤩)**

### Function Declaration와 Function Expression

```js
function a() { /* ... */ } // function declaration (함수 선언문). 함수명 a가 곧 변수명
a(); // 실행 OK

var b = function() { /*...*/ }; // function expression (함수 표현식). 변수명 b가 곧 변수명
b(); //실행 OK
```

함수 선언문은 함수 전체가 호이스팅되지만 함수 표현식은 변수 선언부만 호이스팅되는 점을 주의

## `outerEnvironmentReference`

> 외부 환경 정보

**Scope** 식별자(identifier)에 대한 유효범위. ES5 이전에는 함수에 의해서만 생성 / ES6에서는 `let`, `const`, `class` 키워드로 블록 스코프도 생성 가능😎

**Scope Chain** 스코프를 안에서부터 바깥으로 차례로 검색해나가는 메커니즘

`outerEnvironmentReference` 는 해당 함수가 선언될 당시의 `LexicalEnvironment`를 참조하여 Scope Chain을 가능하도록 한다.

각 `outerEnvironmentReference`는 linked list 형태를 띈다.

⇒ 무조건 스코프 체인 상에서 가장 먼저 발견된 식별자에만 접근 가능

⇒ 마지막엔 전역 컨텍스트의 `LexicalEnvironment`를 가리킨다.

## 📘 Learn More

- [Understanding Execution Context and Execution Stack in Javascript](https://blog.bitsrc.io/understanding-execution-context-and-execution-stack-in-javascript-1c9ea8642dd0)
- [자바스크립트의 스코프와 클로저](https://meetup.toast.com/posts/86)
- [ECMA-262-5 in detail. Chapter 3.2. Lexical environments: ECMAScript implementation](http://dmitrysoshnikov.com/ecmascript/es5-chapter-3-2-lexical-environments-ecmascript-implementation/)