import { Button } from '@/components/Button';

type Props = {
  buttons: {
    label: string;
    variant: 'primary' | 'secondary';
    onClick?: () => void;
    disabled?: boolean;
  }[];
};

export default function RecordActionButtons({ buttons }: Props) {
  return (
    <div className="flex flex-wrap justify-end gap-3 pt-2">
      {buttons.map((btn, idx) => (
        <Button
          key={`${btn.label}-${idx}`}
          variant={btn.variant}
          size="fixed"
          onClick={btn.onClick}
          disabled={btn.disabled}
        >
          {btn.label}
        </Button>
      ))}
    </div>
  );
}
