/**
 * 선언적 모달 API 유틸리티 함수들
 * 전역에서 사용할 수 있는 모달 API를 제공합니다.
 */

import type { FormData, ModalResult } from '../types';

// 전역 모달 인스턴스 참조
let globalModalInstance: {
  openFormModal: () => Promise<ModalResult>;
} | null = null;

/**
 * 전역 모달 인스턴스 등록
 * useModal 훅에서 호출하여 전역에서 사용할 수 있도록 합니다.
 *
 * @param instance - 모달 인스턴스
 */
export const registerModalInstance = (instance: {
  openFormModal: () => Promise<ModalResult>;
}) => {
  globalModalInstance = instance;
};

/**
 * 전역 모달 인스턴스 해제
 */
export const unregisterModalInstance = () => {
  globalModalInstance = null;
};

export const openFormModal = (): Promise<ModalResult> => {
  if (!globalModalInstance) {
    return Promise.reject(
      new Error(
        '모달 인스턴스가 등록되지 않았습니다. useModal 훅이 마운트된 컴포넌트가 필요합니다.'
      )
    );
  }

  return globalModalInstance.openFormModal();
};

/**
 * 타입 안전한 폼 데이터 검증
 *
 * @param result - 모달 결과
 * @returns result가 FormData인지 확인
 */
export const isFormData = (result: ModalResult): result is FormData => {
  return result !== null && typeof result === 'object';
};

/**
 * 폼 데이터를 JSON 문자열로 변환
 *
 * @param data - 폼 데이터
 * @returns JSON 문자열
 */
export const serializeFormData = (data: FormData): string => {
  return JSON.stringify(data, null, 2);
};

/**
 * 폼 데이터 유효성 검증 헬퍼
 *
 * @param data - 폼 데이터
 * @returns 유효성 검증 결과
 */
export const validateFormData = (
  data: FormData
): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (!data.name?.trim()) {
    errors.push('이름은 필수입니다.');
  }

  if (!data.email?.trim()) {
    errors.push('이메일은 필수입니다.');
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.push('유효한 이메일 형식이 아닙니다.');
    }
  }

  if (!data.experience?.trim()) {
    errors.push('경력 연차는 필수입니다.');
  }

  if (data.github?.trim()) {
    const urlRegex = /^https?:\/\/.+/;
    if (!urlRegex.test(data.github)) {
      errors.push('GitHub URL은 http:// 또는 https://로 시작해야 합니다.');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
