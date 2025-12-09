import { useEffect, useState } from 'react';
import ReactNativeHapticFeedback, {
  HapticFeedbackTypes,
} from 'react-native-haptic-feedback';

type hepticType = keyof typeof HapticFeedbackTypes;

export default function useHeptic(
  initialTime: number = 500,
  initialHepticOption: hepticType = HapticFeedbackTypes.selection,
) {
  const [time, setTime] = useState(initialTime);
  const [hepticOption, setHepticOption] =
    useState<hepticType>(initialHepticOption);

  useEffect(() => {
    const id = setInterval(() => {
      ReactNativeHapticFeedback.trigger(hepticOption);
    }, time);

    return () => clearInterval(id);
  }, [time, hepticOption]);

  return { setTime, setHepticOption };
}
