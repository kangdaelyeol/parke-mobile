/* eslint-disable react-hooks/exhaustive-deps */
import { db } from '../firebaseApp';
import { update, ref, serverTimestamp } from 'firebase/database';
import { useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { convertPhone } from '../helpers/convertPhone';
import { cache } from '../storage';
import { useNavigation } from '@react-navigation/native';
import { manager } from '../background/manager';

/* For Background
 import { BleManager } from 'react-native-ble-plx';
 import { CHAR_UUID, SERVICE_UUID } from '../constants';
 import { Buffer } from 'buffer';
 import { useNavigation } from '@react-navigation/native';
 const manager = new BleManager();
*/

export const useScanComplete = (route: any) => {
  const navigation = useNavigation<any>();
  const deviceId = route?.params?.value ?? 'abc';

  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);

  const isKeyValid = useMemo(() => deviceId && deviceId.length > 0, [deviceId]);

  useEffect(() => {
    manager.stopDeviceScan();
    const phoneNumber = cache.getPhone();
    if (phoneNumber) setPhone(phoneNumber);
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

      await update(ref(db, `device/${deviceId}`), {
        phone,
        updatedAt: serverTimestamp(),
      });

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

  // For Background
  /*
  useEffect(() => {
    manager.startDeviceScan([SERVICE_UUID], null, async (error, device) => {
      console.log(error, device);
      if (error || !device) return;

      if ((device.name ?? '').startsWith('Parke') === false) return;

      try {
        manager.stopDeviceScan();
        const d = await device.connect();
        await d.discoverAllServicesAndCharacteristics();

        const ch = await d.readCharacteristicForService(
          SERVICE_UUID,
          CHAR_UUID,
        );

        const id = Buffer.from(ch.value ?? '', 'base64').toString('utf-8');

        navigation.replace('ScanComplete', { value: id });

        const snap = await get(ref(db, `user/${getAppScopedId()}`));

        if (!snap.val()) return;

        const snapVal = snap.val();

        if (id === snapVal.deviceId) {
          update(ref(db, `user/${getAppScopedId()}`), {
            phone: snapVal.phone,
            updatedAt: serverTimestamp(),
          });
        }

        await d.cancelConnection();
      } catch {}
    });
  }, []);
  */

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
