import { useCallback, useState } from 'react';

type Return = [boolean, () => void, () => void];

export const useModal = (initialValue: boolean = false): Return => {
  const [isOpen, setIsOpen] = useState<boolean>(initialValue);

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return [isOpen, openModal, closeModal];
};
