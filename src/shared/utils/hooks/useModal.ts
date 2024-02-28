import { useCallback, useState } from 'react';

type Return = [boolean, () => void, () => void];

export const useModal = (): Return => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return [isOpen, openModal, closeModal];
};
