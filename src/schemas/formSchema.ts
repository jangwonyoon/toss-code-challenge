import { z } from 'zod';

export const formSchema = z.object({
  name: z
    .string('이름을 입력해주세요')
    .min(1, '이름을 입력해주세요')
    .min(2, '이름은 최소 2글자 이상이어야 합니다')
    .max(50, '이름은 50글자를 초과할 수 없습니다')
    .regex(/^[가-힣a-zA-Z\s]+$/, '이름은 한글, 영문, 공백만 입력 가능합니다'),

  email: z.email('이메일을 입력해주세요').min(1),

  experience: z.string('경력을 선택해주세요').min(1, '경력을 선택해주세요'),

  github: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val.trim() === '') return true; // 빈 값은 허용
        return /^https:\/\/github\.com\/[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_.-]+)*\/?$/.test(
          val,
        );
      },
      {
        message:
          '올바른 GitHub URL 형식이 아닙니다 (예: https://github.com/username)',
      },
    )
    .refine(
      (val) => {
        if (!val || val.trim() === '') return true; // 빈 값은 허용
        try {
          new URL(val);
          return true;
        } catch {
          return false;
        }
      },
      {
        message: '올바른 URL 형식이 아닙니다',
      },
    ),
});

export type FormData = z.infer<typeof formSchema>;
