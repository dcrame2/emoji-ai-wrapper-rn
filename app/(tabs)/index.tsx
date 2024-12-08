import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

interface EmojiResponse {
  emojis: string;
}

export default function App(): JSX.Element {
  const [prompt, setPrompt] = useState<string>('');
  const [emojis, setEmojis] = useState<string[]>([]);
  const [numOfEmojis, setNumOfEmojis] = useState<string>('6');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (): Promise<void> => {
    if (!prompt || !numOfEmojis) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        'http://emoji-ai-wrapper.vercel.app/api/getEmojis',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt,
            numOfEmojis: parseInt(numOfEmojis, 10),
          }),
        }
      );

      const data: EmojiResponse = await response.json();

      if (response.ok) {
        setEmojis((prevEmojis) => [...prevEmojis, data.emojis]);
      } else {
        Alert.alert('Error', data.emojis || 'Something went wrong');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch emojis');
    } finally {
      setLoading(false);
    }
  };

  const handleClearEmojis = (): void => {
    setEmojis([]);
    setPrompt('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.title}>Get Emojis from Prompt</Text>

      <TextInput
        style={styles.input}
        placeholder='Enter a sentence'
        placeholderTextColor='#000'
        value={prompt}
        onChangeText={setPrompt}
        multiline
        numberOfLines={4}
      />
      <TextInput
        style={styles.input}
        placeholder='Number of emojis'
        value={numOfEmojis}
        onChangeText={setNumOfEmojis}
        keyboardType='numeric'
      />

      <View style={styles.buttonContainer}>
        <Button
          title={loading ? 'Generating...' : 'Generate Emojis'}
          onPress={handleSubmit}
          disabled={loading}
        />
        <Button
          title='Clear'
          onPress={handleClearEmojis}
          disabled={emojis.length === 0}
          color='red'
        />
      </View>

      <FlatList
        style={styles.mainEmojiContainer}
        data={emojis}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text style={styles.emojiContainer}>{item}</Text>
        )}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center', // Centers content vertically
    alignItems: 'center', // Centers content horizontally
    padding: 20,
    paddingTop: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '80%', // Ensures consistent width for inputs
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  mainEmojiContainer: {
    width: '80%',
  },
  emojiContainer: {
    fontSize: 16,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
    textAlign: 'left',
  },
});
