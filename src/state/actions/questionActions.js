import {
  GET_QUESTIONS,
  ADD_QUESTION,
  DELETE_QUESTION,
  UPDATE_QUESTION,
  UPDATE_QUESTION_STATUS
} from './types';

export const getQuestions = (params) => ({
  type: GET_QUESTIONS,
  pages: params,
});

export const deleteQuestion = (id) => ({
  type: DELETE_QUESTION,
  id: id,
});

export const addQuestion = (newQuestion) => ({
  type: ADD_QUESTION,
  newQuestion: newQuestion,
});

export const updateQuestion = (newQuestion) => ({
  type: UPDATE_QUESTION,
  newQuestion: newQuestion,
});

export const updateQuestionStatus = ({ status, id }) => ({
  type: UPDATE_QUESTION_STATUS,
  params: { status, id },
});