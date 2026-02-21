import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LogoText } from '@/assets/logo';
import { CARD_HEIGHT, CARD_WIDTH } from '@home/constants';
import { useScanCompleteContext } from '@/contexts/scan-complete-context';

type CardProps = {
  deviceId: string;
};

export const Card = ({ deviceId }: CardProps) => {
  const {
    state: { name, phone, message },
  } = useScanCompleteContext();

  return (
    <View style={styles.container}>
      <View style={styles.bottomBackground} />
      <View style={styles.wrapper}>
        <LogoText width={50} height={45} />
        <View style={styles.deviceIdLabel}>
          <Text style={styles.deviceIdTitle}>device ID</Text>
          <Text style={styles.deviceId}>{deviceId}1923091203120931</Text>
          <View style={styles.row} />
          <Text style={styles.deviceIdTitle}>serial</Text>
        </View>
        <Text style={styles.message}>{message}</Text>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.phone}>{phone}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 'auto',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#1f222b',
    borderRadius: 20,
    overflow: 'hidden',
  },
  wrapper: {
    ...StyleSheet.absoluteFillObject,
    paddingHorizontal: 10,
  },

  title: {
    position: 'absolute',
    bottom: 30,
    right: 10,
    fontSize: 16,
    fontWeight: '400',
    color: '#cccccc',
  },
  phone: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    fontSize: 14,
    fontWeight: '400',
    color: '#cccccc',
  },
  bottomBackground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'rgba(38, 43, 55, 0.51)',
  },
  ellipsis: { color: '#fff', position: 'absolute', right: 15, top: 13 },
  message: {
    color: '#616161',
    position: 'absolute',
    left: 10,
    bottom: 65,
    fontSize: 15,
  },
  autoChange: {
    position: 'absolute',
    left: 14,
    bottom: 10,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  icon: {
    width: 10,
    height: 10,
    borderRadius: '50%',
  },
  deviceIdLabel: {
    position: 'absolute',
    top: 10,
    right: 10,
    // flexDirection: 'row',
  },
  deviceIdTitle: {
    color: '#7b86ff',
    fontSize: 11,
    fontWeight: 500,
  },
  deviceId: {
    color: '#000000',
    fontSize: 10,
    fontWeight: 500,
    textAlign: 'right',
  },
  row: {
    height: 1,
    backgroundColor: '#00032d',
    marginVertical: 2,
  },
});
