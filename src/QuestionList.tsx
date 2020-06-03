import React, { useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import RNPickerSelect from 'react-native-picker-select'
import axios from 'axios'

export default function QuestionListScreen() {
  axios
    .get('https://polls.apiblueprint.org/questions')
    .then((response) => setQuestions(response.data))
    .catch((err) => console.error(err))

  const [questions, setQuestions] = useState([])
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Voting App</Text>
      {questions.map((question) => (
        <QuestionDetail question={question} key={question.url} />
      ))}
    </View>
  )
}

type Question = {
  question: {
    question: string
    choices: []
  }
}

const QuestionDetail = ({ question }: Question) => {
  const [choicesAreVisible, toggleChoices] = useState(false)
  return (
    <>
      <TouchableOpacity
        style={styles.questionDetail}
        onPress={() => toggleChoices(!choicesAreVisible)}
      >
        <Text style={styles.questionText}>{question.question}</Text>
      </TouchableOpacity>
      {choicesAreVisible && <QuestionChoices choices={question.choices} />}
    </>
  )
}

const QuestionChoices = ({ choices }) => {
  choices.forEach((choice: object) => {
    choice.label = choice.choice
    choice.value = choice.choice
  })
  return (
    <RNPickerSelect
      onValueChange={(value) => console.log(value)}
      items={choices}
      onDonePress={() =>
        axios
          .post(`https://polls.apiblueprint.org${choices.url}`)
          .then((response) => console.log(response.data))
          .catch((err) => console.log('Error', err))
      }
    />
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 30,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 24,
    fontWeight: '600',
  },
  questionDetail: {
    width: 300,
    height: 'auto',
    justifyContent: 'center',
    margin: 4,
    padding: 4,
    borderRadius: 20,
    flexWrap: 'wrap',
  },
  questionChoices: {
    width: 300,
    borderWidth: 2,
    borderColor: 'white',
    justifyContent: 'center',
  },
  choiceBox: {
    margin: 5,
    backgroundColor: '#F1F5FF',
    padding: 4,
    borderRadius: 20,
  },
  questionText: {
    width: 300,
    color: '#29395F',
    padding: 5,
    fontSize: 20,
    fontWeight: '600',
  },
  choiceText: {
    fontSize: 16,
    padding: 5,
    color: '#2a2a2a',
  },
})
