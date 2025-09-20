/**
 * 모달 폼 컴포넌트 타입 정의
 */

/**
 * 폼 필드 값들을 정의하는 인터페이스
 */
export interface FormData {
  /** 사용자 이름 (필수) */
  name: string;
  /** 이메일 주소 (필수, 유효성 검증) */
  email: string;
  /** 경력 연차 (필수) */
  experience: string;
  /** GitHub URL (선택사항, 유효성 검증) */
  github?: string;
}

/**
 * 폼 필드 에러 상태를 정의하는 인터페이스
 */
export interface FormErrors {
  name?: string;
  email?: string;
  experience?: string;
  github?: string;
}

/**
 * 모달 상태를 정의하는 인터페이스
 */
export interface ModalState {
  /** 모달 열림/닫힘 상태 */
  isOpen: boolean;
  /** 폼 제출 중 로딩 상태 */
  isLoading: boolean;
  /** 모달을 연 트리거 요소 참조 */
  triggerElement: HTMLElement | null;
  /** 성공 메시지 표시 상태 */
  showSuccess: boolean;
}

/**
 * 모달 액션들을 정의하는 인터페이스
 */
export interface ModalActions {
  /** 모달 열기 */
  openModal: (triggerElement: HTMLElement) => void;
  /** 모달 닫기 */
  closeModal: (result?: ModalResult) => void;
  /** 폼 제출 */
  submitForm: (data: FormData) => Promise<void>;
  /** 선언적 모달 열기 */
  openFormModal: () => Promise<ModalResult>;
}

/**
 * 선언적 모달 함수의 반환 타입
 */
export type ModalResult = FormData | null;

/**
 * 모달 설정 옵션
 */
export interface ModalOptions {
  /** 모달 제목 */
  title?: string;
  /** 모달 설명 */
  description?: string;
  /** 제출 버튼 텍스트 */
  submitText?: string;
  /** 취소 버튼 텍스트 */
  cancelText?: string;
}

/**
 * 포커스 관리를 위한 유틸리티 타입
 */
export interface FocusableElement {
  element: HTMLElement;
  tabIndex: number;
}

/**
 * 접근성 속성을 위한 ARIA 관련 타입
 */
export interface AriaAttributes {
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-modal'?: 'true' | 'false';
  role?: 'dialog';
}

/**
 * 유효성 검증 규칙 타입
 */
export interface ValidationRule {
  required?: boolean;
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
  message: string;
}

/**
 * 필드별 유효성 검증 규칙
 */
export interface ValidationRules {
  name: ValidationRule[];
  email: ValidationRule[];
  experience: ValidationRule[];
  github?: ValidationRule[];
}

/**
 * 선언적 모달 API 에러 타입
 */
export class ModalError extends Error {
  constructor(
    message: string,
    public code: string
  ) {
    super(message);
    this.name = 'ModalError';
  }
}

/**
 * 모달 에러 코드
 */
export enum ModalErrorCode {
  /** 모달이 이미 열려있음 */
  ALREADY_OPEN = 'ALREADY_OPEN',
  /** 모달 상태가 유효하지 않음 */
  INVALID_STATE = 'INVALID_STATE',
  /** 폼 제출 실패 */
  SUBMIT_FAILED = 'SUBMIT_FAILED',
}

/**
 * useModal 훅의 반환 타입
 */
export interface UseModalReturn {
  /** 모달 상태 */
  state: ModalState;
  /** 모달 열기 (명령적 API) */
  openModal: (triggerElement: HTMLElement) => void;
  /** 모달 닫기 */
  closeModal: (result?: ModalResult) => void;
  /** 폼 제출 */
  submitForm: (data: FormData) => Promise<void>;
  /** 선언적 모달 열기 */
  openFormModal: () => Promise<ModalResult>;
}
