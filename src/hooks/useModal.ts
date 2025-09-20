import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  FormData,
  ModalResult,
  ModalState,
  UseModalReturn,
} from '../types';

/**
 * 모달 상태 관리를 위한 커스텀 훅
 * 선언적 API와 명령적 API 모두 지원
 *
 * @returns UseModalReturn - 모달 상태와 액션들
 */
export const useModal = (): UseModalReturn => {
  const [state, setState] = useState<ModalState>({
    isOpen: false,
    isLoading: false,
    triggerElement: null,
    showSuccess: false,
  });

  // Promise resolver를 저장하기 위한 ref
  const resolverRef = useRef<((value: ModalResult) => void) | null>(null);
  // 중복 모달 열기 방지를 위한 플래그
  const isModalOpeningRef = useRef<boolean>(false);

  /**
   * 모달 열기
   */
  const openModal = useCallback((triggerElement: HTMLElement) => {
    setState((prev) => ({
      ...prev,
      isOpen: true,
      triggerElement,
    }));
  }, []);

  /**
   * 모달 닫기
   * @param result - 모달 결과 값 (폼 데이터 또는 null)
   */
  const closeModal = useCallback(
    (result: ModalResult = null) => {
      // 이미 닫혀있다면 무시
      if (!state.isOpen) return;

      setState((prev) => ({
        ...prev,
        isOpen: false,
        isLoading: false,
        showSuccess: false,
      }));

      // Promise resolver 호출
      if (resolverRef.current) {
        resolverRef.current(result);
        resolverRef.current = null;
      }

      // 모달 열기 플래그 초기화
      isModalOpeningRef.current = false;

      // 포커스 복원
      setTimeout(() => {
        if (state.triggerElement) {
          state.triggerElement.focus();
        }
      }, 100);
    },
    [state.isOpen, state.triggerElement]
  );

  /**
   * 폼 제출
   */
  const submitForm = useCallback(
    async (data: FormData): Promise<void> => {
      setState((prev) => ({ ...prev, isLoading: true }));

      try {
        // 실제 서버 요청 시뮬레이션
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // 성공 시 성공 메시지 표시
        setState((prev) => ({
          ...prev,
          isLoading: false,
          showSuccess: true,
        }));

        // 2초 후 모달 닫기
        setTimeout(() => {
          closeModal(data);
        }, 2000);
      } catch (error) {
        setState((prev) => ({ ...prev, isLoading: false }));
        throw error;
      }
    },
    [closeModal]
  );

  /**
   * ESC 키 처리 - 전역에서 처리하여 포커스 위치와 상관없이 동작
   */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && state.isOpen) {
        event.preventDefault();
        event.stopPropagation();
        closeModal();
      }
    };

    if (state.isOpen) {
      // capture: true로 설정하여 다른 이벤트보다 먼저 처리
      document.addEventListener('keydown', handleKeyDown, { capture: true });
      return () =>
        document.removeEventListener('keydown', handleKeyDown, {
          capture: true,
        });
    }
  }, [state.isOpen, closeModal]);

  /**
   * 배경 스크롤 방지
   */
  useEffect(() => {
    if (state.isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [state.isOpen]);

  const openFormModal = useCallback((): Promise<ModalResult> => {
    return new Promise((resolve, reject) => {
      // 중복 모달 열기 방지
      if (state.isOpen || isModalOpeningRef.current) {
        const error = new Error(
          '모달이 이미 열려있습니다. 기존 모달을 먼저 닫아주세요.'
        ) as Error & { code: string };
        error.code = 'ALREADY_OPEN';
        reject(error);
        return;
      }

      // 모달 열기 플래그 설정
      isModalOpeningRef.current = true;
      resolverRef.current = resolve;

      // 현재 포커스된 요소를 트리거로 설정
      const activeElement = document.activeElement as HTMLElement;
      openModal(activeElement || document.body);
    });
  }, [state.isOpen, openModal]);

  return {
    state,
    openModal,
    closeModal,
    submitForm,
    openFormModal,
  };
};
