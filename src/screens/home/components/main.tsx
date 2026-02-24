import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { unlink } from '@react-native-seoul/kakao-login';
import { useNavigation } from '@react-navigation/native';
import { useUserContext } from '@/contexts';
import { CARD_HEIGHT, CARD_WIDTH, SLIDER_GAP } from '@home/constants';
import { EmptyCard, SettingCard, CardOption, Card } from '@home/components';
import { cache } from '@/storage';
import { CardDto } from '@/domain/card';
import { cardService, userService } from '@/services';
import { HomeStackNavigationProp } from '@/navigation/types';
import { useHomeMainViewModel } from '@/view-model';

const Test = () => {
  const [busy, setBusy] = useState(false);
  const navigation = useNavigation<HomeStackNavigationProp>();
  const { setCards, user } = useUserContext();
  return (
    <>
      {/* Test Buttons */}
      <Text
        onPress={async () => {
          if (busy) return;
          setBusy(true);
          try {
            unlink();
            cache.setHasSeenOnBoarding(false);
            navigation.navigate('OnBoarding');
          } catch (e) {
            console.log('login err', e);
          } finally {
            setBusy(false);
          }
        }}
        style={styles.test}
      >
        RESET
      </Text>
      <Text
        onPress={async () => {
          const res = await cardService.create({
            id: String(Date.now()),
            title: 'test title',
            message: 'test message',
            phone: '01012311231',
            updatedAt: Date.now(),
            updatedBy: 'test',
            autoChange: false,
            deviceId: 'test',
            ownerList: [],
          });
          if (res === null) Alert.alert('오류가 발생했');

          await userService.updateCardIdList(user.id, [
            ...user.cardIdList,
            res?.id ?? '',
          ]);
          setCards(prev => [...prev, { ...res }] as CardDto[]);
        }}
        style={styles.test2}
      >
        addCard
      </Text>
    </>
  );
};

export const Main = () => {
  const { state, actions } = useHomeMainViewModel();

  return (
    <View style={styles.main}>
      
      <Test />
      <View style={styles.mainWrapper}>
        {!state.isSetting && state.cards[state.selectedCardIdx] && (
          <>
            <View style={styles.title}>
              <Text style={styles.titleText}>My parke list</Text>
            </View>
          </>
        )}
        <GestureDetector gesture={actions.panGesture}>
          <Animated.View
            style={[styles.cardContainer, state.sliderAnimatedStyle]}
          >
            <View style={styles.cardSlider}>
              <Animated.View
                style={[state.animatedStyle, styles.cardSliderMover]}
              >
                {state.cards &&
                  state.cards.map((card, idx) => (
                    <Card key={idx} {...card} idx={idx} />
                  ))}
                <EmptyCard idx={state.cardLength} />
              </Animated.View>
            </View>
          </Animated.View>
        </GestureDetector>
        {!state.isSetting && state.cards[state.selectedCardIdx] && (
          <CardOption card={state.cards[state.selectedCardIdx]} />
        )}
        {state.isSetting && (
          <SettingCard card={state.cards[state.selectedCardIdx]} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    width: '100%',
    flex: 1,
  },
  mainWrapper: {
    width: '100%',
    maxWidth: 480,
    marginHorizontal: 'auto',
    paddingBottom: 200,
    flex: 1,
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginHorizontal: 'auto',
  },
  cardSlider: {
    width: CARD_WIDTH,
  },
  cardSliderMover: {
    flexDirection: 'row',
    gap: SLIDER_GAP,
  },
  title: {
    position: 'absolute',
    top: 110,
    width: '100%',
  },
  titleText: {
    marginHorizontal: 'auto',
    color: '#ffffffd8',
    fontSize: 40,
    fontWeight: 'bold',
  },
  test: {
    position: 'absolute',
    top: 30,
    left: 30,
    fontWeight: 'bold',
    fontSize: 20,
    color: '#1234d9',
  },
  test2: {
    position: 'absolute',
    top: 30,
    left: 120,
    fontWeight: 'bold',
    fontSize: 20,
    color: '#1234d9',
  },
});
