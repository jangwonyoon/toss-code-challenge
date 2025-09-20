import { ApplicationForm } from './components/ApplicationForm';
import { Modal } from './components/Modal';
import { Button } from './components/ui/Button';
import { useModal } from './hooks/useModal';
import type { FormData } from './schemas/formSchema';

const ModalFormPage = () => {
  const { state, openModal, closeModal, submitForm, openFormModal } =
    useModal();

  /**
   * 명령적 API 사용 예시
   */
  const handleOpenModal = () => {
    const buttonElement = document.activeElement as HTMLElement;
    openModal(buttonElement);
  };

  /**
   * 선언적 API 사용 예시
   */
  const _handleOpenFormModal = async () => {
    try {
      const result = await openFormModal();
      if (result) {
        console.log('제출된 데이터:', result);
        // 성공적으로 폼이 제출됨
        alert(`안녕하세요 ${result.name}님! 신청이 완료되었습니다.`);
      } else {
        console.log('사용자가 취소했습니다');
        // 사용자가 취소하거나 모달을 닫음
      }
    } catch (error: unknown) {
      console.error('모달 열기 실패:', error);
      if (
        error instanceof Error &&
        'code' in error &&
        error.code === 'ALREADY_OPEN'
      ) {
        alert('이미 모달이 열려있습니다.');
      } else {
        alert('모달을 열 수 없습니다. 다시 시도해주세요.');
      }
    }
  };

  const handleFormSubmit = async (data: FormData): Promise<void> => {
    try {
      await submitForm(data);
    } catch (error) {
      console.error('폼 제출 실패:', error);
      // 에러 처리는 필요에 따라 추가
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <Button
          onClick={handleOpenModal}
          variant="primary"
          size="xl"
          className="gap-2 shadow-lg hover:shadow-xl"
        >
          <span className="text-xl">🚀</span>
          신청 폼 작성하기
        </Button>
      </div>

      <Modal
        isOpen={state.isOpen}
        onClose={closeModal}
        title="신청 폼"
        description="이메일과 FE 경력 연차 등 간단한 정보를 입력해주세요."
        size="2xl"
        padding="lg"
        maxHeight="lg"
        overlayPadding="md"
        titleSize="lg"
        descriptionSize="md"
      >
        <div className="py-4">
          <ApplicationForm
            onSubmit={handleFormSubmit}
            onCancel={closeModal}
            showSuccess={state.showSuccess}
          />
        </div>
      </Modal>
    </div>
  );
};

export default ModalFormPage;
