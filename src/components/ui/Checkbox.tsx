import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { cn } from '@/lib/utils';

// TODO: make controlled (optional)
interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof View> {
  label?: string;
  labelClasses?: string;
  checkboxClasses?: string;
  checked?: boolean;
  onValueChange?: (checked: boolean) => void;
}
function Checkbox({
  label,
  labelClasses,
  checkboxClasses,
  className,
  checked,
  onValueChange,
  ...props
}: CheckboxProps) {
  const [internalChecked, setInternalChecked] = useState(false);
  const isChecked = checked !== undefined ? checked : internalChecked;

  const toggleCheckbox = () => {
    const newValue = !isChecked;
    if (checked === undefined) setInternalChecked(newValue);
    if (onValueChange) onValueChange(newValue);
  };

  return (
    <View
      className={cn('flex flex-row items-center gap-2 ', className)}
      {...props}
    >
      <TouchableOpacity className='flex flex-row items-center gap-2' onPress={toggleCheckbox}>
        <View
          className={cn(
            'w-4 h-4 border border-primary rounded bg-background flex justify-center items-center ',
            {
              'bg-primary': isChecked,
            },
            checkboxClasses
          )}
        >
          {isChecked && <Text className="text-primary-foreground text-xs">✓</Text>}
        </View>
        {label && (
          <Text className={cn('text-foreground', labelClasses)}>{label}</Text>
        )}
      </TouchableOpacity>
      
    </View>
  );
}

export { Checkbox };
