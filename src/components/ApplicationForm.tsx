import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { EXPERIENCE_OPTIONS } from '../constants';
import { type FormData, formSchema } from '../schemas/formSchema';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';

interface ApplicationFormProps {
  onSubmit: (data: FormData) => Promise<void>; // 제출 핸들러
  onCancel?: () => void; // 취소 핸들러
  showSuccess?: boolean; // 성공 메시지 표시
}

export const ApplicationForm = ({
  onSubmit,
  onCancel,
  showSuccess = false,
}: ApplicationFormProps) => {
  const {
    control,
    handleSubmit,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur', // 포커스가 벗어날 때 유효성 검사
    defaultValues: {
      name: '',
      email: '',
      experience: '', // 기본값을 빈 문자열로 설정
      github: '',
    },
  });

  // 에러 발생 시 해당 필드로 포커스 이동
  useEffect(() => {
    const firstErrorField = Object.keys(errors)[0] as keyof FormData;
    if (firstErrorField) {
      setTimeout(() => {
        setFocus(firstErrorField);
      }, 100);
    }
  }, [errors, setFocus]);

  const handleFormSubmit = async (data: FormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('폼 제출 중 오류 발생:', error);
      // 에러 토스트나 알림을 표시할 수 있음
      alert('제출 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  // 성공 메시지 표시
  if (showSuccess) {
    return <SucessForm />;
  }

  return (
    <div>
      {/* 스크린 리더를 위한 상태 알림 영역 */}
      <output aria-live="polite" aria-atomic="true" className="sr-only">
        {isSubmitting && '폼을 제출하고 있습니다...'}
        {Object.keys(errors).length > 0 &&
          `폼에 ${Object.keys(errors).length}개의 오류가 있습니다. 첫 번째 오류 필드로 이동합니다.`}
      </output>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="이름 / 닉네임"
              placeholder="홍길동"
              required
              error={errors.name?.message}
              helperText="한글 또는 영문으로 입력해주세요"
              autoComplete="name"
            />
          )}
        />

        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="이메일"
              type="email"
              placeholder="example@email.com"
              required
              error={errors.email?.message}
              helperText="연락 가능한 이메일 주소를 입력해주세요"
              autoComplete="email"
            />
          )}
        />

        <Controller
          name="experience"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              label="FE 경력 연차"
              placeholder="경력을 선택해주세요"
              options={EXPERIENCE_OPTIONS}
              required
              error={errors.experience?.message}
              helperText="현재 프론트엔드 개발 경력을 선택해주세요"
            />
          )}
        />

        <Controller
          name="github"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="GitHub 링크 (선택)"
              type="url"
              placeholder="https://github.com/username"
              error={errors.github?.message}
              helperText="GitHub 프로필 또는 주요 레포지토리 URL을 입력해주세요 (선택사항)"
              autoComplete="url"
            />
          )}
        />

        <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="secondary"
            disabled={isSubmitting}
            onClick={onCancel}
          >
            취소
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <svg
                  aria-hidden="true"
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                제출 중...
              </>
            ) : (
              '제출하기'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

function SucessForm() {
  return (
    <div className="text-center py-8" role="alert" aria-live="assertive">
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
        <svg
          className="h-6 w-6 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">제출 완료!</h3>
      <p className="text-gray-600">
        신청이 성공적으로 제출되었습니다.
        <br />곧 연락드리겠습니다.
      </p>
    </div>
  );
}
