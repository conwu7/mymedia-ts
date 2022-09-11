export type UniversalModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: JSX.Element | (() => JSX.Element) | string | null;
  title?: string;
  style?: {
    contentContainerBackgroundColor?: string;
  };
};
