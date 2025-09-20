import { type ReactNode, useCallback, useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { tv } from 'tailwind-variants';
import type { AriaAttributes } from '../types';

// Modal 스타일 variants
const modalOverlay = tv({
  base: [
    'fixed inset-0 bg-black/50 flex items-center justify-center z-50',
    'animate-fade-in',
  ],
  variants: {
    padding: {
      sm: 'p-2',
      md: 'p-4',
      lg: 'p-6',
    },
  },
  defaultVariants: {
    padding: 'md',
  },
});

const modalContentStyle = tv({
  base: [
    'bg-white rounded-lg shadow-2xl overflow-auto w-full',
    'animate-scale-in',
  ],
  variants: {
    size: {
      sm: 'max-w-sm sm:max-w-xs md:max-w-sm',
      md: 'max-w-md sm:max-w-sm md:max-w-md lg:max-w-lg',
      lg: 'max-w-lg sm:max-w-md md:max-w-lg lg:max-w-xl',
      xl: 'max-w-xl sm:max-w-lg md:max-w-xl lg:max-w-2xl',
      '2xl': 'max-w-2xl sm:max-w-xl md:max-w-2xl lg:max-w-3xl',
      full: 'max-w-full mx-4',
    },
    padding: {
      sm: 'p-4 sm:p-3 md:p-4',
      md: 'p-6 sm:p-4 md:p-6',
      lg: 'p-8 sm:p-6 md:p-8',
      xl: 'p-10 sm:p-8 md:p-10',
    },
    maxHeight: {
      sm: 'max-h-[60vh]',
      md: 'max-h-[80vh]',
      lg: 'max-h-[90vh]',
      full: 'max-h-screen',
    },
  },
  defaultVariants: {
    size: 'md',
    padding: 'lg',
    maxHeight: 'lg',
  },
});

const modalTitleStyle = tv({
  base: [
    'font-bold text-gray-900 mb-4',
    'focus:outline-none focus:ring-0',
    // 반응형 텍스트 크기
    'sm:text-xl md:text-2xl',
  ],
  variants: {
    size: {
      sm: 'text-xl sm:text-lg md:text-xl',
      md: 'text-2xl sm:text-xl md:text-2xl',
      lg: 'text-3xl sm:text-2xl md:text-3xl',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

const modalDescriptionStyle = tv({
  base: [
    'text-gray-600 mb-6',
    // 반응형 텍스트 크기
    'sm:text-sm md:text-base',
  ],
  variants: {
    size: {
      sm: 'text-sm sm:text-xs md:text-sm',
      md: 'text-base sm:text-sm md:text-base',
      lg: 'text-lg sm:text-base md:text-lg',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

interface ModalProps extends AriaAttributes {
  /** 모달 열림/닫힘 상태 */
  isOpen: boolean;
  /** 모달 닫기 함수 */
  onClose: () => void;
  /** 모달 제목 (접근성을 위한 필수 요소) */
  title: string;
  /** 모달 내용 */
  children: ReactNode;
  /** 모달 설명 (선택사항) */
  description?: string;
  /** 모달 크기 */
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  /** 모달 패딩 */
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  /** 최대 높이 */
  maxHeight?: 'sm' | 'md' | 'lg' | 'full';
  /** 오버레이 패딩 */
  overlayPadding?: 'sm' | 'md' | 'lg';
  /** 제목 크기 */
  titleSize?: 'sm' | 'md' | 'lg';
  /** 설명 크기 */
  descriptionSize?: 'sm' | 'md' | 'lg';
}

/**
 * 접근성을 고려한 모달 컨테이너 컴포넌트
 */
export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  description,
  size = 'md',
  padding = 'lg',
  maxHeight = 'lg',
  overlayPadding = 'md',
  titleSize = 'md',
  descriptionSize = 'md',
  ...ariaProps
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();

  // 포커스 가능한 요소들을 찾는 함수
  const getFocusableElements = useCallback(
    (container: HTMLElement): HTMLElement[] => {
      const focusableSelectors = [
        'button:not([disabled])',
        'input:not([disabled])',
        'textarea:not([disabled])',
        'select:not([disabled])',
        'a[href]',
        '[tabindex]:not([tabindex="-1"])',
      ].join(', ');

      return Array.from(container.querySelectorAll(focusableSelectors));
    },
    []
  );

  // 포커스 트래핑 구현
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!modalRef.current) return;

      const focusableElements = getFocusableElements(modalRef.current);
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.key === 'Tab') {
        if (event.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement?.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement?.focus();
          }
        }
      }
    },
    [getFocusableElements]
  );

  // 모달 열림 시 포커스 관리
  useEffect(() => {
    if (isOpen) {
      // 현재 포커스된 요소 저장
      previousFocusRef.current = document.activeElement as HTMLElement;

      // 모달 제목으로 포커스 이동
      setTimeout(() => {
        titleRef.current?.focus();
      }, 100);

      // 키보드 이벤트 리스너 추가
      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, handleKeyDown]);

  // 모달 닫힘 시 포커스 복원
  useEffect(() => {
    if (!isOpen && previousFocusRef.current) {
      setTimeout(() => {
        previousFocusRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // 오버레이 클릭 처리
  const handleOverlayClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // 키보드 이벤트 처리 (오버레이용) - ESC는 useModal에서 처리하므로 제거
  const handleOverlayKeyDown = (event: React.KeyboardEvent) => {
    // 다른 키보드 이벤트가 필요한 경우 여기에 추가
    event.stopPropagation();
  };

  if (!isOpen) return null;

  const modalElement = (
    // biome-ignore lint/a11y/noStaticElementInteractions: 모달 오버레이는 배경 클릭으로 닫기 기능이 필요
    <div
      className={modalOverlay({ padding: overlayPadding })}
      role="presentation"
      onClick={handleOverlayClick}
      onKeyDown={handleOverlayKeyDown}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        {...ariaProps}
        className={modalContentStyle({ size, padding, maxHeight })}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <h2
          id={titleId}
          ref={titleRef}
          tabIndex={-1}
          className={modalTitleStyle({ size: titleSize })}
        >
          {title}
        </h2>

        {description && (
          <p
            id={descriptionId}
            className={modalDescriptionStyle({ size: descriptionSize })}
          >
            {description}
          </p>
        )}

        {children}
      </div>
    </div>
  );

  // 포털을 이용한 모달 렌더링
  return createPortal(modalElement, document.body);
};
