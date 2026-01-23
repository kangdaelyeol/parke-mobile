import {
  useCardSettingContext,
  useCardSliderContext,
  useUserContext,
} from '@/contexts';

export const useCardOption = () => {
  const { selectedCard } = useCardSliderContext();
  const { cardSettingController } = useCardSettingContext();
  const user = useUserContext();

  const handlers = {
    onEditPressed: () => {
      cardSettingController.showSetting(selectedCard);
    },
    onDeletePressed: () => {},
    onPreviewPressed: () => {},
    onAutoChangePressed: () => {},
    onChangePhonePressed: () => {},
  };

  return { user, handlers };
};
