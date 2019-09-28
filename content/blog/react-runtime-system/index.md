---
title: React는 어떻게 동작하는가
date: "2019-09-28"
description: "리액트는 어떻게 동작할까? React와 내부 개념들에 대한 간략한 정리"
tags: ["React"]
---


단방향 데이터 흐름, 상위 컴포넌트의 상태 변경에 따른 리렌더링, immutable한 state 관리 등 React를 사용하여 개발 하다보면 다른 UI 프로그래밍 모델에서는 낯선 개념들을 마주할 때가 있습니다. [Dan Abramov](https://mobile.twitter.com/dan_abramov)가 이러한 개념들에 대해 명쾌하게 설명한 글 [React as a UI Runtime](https://overreacted.io/react-as-a-ui-runtime/) 을 읽으며 간략하게 정리한 내용입니다. 원글의 양이 길어 hooks 등의 개념은 따로 정리할 예정입니다.

## Host Tree

React는 일반적으로 동적으로 변화할 수 있는 트리를 출력하는 프로그램이다. ([DOM 트리](https://www.npmjs.com/package/react-dom), [PDF 요소들의 트리](https://react-pdf.org/), [JSON 객체](https://reactjs.org/docs/test-renderer.html) 등) 이것을 ‘호스트 트리’ 라고 한다. (DOM이나 iOS와 같이 외부 호스트 환경의 일부이기 때문)

React는 외부 상호작용, 네트워크 응답, 타이머 등 **외부 이벤트에 대한 응답으로 복잡한 호스트 트리를 예측할 수 있게 조작하는 프로그램을 작성**하는데 유용하다.

아래 두 가지 법칙이 지켜진다면 React가 유용할 것이다.

- **안정성 (Stability)** 호스트 트리의 대부분의 갱신은 전체 구조를 뜯어고치지 않는다.
- **규칙성 (Regularity)** 호스트 트리는 무작위 형태가 아닌 일관된 모습과 동작을 가진 UI 패턴(버튼, 목록, 아바타)으로 나눌 수 있다.

⇒ 대부분의 UI에 적용된다. (반면 일정한 '패턴'이 없는 Window의 3D 파이프 스크린 세이버 등에는 그렇지않다.)

## Host Instances

호스트 트리는 노드로 구성된다.. 이것을 ‘호스트 인스턴스’라고 부른다. (e.g. DOM 환경에서 `document.createElement('div')` 등)

호스트 인스턴스는 고유한 속성을 가진다. (e.g. `domNode.className` 등) 또한 다른 호스트 인스턴스 자식으로 포함 할 수 있다.

일반적으로 호스트 인스턴스를 조작하는 API가 있다. (e.g. `appendChild` 등) **React 앱에서는 일반적으로 이런 API를 직접 호출하지 않는다. React가 처리한다.**

## Renderers

렌더러는 React가 특정 호스트 환경과 통신할 수 있도록 호스트 인스턴스를 관리한다. (e.g. React DOM, React Native 혹은 [직접 React renderer를 만들 수도 있다.](https://github.com/facebook/react/tree/master/packages/react-reconciler))

## React Element

호스트 환경에서 가장 작은 구성 요소는 호스트 인스턴스이다. (e.g. DOM node) React에서는 제일 작은 빌딩 요소는 *React Element*이다.

React element는 호스트 인스턴스를 표현 수 있는 plain JavaScript object. (가볍다.)
```jsx
// JSX는 아래 오브젝트를 만들기 위한 편의구문
// <dialog>
//   <button className="blue" />
//   <button className="red" />
// </dialog>
{
  type: 'dialog',
  props: {
    children: [{
      type: 'button',
      props: { className: 'blue' }
    }, {
      type: 'button',
      props: { className: 'red' }
    }]
  }
}
```
(이 설명에서 크게 중요하지 않은 [몇 가지 속성들](https://overreacted.io/why-do-react-elements-have-typeof-property/)은 생략했다.)

React 엘리먼트는 영속성을 가지지 않는다. 매번 버리고 새로 만들어진다.

React 엘리먼트는 불변이다. 예를 들어 React 엘리먼트의 자식이나 props를 수정할 수 없다. 다른 렌더링을 하고 싶다면 새로운 React 엘리먼트 트리를 생성해야한다.

React 엘리먼트는 영화의 프레임과도 같다. React 엘리먼트는 매 순간 어떻게 보여야 되는지 나타내고 변하지 않는다.

## Entry Point

React가 컨테이너 호스트 인스턴스 내부에 특정 React 엘리먼트 트리를 렌더링 할 수 있게 해주는 API (e.g. `ReactDOM.render`)

```jsx
ReactDOM.render(
  // { type: 'button', props: { className: 'blue' } }
  <button className="blue" />,
  document.getElementById('container')
);
```

`ReactDOM.render(reactElement, domContainer)`의 의미는 “React, `domContainer` 호스트 트리를 나의 `reactElement`와 같게 만들어줘”와 같다.

React는 `reactElement.type`을 보고 React DOM에 호스트 인스턴스 생성한다. (e.g. `createElement`)

자식을 가지고 있다면 React는 첫 렌더링에 재귀적으로 호스트 인스턴스 생성한다.

## Reconciliation (재조정)

React의 목표는 주어진 React 엘리먼트 트리와 호스트 트리를 일치시키는 것이다. **새로운 정보의 응답으로 호스트 인스턴스 트리에 어떤 작업을 해야할지 파악하는 프로세스**를 [재조정](https://reactjs.org/docs/reconciliation.html)이라고 부른다. (자세한 내용은 [공식 문서](https://reactjs.org/docs/reconciliation.html)를 참조하자)

트리의 같은 위치에 있는 **엘리먼트 타입이 이전 렌더링과 다음 렌더링 사이에**

- 일치하면 ⇒ React는 기존 호스트 인스턴스를 다시 사용
- 불일치하면 ⇒ 기존 트리를 날려버리고 새로운 트리를 만든다.

자식 트리에 같은 휴리스틱 알고리즘을 반복하여 적용한다.

## Conditions
```jsx
function Form({ showMessage }) {
  return (
    <dialog>
      {showMessage && <p>I was just added here!</p>;}
      <input />
    </dialog>);
}
```
`showMessage`의 값과 관계없이 `<input>`은 항상 두 번째 자식이고 렌더링 전후 위치가 변하지 않는다.

`dialog → dialog`: 호스트 인스턴스를 재사용? 🙆🏻‍♂️ **(타입 일치)**

- `(false) → p`: 새로운 `p` 호스트 인스턴스를 만들어야함.
- `input → input`: 호스트 인스턴스를 재사용? 🙆🏻‍♂️ **(타입 일치)**

⇒ React는 `createElement('p')` ⇒ `insertBefore(...)` 대략 이런 코드를 수행하고 `input` 의 상태는 손실되지 않을 것

## List
```jsx
function ShoppingList({ list }) {
  return (
    <form>
      {list.map(item => (
        <p>
          You bought {item.name}
          <br />
          Enter how many do you want: <input />
        </p>
      ))}
    </form>
  )
}
```

`ShoppingList`의 list가 재정렬된다면 React는 순서가 변경된 것을 알지 못한다. Reconciliation 규칙에 따라 변경된 텍스트 영역만 업데이트 할 것이다. 하지만 이 경우, **input은 변경되지 않으므로 재정렬 후 참조가 꼬이는 버그가 발생**한다.

**이것이 매번 React가 엘리먼트 배열에 key prop을 요구하는 이유**이다. `key`는  아이템이 어느 위치에 있었는지 알려준다. React는 같은 `key`를 가진 이전 호스트 인스턴스를 재사용하고 자식의 순서를 재정렬한다.

`key`는 항상 같은 부모 React 엘리먼트 안에서만 유효하다.

## Purity (순수성)

React 컴포넌트는 전달받은 props에 대해 순수하다고 가정한다. 일반적으로 React에서 mutation은 부자연스럽다.

```jsx
function Button(props) {
  // 🔴 Doesn't work
  props.isActive = true;
}
```

Local mutation은 전혀 상관 없다. 비슷한 맥락으로 전혀 "pure"하지 않은 lazy initialization도 괜찮다.

```jsx
function ExpenseForm() {
  // Fine if it doesn't affect other components:
  SuperCalculator.initializeIfNotReady();

  // Continue rendering...
}
```

다른 컴포넌트의 렌더링에 영향을 주지 않으면 컴포넌트를 여러 번 호출하는 것도 상관없다. React는 엄격한 함수형 패러다임처럼 100% 순수성을 가지지 못해도 괜찮다. [멱등성](https://stackoverflow.com/questions/1077412/what-is-an-idempotent-operation)은 React에서 순수성보다 훨씬 중요하다. (= 컴포넌트를 여러번 호출해도 같은 결과를 만들도록 할 것)

정리하면, React 컴포넌트에서 사용자가 볼 수 있는 부수 효과는 허용되지 않는다.  컴포넌트 함수를 호출하더라도 직접적으로 화면에 변경을 일으키면 안된다.

## Recursion (재귀)

컴포넌트는 함수이기 때문에 호출이 가능하다. 하지만 React 런타임에서 자연스러운 방법은 아니다.

컴포넌트를 사용하는 자연스러운 방법: **직접 컴포넌트 함수를 호출하지 말고 React가 알아서 하도록 하는 것**

```jsx
// { type: Form, props: { showMessage: true } }
let reactElement = <Form showMessage={true} />;
ReactDOM.render(reactElement, domContainer);
```
React 내부 어딘가에서 컴포넌트가 호출 될 것이다. JSX가 변환될 때 `<form>`과 `<Form>`은 각각 다른 타입으로 볼 것이다.

```jsx
console.log(<form />.type); // 'form' string
console.log(<Form />.type); // Form function
```

전역 등록 메커니즘은 없다. `<Form />`이라고 치면 문자열 그대로 Form을 참조한다.

React 엘리먼트 타입이 함수라면 React는 컴포넌트를 호출해서 어떤 엘리먼트를 렌더링 하고 싶은지 물어본다. 이 과정은 재귀적으로 진행되고 [여기](https://reactjs.org/blog/2015/12/18/react-components-elements-and-instances.html)에 좀 더 자세하게 설명되어 있다.

## Inversion of Control (제어의 역전)

왜 컴포넌트를 직접 호출하면 안될까?

- **컴포넌트는 함수 이상의 역할을 한다.** local state와 같은 기능들로 컴포넌트 함수를 강력하게 만들어준다. 컴포넌트를 직접 호출한다면 이 기능들을 직접 구축해야 할 것이다.

- **컴포넌트 타입은 reconciliation에 관여한다.** React가 컴포넌트를 호출함으로써 트리의 개념 구조를 알려줄 수 있다. 예를 들어, 트리의 input의 위치가 같더라도 <PasswordForm>과 <MessengerChat> 사이에서 재조정이 일어나고, 입력 상태가 유지되지 않도록 할 수 있다.

- **React가 reconciliation을 지연시킬 수 있다.** 가령 브라우저가 컴포넌트 호출 사이에서 특정 작업을 할 수 있도록 하여 큰 컴포넌트 트리를 다시 렌더링 하더라도 [메인 스레드를 멈추지 않게 할 수 있다.](https://reactjs.org/blog/2018/03/01/sneak-peek-beyond-react-16.html)

- **더 나은 디버깅** 라이브러리에서 컴포넌트를 1급 객체로 하여 내부에 접근 가능한 풍성한 개발 도구를 지원 가능하다.

마지막 이점은 **지연 평가**이다.

## Lazy Evaluation (지연 평가)

React 컴포넌트는 비교적 순수하지만 화면에 나타나지 않는다면 실행할 필요가 없다.

```js
{
    type: Page,
    props: {
      children: Comments() // 항상 실행된다다!
    }
  }

{
    type: Page,
    props: {
      children: { type: Comments }
    }
}
```   

컴포넌트로 작성하면 React가 호출 시점을 결정할 수 있게 해 줍니다. (불필요한 렌더링을 피할 수 있게 하고 코드의 취약성을 줄일 수 있다.)

## Consistency (일관성)

reconciliation 과정은 논-블로킹 작업으로 나누더라도, 실제 호스트 트리에서의 작업은 여전히 단일 동기 흐름안에서 수행되어야한다. 이렇게 하면 사용자가 덜 만들어진 UI를 볼 수 없고, 브라우저가 중간 상태에 대해 불필요한 레이아웃 및 스타일 재계산을 수행하지 않도록 할 수 있다.

위 이유로 React는 모든 작업을 “render phase”와 “commit phase”로 나눈다. 

- Render phase: React가 컴포넌트를 호출, reconciliation을 수행. 중단해도 안전하며 [앞으로는 비동기적일 것](https://reactjs.org/blog/2018/03/01/sneak-peek-beyond-react-16.html)
- Commit phase: 동기적으로 React가 호스트 트리를 변경하는 단계

## Memoization

부모 컴포넌트가 `setState`를 통해 갱신을 예약하면 React는 기본적으로 전체 하위 트리를 재조정한다. 비용이 클 것 같지만 실제로는 중소형 하위 트리에서는 문제가 되지 않는다.

트리가 너무 깊게 갱신된다면 React에 하위 트리를 메모이제이션해서 얕은 props 비교를 통해 이젠 렌더링 결과를 재사용 할 수 있다.

```js
function Row({ item }) {
  // ...
}

export default React.memo(Row);
```
React는 기본적으로 컴포넌트를 메모하지 않는다. 대부분의 컴포넌트들은 항상 다른 props를 받기 때문에 메모이제이션 비용이 발생할 수 있다.

## Raw Models

역설적이게도 React는 세밀한 갱신을 위해 “reactivity” 시스템을 사용하지 않는다. 이는 의도된 디자인이다. 모델을 순회하며 세밀한 수신자를 설정하는 것은 귀중한 시간을 소비한다. 게다가 많은 앱에서 상호작용은 작은 변화(버튼 호버)나 큰 변화(페이지 이동)로 이어지며 이 경우 작은 단위의 구독은 메모리 낭비이다.

**React의 핵심 설계 원칙 중 하나는 로우 데이터로 동작하는 것**이다. React 렌더링은 O(model size)가 아닌 O(view size) 복잡도를 가지고 view size는 windowing을 통해 크게 줄일 수 있다.

주식 시세 표시 애플리케이션처럼 세밀한 구독이 도움이 되는 경우도 있다. (모든 것이 한번에 지속적으로 갱신되는 경우) React 최상위에 세밀한 구독 시스템을 만들 수도 있지만 React가 좋은 사용 사례가 되지 않을 수도 있다.

세밀한 구독과 반응형 시스템으로도 풀 수 없는 일반적인 성능 이슈들이 존재한다.  React는 [컨커런트 렌더링](https://reactjs.org/blog/2018/03/01/sneak-peek-beyond-react-16.html)을 통해 이 문제들을 해결하고자 한다.

## Batching
```jsx
function Parent() {
  let [count, setCount] = useState(0);
  return (
    <div onClick={() => setCount(count + 1)}>
      Parent clicked {count} times
      <Child />
    </div>
  );
}

function Child() {
  let [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Child clicked {count} times
    </button>
  );
}
```
위 경우, React가 즉시 `setState` 호출에 대한 응답으로 컴포넌트를 다시 렌더링한다면 자식을 두번 렌더링 해야 한다. 

```jsx
*** Entering React's browser click event handler ***
Child (onClick)
  - setState
  - re-render Child // 😞 unnecessary
Parent (onClick)
  - setState
  - re-render Parent
  - re-render Child
*** Exiting React's browser click event handler ***
```

이것이 React가 이벤트 핸들러 사이에서 일괄 갱신을 하는 이유이다.

컴포넌트의 `setState` 호출은 즉시 렌더를 발생시키지 않는다. React는 모든 이벤트 핸들러를 실행시킨 다음 모든 변경사항을 한 번에 다시 렌더한다.

React는 갱신 함수들을 큐에 쌓아놓고 나중에 순서대로 실행한다. 상태 로직이 복잡해진다면 지역 상태를 `useReducer` 훅으로 사용하길 권장한다.

## Call Tree (호출 트리)

React는 내부적으로 현재 렌더되어 있는 컴포넌트를 기억하기 위해 자체적인 호출 스택이 있다. (e.g. 가령 `[App, Page, Layout, Article /** 현재 렌더링 하는 부분 **/])`

이 트리들은 상호작용하기 위해서 계속 살아 있어야 한다. 즉 Article 컴포넌트의 렌더가 끝나도 React 호출 트리는 파괴되지 않는다. local state와 호스트 인스턴스의 참조를 [어딘가에](https://medium.com/react-in-depth/the-how-and-why-on-reacts-usage-of-linked-list-in-fiber-67f1014d0eb7) 유지해야 합니다.

호출 트리 프레임은 재조정 규칙에 따라 지역 상태, 호스트 인스턴스와 함께 파괴됩니다. React 소스를 읽어봤다면 이러한 프레임을 [파이버](https://en.wikipedia.org/wiki/Fiber_(computer_science))라고 부르는 것을 볼 수 있다.

파이버는 지역 상태가 실제로 있는 곳이다. 지역 상태가 업데이트될 때 React는 해당 파이버의 자식들을 재조정하고 해당 컴포넌트들을 호출한다.