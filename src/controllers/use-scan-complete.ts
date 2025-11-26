/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { convertPhone } from '../helpers/convertPhone';
import { cache } from '../storage';
import { useNavigation } from '@react-navigation/native';
import { manager } from '../background/manager';
import { deviceService } from '../services';

/* For Background
 import { BleManager } from 'react-native-ble-plx';
 import { CHAR_UUID, SERVICE_UUID } from '../constants';
 import { Buffer } from 'buffer';
 import { useNavigation } from '@react-navigation/native';
 const manager = new BleManager();
*/

export const useScanComplete = (route: any) => {
  const { updatePhoneNumber } = deviceService;
  const navigation = useNavigation<any>();
  const deviceId = route?.params?.value ?? 'abc';

  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);

  const isKeyValid = useMemo(() => deviceId && deviceId.length > 0, [deviceId]);

  useEffect(() => {
    const phoneNumber = cache.getPhone();
    if (phoneNumber) setPhone(phoneNumber);
    return () => {
      manager.stopDeviceScan();
    };
  }, []);

  const savePhone = async () => {
    if (!isKeyValid) {
      Alert.alert('오류', '장치 키값(value)이 없습니다.');
      return;
    }

    if (!phone.trim()) {
      Alert.alert('입력 필요', '휴대폰 번호를 입력해 주세요.');
      return;
    }

    try {
      setSaving(true);

      await updatePhoneNumber(deviceId, phone);

      Alert.alert('저장 성공!');

      cache.setPhone(phone);
      cache.setBLEDeviceId(deviceId);
      navigation.replace('Home');
    } catch (e: any) {
      console.warn(e);
      Alert.alert('저장 실패', e?.message ?? '알 수 없는 오류');
    } finally {
      setSaving(false);
    }
  };

  const convertedPhone = convertPhone(phone);

  return {
    convertedPhone,
    isKeyValid,
    deviceId,
    setPhone,
    savePhone,
    saving,
  };
};
