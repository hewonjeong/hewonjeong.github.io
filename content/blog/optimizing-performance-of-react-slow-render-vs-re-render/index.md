---
title: React 렌더 성능 최적화하기 (slow render vs. re-render)
date: '2019-09-13'
description: '느린 렌더링을 먼저 수정하고, 여전히 필요하다면 불필요한 re-render를 처리'
tags: ['React', 'Performance']
---

[Kent C. Dodds](https://kentcdodds.com)의 [Fix the slow render before you fix the re-render](https://kentcdodds.com/blog/fix-the-slow-render-before-you-fix-the-re-render)를 읽으면서 정리한 내용입니다.

## Re-render?

React가 처음 나왔을 때 가장 주목받은 부분은 기존 UI 라이브러리와 구분되는 "Virtual DOM"을 통한 성능 개선이었습니다.

기존DOM을 여러번 업데이트하는 방식 (`element.appendChild(childElement)` 호출 등)은 여러번 업데이트 하게 되면서 성능 문제가 가중됩니다.

그래서 React는 **"모든 DOM 업데이트를 일괄 처리 (batch DOM updates)"** 합니다. (즉, DOM 업데이트가 30번 발생하면 모아서 한 번에 업데이트를 실행합니다.)

이렇게 하기 위해 React는 DOM을 업데이트하는 주도권이 필요하므로, 우리는 `React.createElement`([JSX](https://reactjs.org/docs/introducing-jsx.html))로 DOM에 무엇을 그리고 싶은지 React에 전달합니다. 상태가 변경되면 이전 렌더된 것과 새 React Elements를 비교합니다.

이 과정을 정리하면,

```
render → reconciliation → commit
      ↖                   ↙
          state change
```

- **render**: React가 React elements를 얻기 위해 우리가 작성한 함수를 호출하는 시기 ([learn more](https://kentcdodds.com/blog/what-is-jsx))
- **reconciliation**: React가 이전에 렌더된 엘리먼트와 위 render 과정에서 얻은 React elements를 비교하는 시기 ([learn more](https://ko.reactjs.org/docs/reconciliation.html))
- **commit**: React가 reconciliation 발견한 차이(differences)를 DOM에 업데이트하는 과정

일반적으로 위 과정 중 가장 느린 부분은 DOM이 업데이트되는 'commit' phase입니다. (모든 DOM updates가 느린 건 아닙니다. 예를 들어, event listener를 추가/삭제하는 업데이트는 굉장히 빠르다. DOM의 느린 부분은 ["layout"](https://www.youtube.com/watch?v=3bc71-xzoWA) 과정입니다.)

React의 일괄 처리(batching) 및 최적화 덕분에 이런 문제를 대부분 피할 수 있지만 가끔 발목을 잡히곤 합니다.

## 😉 불필요한 re-renders

컴포넌트가 re-render된다고 DOM update가 된다는 것은 아닙니다.

```jsx
function Foo() {
  return <div>FOO!</div>
}

function Counter() {
  const [count, setCount] = React.useState(0)
  const increment = () => setCount(c => c + 1)
  return (
    <>
      <Foo />
      <button onClick={increment}>{count}</button>
    </>
  )
}
```

버튼을 클릭할 때 마다 `Foo` 함수가 호출되지만, DOM은 re-render되지 않습니다. 일반적으로 이런 경우를 *'불필요한 re-render'*라고 부릅니다.

"render"와 "commit"의 차이에 대해 헤깔리기 쉽습니다. 사람들은 "DOM은 느리다."라는 것은 잘 알고 있지만, "컴포넌트의 re-render가 DOM를 의미하는 건 아니다."라는 것을 자주 놓치곤 합니다. 이러한 오해 때문에 실제로 컴포넌트를 업데이트 할 필요가 없을 때 컴포넌트 호출되는 render가 성능 병목 현상이라고 생각하는 것 입니다.

이런 게 문제가 되는 상황도 있지만, **일반적으로 심지어 저가형 모바일 기기의 브라우저에서도 객체를 생성하고(render phase), 비교하는 과정(reconciliation phase)은 굉장히 빠릅니다.** 그렇다면 re-render에서 무엇이 문제일까요?

## 🤛 느린 renders

JavaScript가 render와 reconciliation 과정을 처리하는 게 굉장히 빠르다면서 왜 불필요한 re-render 과정에서 앱이 멈추는 걸까요? 이런 경우 일반적으로 느린 렌더가 문제인 경우가 많습니다.

어떤 코드가 render 과정에서 앱을 느리게 하는 어떤 일을 하고 있는 것입니다. 우리는 어떤 코드가 그런 문제를 일으키는지 진단하고 수정해야 합니다.

**실제로 느린 render를 그대로 두고, re-render만 줄이면 상황이 더 나빠질 수 있으며 코드가 더 복잡해질 수 있습니다.**

### 원문에서 든 예시

![](https://user-images.githubusercontent.com/20923534/224480064-108d4242-ae99-48a3-8eae-ae27363b2dfe.gif)

_"만약 눈을 깜빡일 때 마다 스스로 죽빵을 한 대씩 때린다고 해봅시다! (😉🤛 🥴)"_

- "눈을 최대한 깜빡거리지 말아야지😭" 라고 생각하시나요? 스스로 죽빵 때리는 걸 멈춰야 합니다!

- *나쁜 일 (slow renders)*이 자주 일어나는 걸 줄이는 것 보다, 나쁜 일을 제거하면 깜빡이는 데(render) 부담을 가질 필요 없습니다. (원하는 만큼 깜빡여도 된다😉)

## Render 개선하기

**따라서 느린 render를 먼저 수정하고, 그 다음에 re-render가 여전히 문제인지 확인하는 것이 좋습니다.** 좋지 않은 사용자 경험을 유발하는 어떤 인터랙션이 있다면 다음과 같이 수행합니다.

브라우저의 profililing tools ⇒ start profiling ⇒ 인터랙션을 하고 ⇒ stop profiling [(예제 보기)](https://twitter.com/kentcdodds/status/1171158009277403136?ref_src=twsrc%5Etfw%7Ctwcamp%5Etweetembed%7Ctwterm%5E1171158009277403136&ref_url=https%3A%2F%2Fkentcdodds.com%2Fblog%2Ffix-the-slow-render-before-you-fix-the-re-render)

어느 부분 (또는 의존성)이 가장 오래 걸리는 지 파악하고, 문제를 해결 한 후 프로파일러로 개선 되었는지 관찰하세요. 그리고 [React DevTools profiler](https://www.notion.so/hewon/Fix-the-slow-render-before-you-fix-the-re-render-1918bece36e049ebbd5d22e2defcc5cb)도 굉장히 훌륭하니 참고하세요!

## 결론

렌더링이 반드시 필요한지 여부는 중요하지 않습니다. 렌더링이 느리면 결국 사용자에게 나쁜 경험을 제공합니다. 깜빡일 때마다 스스로 얼굴을 때리지 마세요. **느린 렌더링을 먼저 수정하세요.** 그런 다음 (여전히 필요하다면) "불필요한 re-render"을 처리하세요.
