import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ProfileStackNavigationProp } from '@/navigation/types';
import { Main, Header } from '@profile/components';
import { UseProfileViewModel } from '@/view-model';

export default function ProfileScreen({
  navigation,
}: {
  navigation: ProfileStackNavigationProp;
}) {
  const viewModel = UseProfileViewModel(navigation);

  return (
    <View style={styles.container}>
      <Header viewModel={viewModel.header} />
      <Main viewModel={viewModel.main} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
    flex: 1,
  },
});
