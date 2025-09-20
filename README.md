# 🚀 접근성 친화적 모달 폼

React와 TypeScript를 사용하여 **선언적 API**를 지원하는 접근성 친화적 모달폼 컴포넌트입니다.

## ✨ 주요 특징

### 📋 선언적 API
```typescript
const result = await openFormModal();
if (result) {
  console.log('제출된 데이터:', result);
} else {
  console.log('사용자가 취소했습니다');
}
```

### ♿ 완전한 접근성 지원
- **키보드 내비게이션**: Tab/Shift+Tab으로 완전한 키보드 조작
- **포커스 관리**: 모달 열림/닫힘 시 자동 포커스 이동
- **ARIA 속성**: `aria-modal`, `aria-labelledby`, `aria-describedby` 완벽 지원
- **스크린리더**: 실시간 상태 알림 및 오류 메시지 전달
- **애니메이션 접근성**: `prefers-reduced-motion` 지원

### 🎯 핵심 기능
- ✅ ESC 키 및 배경 클릭으로 모달 닫기
- ✅ 배경 스크롤 방지
- ✅ 폼 유효성 검증 (이메일, GitHub URL 등)
- ✅ 중복 모달 열기 방지
- ✅ TypeScript 완전 타입 안전성

## 🛠 기술 스택

- **React** - 컴포넌트 기반 UI
- **TypeScript** - 타입 안전성
- **React Hook Form** - 폼 상태 관리
- **Zod** - 스키마 유효성 검증
- **Tailwind CSS** - 스타일링

## 🚀 실행 방법

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev
```

## 📁 프로젝트 구조

```
src/
├── hooks/useModal.ts          # 선언적 모달 API 훅
├── utils/modalApi.ts          # 전역 모달 유틸리티
├── components/
│   ├── Modal.tsx              # 접근성 모달 컴포넌트
│   ├── ApplicationForm.tsx    # 폼 컴포넌트
│   └── ui/                    # 기본 UI 컴포넌트들
├── types.ts                   # TypeScript 타입 정의
└── ModalFormPage.tsx          # 메인 페이지
```

## 💡 사용 예시

### 선언적 API (권장)
```typescript
import { useModal } from './hooks/useModal';

const { openFormModal } = useModal();

const handleClick = async () => {
  try {
    const result = await openFormModal();
    if (result) {
      alert(`안녕하세요 ${result.name}님!`);
    }
  } catch (error) {
    console.error('모달 오류:', error);
  }
};
```

### 명령적 API
```typescript
const { openModal, closeModal } = useModal();

const handleClick = () => {
  openModal(buttonElement);
};
```

## 🎯 구현 완료 사항

- [x] **모달 닫기**: ESC 키, 배경 클릭 지원
- [x] **포커스 흐름**: 자동 포커스 이동 및 복원
- [x] **폼 사용성**: 키보드 전용 조작 가능
- [x] **유효성 검증**: 실시간 오류 메시지 및 스크린리더 알림
- [x] **UI/UX**: 배경 스크롤 방지, 내부 스크롤 지원
- [x] **접근성**: ARIA 속성, 애니메이션 접근성 완벽 지원
- [x] **선언적 호출**: Promise 기반 선언적 API 완전 구현

---

> **개발 시간**: 약 2시간
> **접근성 테스트**: 키보드, 스크린리더 완료
