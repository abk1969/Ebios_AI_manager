import React from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import Button from '@/components/ui/button';
import MissionForm from './MissionForm';
import type { Mission } from '@/types/ebios';

interface NewMissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Mission>) => Promise<void>;
  initialData?: Mission;
}

const NewMissionModal: React.FC<NewMissionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto w-full max-w-md rounded-lg bg-white p-6">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-lg font-medium text-gray-900">
              Create New Mission
            </Dialog.Title>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4">
            <MissionForm
              onSubmit={(data) => {
                onSubmit(data);
                onClose();
              }}
            />
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default NewMissionModal;