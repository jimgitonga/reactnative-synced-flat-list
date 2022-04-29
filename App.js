/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';

import {
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Easing,
  FlatList,
  Animated,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  Image,
  useColorScheme,
  View,
} from 'react-native';
import {API_URL, API_KEY} from './config';

const {width, height} = Dimensions.get('window');
const IMAGE_SIZE = 80;
const SPACING = 10;
const fetchDataFromApi = async () => {
  const response = await fetch(API_URL, {headers: {Authorization: API_KEY}});
  const {photos} = await response.json();
  return photos;
};

function App() {
  const [images, setImages] = useState([]);
  const [ActiveIndex, setActiveIndexState] = useState(0);
  const topRef = React.useRef(null);
  const thumbNailmRef = React.useRef(null);
  useEffect(() => {
    const fetchData = async () => {
      const photos = await fetchDataFromApi();
      setImages(photos);
    };
    fetchData();
  }, []);
  const scrollActiveIndex = index => {
    setActiveIndexState(index);
    topRef?.current?.scrollToOffset({offset: index * width, animated: true});
    if (index * (IMAGE_SIZE + SPACING) - IMAGE_SIZE / 2 > width / 2) {
      thumbNailmRef?.current?.scrollToOffset({
        offset: index * (IMAGE_SIZE + SPACING) - width / 2 + IMAGE_SIZE / 2,
        animated: true,
      });
    }
    else{
      thumbNailmRef?.current?.scrollToOffset({
        offset: 0,
        animated: true,
      });
    }
  
 
  };
  if (!images) {
    return;
    <Text>Loading...</Text>;
  }

  return (
    <View style={{flex: 1, backgroundColor: '#000'}}>
         <StatusBar hidden />
      <FlatList
        ref={topRef}
        data={images}
        keyExtractor={item => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={ev => {
          scrollActiveIndex(Math.floor(ev.nativeEvent.contentOffset.x / width));
        }}
        renderItem={({item}) => {
          return (
            <View style={{width, height}}>
              <Image
                source={{uri: item.src.portrait}}
                style={[StyleSheet.absoluteFillObject]}
              />
            </View>
          );
        }}
      />
      <FlatList
        ref={thumbNailmRef}
        data={images}
        keyExtractor={item => item.id.toString()}
        horizontal
     
        style={{position: 'absolute', bottom: IMAGE_SIZE}}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{paddingHorizontal: SPACING}}
        renderItem={({item, index}) => {
          return (
            <TouchableOpacity onPress={() => scrollActiveIndex(index)}>
              <Image
                source={{uri: item.src.portrait}}
                style={{
                  width: IMAGE_SIZE,
                  height: IMAGE_SIZE,
                  borderRadius: 12,
                  marginRight: SPACING,
                  borderWidth: 2,
                  borderColor: ActiveIndex === index ? '#fff' : 'transparent',
                }}
              />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
